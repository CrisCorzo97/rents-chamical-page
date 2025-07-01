'use server';

import { dbSupabase } from '@/lib/prisma/prisma';
import {
  Envelope,
  DeclarationStatusResponse,
  DailyCashFlowResponse,
  MonthlyComparisonResponse,
} from '../types/dashboard.types';
import dayjs from 'dayjs';
import { affidavit_status } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { CACHE_CONFIGS, CACHE_KEYS } from '../components/constants/cache';

/**
 * Función interna para obtener datos de estado de declaraciones (sin cache)
 */
async function _getDeclarationStatus(): Promise<DeclarationStatusResponse> {
  // Obtener todas las declaraciones agrupadas por estado
  const affidavits = await dbSupabase.affidavit.findMany({
    select: {
      status: true,
      fee_amount: true,
    },
  });

  // Agrupar por estado
  const statusMap: Record<affidavit_status, { count: number; amount: number }> =
    {
      pending_payment: { count: 0, amount: 0 },
      under_review: { count: 0, amount: 0 },
      approved: { count: 0, amount: 0 },
      refused: { count: 0, amount: 0 },
      defeated: { count: 0, amount: 0 },
    };

  affidavits.forEach((affidavit) => {
    const status = affidavit.status;
    if (statusMap[status]) {
      statusMap[status].count++;
      statusMap[status].amount += affidavit.fee_amount;
    }
  });

  const totalDeclarations = affidavits.length;
  const totalAmount = affidavits.reduce(
    (sum, affidavit) => sum + affidavit.fee_amount,
    0
  );

  // Convertir a formato de respuesta
  const statusLabels = {
    pending_payment: 'Pendiente de Pago',
    under_review: 'En Revisión',
    approved: 'Aprobada',
    refused: 'Rechazada',
    defeated: 'Vencida',
  };

  const data = Object.entries(statusMap).map(([status, data]) => ({
    status: status as DeclarationStatusResponse['data'][0]['status'],
    count: data.count,
    amount: data.amount,
    percentage:
      totalDeclarations > 0 ? (data.count / totalDeclarations) * 100 : 0,
  }));

  return {
    data,
    totalDeclarations,
    totalAmount,
  };
}

/**
 * Función cacheada para obtener estado de declaraciones
 */
const getDeclarationStatusCached = unstable_cache(
  _getDeclarationStatus,
  [CACHE_KEYS.DECLARATION_STATUS],
  {
    tags: [...CACHE_CONFIGS.DECLARATIONS_DATA.tags],
    revalidate: CACHE_CONFIGS.DECLARATIONS_DATA.revalidate,
  }
);

/**
 * Obtiene datos de estado de declaraciones con cache
 */
export const getDeclarationStatus = async (): Promise<
  Envelope<DeclarationStatusResponse>
> => {
  const response: Envelope<DeclarationStatusResponse> = {
    success: true,
    data: null,
    error: null,
  };

  try {
    response.data = await getDeclarationStatusCached();
  } catch (error) {
    console.error('Error getting declaration status:', error);
    response.success = false;
    response.error =
      error instanceof Error ? error.message : 'Error desconocido';
  }

  return response;
};

/**
 * Función interna para obtener datos de flujo de caja diario (sin cache)
 */
async function _getDailyCashFlow(
  startDate?: string,
  endDate?: string
): Promise<DailyCashFlowResponse> {
  const start = startDate ? dayjs(startDate) : dayjs().subtract(30, 'days');
  const end = endDate ? dayjs(endDate) : dayjs();

  const data: DailyCashFlowResponse['data'] = [];
  let cumulativeFlow = 0;

  // Generar datos día por día
  let current = start.clone();
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    const dayStart = current.startOf('day').toDate();
    const dayEnd = current.endOf('day').toDate();

    // Obtener ingresos del día (recibos confirmados + facturas pagadas)
    const [receipts, invoices] = await Promise.all([
      dbSupabase.receipt.findMany({
        where: {
          confirmed_at: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        select: {
          amount: true,
        },
      }),
      dbSupabase.invoice.findMany({
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
      }),
    ]);

    const income =
      receipts.reduce((sum, receipt) => sum + receipt.amount, 0) +
      invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);

    // Por ahora asumimos que no hay gastos registrados en el sistema
    const expenses = 0;
    const netFlow = income - expenses;
    cumulativeFlow += netFlow;

    data.push({
      date: current.format('YYYY-MM-DD'),
      income,
      expenses,
      netFlow,
      cumulativeFlow,
    });

    current = current.add(1, 'day');
  }

  const totalIncome = data.reduce((sum, day) => sum + day.income, 0);
  const totalExpenses = data.reduce((sum, day) => sum + day.expenses, 0);
  const netFlow = totalIncome - totalExpenses;

  return {
    data,
    period: {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
    },
    summary: {
      totalIncome,
      totalExpenses,
      netFlow,
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
    tags: [...CACHE_CONFIGS.CASH_FLOW.tags],
    revalidate: CACHE_CONFIGS.CASH_FLOW.revalidate,
  }
);

