'use server';

import { dbSupabase } from '@/lib/prisma/prisma';
import {
  Envelope,
  RevenueTimelineResponse,
  RevenueDistributionResponse,
  DailyCashFlowResponse,
} from '../types/dashboard.types';
import dayjs from 'dayjs';
import { unstable_cache } from 'next/cache';
import { CACHE_CONFIGS, CACHE_KEYS } from '../components/constants/cache';

/**
 * Función interna para obtener datos de recaudación por período (sin cache)
 */
async function _getRevenueTimeline(
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
  startDate?: string,
  endDate?: string
): Promise<RevenueTimelineResponse> {
  const start = startDate ? dayjs(startDate) : dayjs().subtract(12, 'months');
  const end = endDate ? dayjs(endDate) : dayjs();

  const data: RevenueTimelineResponse['data'] = [];

  // Generar períodos según el tipo solicitado
  let current = start.clone();
  while (
    current.isBefore(end) ||
    current.isSame(end, period === 'daily' ? 'day' : 'month')
  ) {
    const periodStart = current
      .startOf(period === 'daily' ? 'day' : 'month')
      .toDate();
    const periodEnd = current
      .endOf(period === 'daily' ? 'day' : 'month')
      .toDate();
    const periodKey = current.format(
      period === 'daily' ? 'YYYY-MM-DD' : 'YYYY-MM'
    );

    // Obtener datos para este período
    const [receipts, invoices] = await Promise.all([
      // Recibos confirmados en el período
      dbSupabase.receipt.findMany({
        where: {
          confirmed_at: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        select: {
          amount: true,
          tax_type: true,
        },
      }),
      // Facturas pagadas en el período
      dbSupabase.invoice.findMany({
        where: {
          payment_date: {
            gte: periodStart,
            lte: periodEnd,
          },
          status: 'approved',
        },
        select: {
          total_amount: true,
          affidavit: {
            select: {
              declarable_tax: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Categorizar por tipo de impuesto
    let patent = 0;
    let commercialActivity = 0;
    let properties = 0;
    let cementery = 0;
    let others = 0;

    // Procesar recibos
    receipts.forEach((receipt) => {
      const amount = receipt.amount;
      switch (receipt.tax_type.toLowerCase()) {
        case 'patente':
          patent += amount;
          break;
        case 'inmueble':
          properties += amount;
          break;
        case 'cementerio':
          cementery += amount;
          break;
        default:
          others += amount;
      }
    });

    // Procesar facturas (asumiendo que son principalmente actividad comercial)
    invoices.forEach((invoice) => {
      commercialActivity += invoice.total_amount;
    });

    const total = patent + commercialActivity + properties + cementery + others;

    data.push({
      period: periodKey,
      commercialActivity,
      properties,
      cementery,
      others,
      total,
    });

    // Avanzar al siguiente período
    current = current.add(1, period === 'daily' ? 'day' : 'month');
  }

  return {
    data,
    period,
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
  };
}

/**
 * Función cacheada para obtener datos de recaudación por período
 */
const getRevenueTimelineCached = unstable_cache(
  _getRevenueTimeline,
  [CACHE_KEYS.REVENUE_TIMELINE('monthly', undefined, undefined)],
  {
    tags: [...CACHE_CONFIGS.REVENUE_DATA.tags],
    revalidate: CACHE_CONFIGS.REVENUE_DATA.revalidate,
  }
);

/**
 * Obtiene datos de recaudación por período (línea de tiempo) con cache
 */
export const getRevenueTimeline = async (
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
  startDate?: string,
  endDate?: string
): Promise<Envelope<RevenueTimelineResponse>> => {
  const response: Envelope<RevenueTimelineResponse> = {
    success: true,
    data: null,
    error: null,
  };

  try {
    response.data = await getRevenueTimelineCached(period, startDate, endDate);
  } catch (error) {
    console.error('Error getting revenue timeline:', error);
    response.success = false;
    response.error =
      error instanceof Error ? error.message : 'Error desconocido';
  }

  return response;
};

/**
 * Función interna para obtener distribución de recaudación (sin cache)
 */
async function _getRevenueDistribution(
  startDate?: string,
  endDate?: string
): Promise<RevenueDistributionResponse> {
  const start = startDate ? dayjs(startDate) : dayjs().startOf('month');
  const end = endDate ? dayjs(endDate) : dayjs().endOf('month');

  const [receipts, invoices] = await Promise.all([
    // Recibos confirmados en el período
    dbSupabase.receipt.findMany({
      where: {
        confirmed_at: {
          gte: start.toDate(),
          lte: end.toDate(),
        },
      },
      select: {
        amount: true,
        tax_type: true,
      },
    }),
    // Facturas pagadas en el período
    dbSupabase.invoice.findMany({
      where: {
        payment_date: {
          gte: start.toDate(),
          lte: end.toDate(),
        },
        status: 'approved',
      },
      select: {
        total_amount: true,
      },
    }),
  ]);

  // Agrupar por tipo
  const distribution: Record<string, number> = {
    'Actividad Comercial': 0,
    Inmueble: 0,
    Cementerio: 0,
    Patente: 0,
    'Tasas Diversas': 0,
  };

  // Procesar recibos
  receipts.forEach((receipt) => {
    const amount = receipt.amount;
    switch (receipt.tax_type.toLowerCase()) {
      case 'patente':
        distribution['Patente'] += amount;
        break;
      case 'inmueble':
        distribution['Inmueble'] += amount;
        break;
      case 'cementerio':
        distribution['Cementerio'] += amount;
        break;
      default:
        distribution['Tasas Diversas'] += amount;
    }
  });

  // Agregar facturas a actividad comercial
  const invoiceTotal = invoices.reduce(
    (sum, invoice) => sum + invoice.total_amount,
    0
  );
  distribution['Actividad Comercial'] += invoiceTotal;

  // Calcular total y porcentajes
  const totalAmount = Object.values(distribution).reduce(
    (sum, amount) => sum + amount,
    0
  );

  const colors = ['#e76e50', '#2a9d90', '#274754', '#e8c468', '#f4a462'];

  const data = Object.entries(distribution)
    .filter(([_, amount]) => amount > 0) // Solo tipos con recaudación
    .map(([type, amount], index) => ({
      type,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.amount - a.amount); // Ordenar por monto descendente

  return {
    data,
    totalAmount,
  };
}

/**
 * Función cacheada para obtener distribución de recaudación
 */
const getRevenueDistributionCached = unstable_cache(
  _getRevenueDistribution,
  [CACHE_KEYS.REVENUE_DISTRIBUTION(undefined, undefined)],
  {
    tags: [...CACHE_CONFIGS.REVENUE_DATA.tags],
    revalidate: CACHE_CONFIGS.REVENUE_DATA.revalidate,
  }
);

/**
 * Obtiene distribución de recaudación por tipo de impuesto con cache
 */
export const getRevenueDistribution = async (
  startDate?: string,
  endDate?: string
): Promise<Envelope<RevenueDistributionResponse>> => {
  const response: Envelope<RevenueDistributionResponse> = {
    success: true,
    data: null,
    error: null,
  };

  try {
    response.data = await getRevenueDistributionCached(startDate, endDate);
  } catch (error) {
    console.error('Error getting revenue distribution:', error);
    response.success = false;
    response.error =
      error instanceof Error ? error.message : 'Error desconocido';
  }

  return response;
};

/**
 * Función interna para obtener flujo de caja diario (sin cache)
 */
async function _getDailyCashFlow(
  startDate?: string,
  endDate?: string
): Promise<DailyCashFlowResponse> {
  const start = startDate ? dayjs(startDate) : dayjs().subtract(30, 'days');
  const end = endDate ? dayjs(endDate) : dayjs();

  const data: DailyCashFlowResponse['data'] = [];
  let cumulativeFlow = 0;

  // Generar días
  let current = start.clone();
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    const dayStart = current.startOf('day').toDate();
    const dayEnd = current.endOf('day').toDate();
    const dayKey = current.format('YYYY-MM-DD');

    // Obtener ingresos del día (recibos confirmados)
    const receipts = await dbSupabase.receipt.findMany({
      where: {
        confirmed_at: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: {
        amount: true,
      },
    });

    // Obtener egresos del día (facturas pagadas)
    const invoices = await dbSupabase.invoice.findMany({
      where: {
        payment_date: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: 'approved',
      },
      select: {
        total_amount: true,
      },
    });

    const income = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const expenses = invoices.reduce(
      (sum, invoice) => sum + invoice.total_amount,
      0
    );
    const netFlow = income - expenses;
    cumulativeFlow += netFlow;

    data.push({
      date: dayKey,
      income,
      expenses,
      netFlow,
      cumulativeFlow,
    });

    // Avanzar al siguiente día
    current = current.add(1, 'day');
  }

  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const finalNetFlow = totalIncome - totalExpenses;

  return {
    data,
    period: {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
    },
    summary: {
      totalIncome,
      totalExpenses,
      netFlow: finalNetFlow,
    },
  };
}

/**
 * Función cacheada para obtener flujo de caja diario
 */
const getDailyCashFlowCached = unstable_cache(
  _getDailyCashFlow,
  [CACHE_KEYS.DAILY_CASH_FLOW(undefined, undefined)],
  {
    tags: [...CACHE_CONFIGS.REVENUE_DATA.tags],
    revalidate: CACHE_CONFIGS.REVENUE_DATA.revalidate,
  }
);

/**
 * Obtiene flujo de caja diario con cache
 */
export const getDailyCashFlow = async (
  startDate?: string,
  endDate?: string
): Promise<Envelope<DailyCashFlowResponse>> => {
  const response: Envelope<DailyCashFlowResponse> = {
    success: true,
    data: null,
    error: null,
  };

  try {
    response.data = await getDailyCashFlowCached(startDate, endDate);
  } catch (error) {
    console.error('Error getting daily cash flow:', error);
    response.success = false;
    response.error =
      error instanceof Error ? error.message : 'Error desconocido';
  }

  return response;
};