/**
 * Obtiene datos de flujo de caja diario con cache
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

/**
 * Función interna para obtener comparativa mensual (sin cache)
 */
async function _getMonthlyComparison(): Promise<MonthlyComparisonResponse> {
  const currentMonth = dayjs();
  const previousMonth = currentMonth.subtract(1, 'month');

  const currentMonthStart = currentMonth.startOf('month').toDate();
  const currentMonthEnd = currentMonth.endOf('month').toDate();
  const previousMonthStart = previousMonth.startOf('month').toDate();
  const previousMonthEnd = previousMonth.endOf('month').toDate();

  // Obtener datos del mes actual
  const [currentReceipts, currentInvoices] = await Promise.all([
    dbSupabase.receipt.findMany({
      where: {
        confirmed_at: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      select: {
        amount: true,
        tax_type: true,
      },
    }),
    dbSupabase.invoice.findMany({
      where: {
        payment_date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        status: 'approved',
      },
      select: {
        total_amount: true,
      },
    }),
  ]);

  // Obtener datos del mes anterior
  const [previousReceipts, previousInvoices] = await Promise.all([
    dbSupabase.receipt.findMany({
      where: {
        confirmed_at: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      select: {
        amount: true,
        tax_type: true,
      },
    }),
    dbSupabase.invoice.findMany({
      where: {
        payment_date: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
        status: 'approved',
      },
      select: {
        total_amount: true,
      },
    }),
  ]);

  // Categorizar datos
  const categorizeData = (receipts: any[], invoices: any[]) => {
    const categories: Record<string, number> = {
      'Actividad Comercial': 0,
      Inmueble: 0,
      Cementerio: 0,
      Patente: 0,
      'Tasas Diversas': 0,
    };

    receipts.forEach((receipt) => {
      const amount = receipt.amount;
      switch (receipt.tax_type.toLowerCase()) {
        case 'patente':
          categories['Patente'] += amount;
          break;
        case 'inmueble':
          categories['Inmueble'] += amount;
          break;
        case 'cementerio':
          categories['Cementerio'] += amount;
          break;
        default:
          categories['Tasas Diversas'] += amount;
      }
    });

    // Agregar facturas a actividad comercial
    const invoiceTotal = invoices.reduce(
      (sum, invoice) => sum + invoice.total_amount,
      0
    );
    categories['Actividad Comercial'] += invoiceTotal;

    return categories;
  };

  const currentCategories = categorizeData(currentReceipts, currentInvoices);
  const previousCategories = categorizeData(previousReceipts, previousInvoices);

  // Crear datos de comparación
  const data: MonthlyComparisonResponse['data'] = Object.keys(
    currentCategories
  ).map((category) => {
    const current = currentCategories[category];
    const previous = previousCategories[category];
    const difference = current - previous;
    const percentageChange = previous > 0 ? (difference / previous) * 100 : 0;

    return {
      category,
      currentMonth: current,
      previousMonth: previous,
      difference,
      percentageChange,
    };
  });

  const totalCurrent = Object.values(currentCategories).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalPrevious = Object.values(previousCategories).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalDifference = totalCurrent - totalPrevious;
  const totalPercentageChange =
    totalPrevious > 0 ? (totalDifference / totalPrevious) * 100 : 0;

  return {
    data,
    currentMonth: currentMonth.format('YYYY-MM'),
    previousMonth: previousMonth.format('YYYY-MM'),
    summary: {
      totalCurrent,
      totalPrevious,
      totalDifference,
      totalPercentageChange,
    },
  };
}

/**
 * Función cacheada para obtener comparativa mensual
 */
const getMonthlyComparisonCached = unstable_cache(
  _getMonthlyComparison,
  [CACHE_KEYS.MONTHLY_COMPARISON],
  {
    tags: [...CACHE_CONFIGS.MONTHLY_COMPARISON.tags],
    revalidate: CACHE_CONFIGS.MONTHLY_COMPARISON.revalidate,
  }
);

/**
 * Obtiene comparativa mensual con cache
 */
export const getMonthlyComparison = async (): Promise<
  Envelope<MonthlyComparisonResponse>
> => {
  const response: Envelope<MonthlyComparisonResponse> = {
    success: true,
    data: null,
    error: null,
  };

  try {
    response.data = await getMonthlyComparisonCached();
  } catch (error) {
    console.error('Error getting monthly comparison:', error);
    response.success = false;
    response.error =
      error instanceof Error ? error.message : 'Error desconocido';
  }

  return response;
};
