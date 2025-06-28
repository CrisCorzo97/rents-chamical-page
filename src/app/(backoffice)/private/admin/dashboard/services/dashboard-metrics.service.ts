'use server';

import { dbSupabase } from '@/lib/prisma/prisma';
import { Envelope, FinancialMetrics } from '../types/dashboard.types';
import dayjs from 'dayjs';
import { unstable_cache } from 'next/cache';
import { CACHE_CONFIGS, CACHE_KEYS } from '../components/constants/cache';

/**
 * Función interna para obtener métricas financieras (sin cache)
 */
async function _getFinancialMetrics(): Promise<FinancialMetrics> {
  // Fecha actual para cálculos
  const now = dayjs();
  const startOfMonth = now.startOf('month').toDate();
  const endOfMonth = now.endOf('month').toDate();

  // 1. Total recaudado (recibos confirmados + facturas pagadas)
  const [confirmedReceipts, paidInvoices] = await Promise.all([
    // Recibos confirmados del mes actual
    dbSupabase.receipt.findMany({
      where: {
        confirmed_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        amount: true,
      },
    }),
    // Facturas pagadas del mes actual
    dbSupabase.invoice.findMany({
      where: {
        payment_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: 'approved',
      },
      select: {
        total_amount: true,
      },
    }),
  ]);

  const totalCollected =
    confirmedReceipts.reduce((sum, receipt) => sum + receipt.amount, 0) +
    paidInvoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);

  // 2. Total pendiente (declaraciones pendientes de pago + multas impagas)
  const [pendingAffidavits, unpaidPenalties] = await Promise.all([
    // Declaraciones pendientes de pago
    dbSupabase.affidavit.findMany({
      where: {
        status: {
          in: ['pending_payment', 'refused', 'under_review'],
        },
      },
      select: {
        fee_amount: true,
      },
    }),
    // Multas impagas
    dbSupabase.tax_penalties.findMany({
      where: {
        payment_date: null,
      },
      select: {
        amount: true,
      },
    }),
  ]);

  const totalPending =
    pendingAffidavits.reduce(
      (sum, affidavit) => sum + affidavit.fee_amount,
      0
    ) + unpaidPenalties.reduce((sum, penalty) => sum + penalty.amount, 0);

  // 3. Total de multas
  const totalPenalties = unpaidPenalties.reduce(
    (sum, penalty) => sum + penalty.amount,
    0
  );

  // 4. Total de habilitaciones comerciales activas
  const totalCommercialEnablements =
    await dbSupabase.commercial_enablement.count({
      where: {
        cancellation_date: null, // No canceladas
      },
    });

  // 5. Total de propiedades
  const totalProperties = await dbSupabase.property.count();

  // 6. Total de cementerio
  const totalCementery = await dbSupabase.cementery.count();

  return {
    totalCollected,
    totalPending,
    totalPenalties,
    totalCommercialEnablements,
    totalProperties,
    totalCementery,
  };
}

/**
 * Función cacheada para obtener métricas financieras
 */
const getFinancialMetricsCached = unstable_cache(
  _getFinancialMetrics,
  [CACHE_KEYS.FINANCIAL_METRICS],
  {
    tags: [...CACHE_CONFIGS.FINANCIAL_METRICS.tags],
    revalidate: CACHE_CONFIGS.FINANCIAL_METRICS.revalidate,
  }
);

/**
 * Obtiene las métricas financieras principales del dashboard con cache
 */
export const getFinancialMetrics = async (): Promise<
  Envelope<FinancialMetrics>
> => {
  const response: Envelope<FinancialMetrics> = {
    success: true,
    data: null,
    error: null,
  };

  try {
    response.data = await getFinancialMetricsCached();
  } catch (error) {
    console.error('Error getting financial metrics:', error);
    response.success = false;
    response.error =
      error instanceof Error ? error.message : 'Error desconocido';
  }

  return response;
};

/**
 * Obtiene las métricas financieras sin cache (para testing o refresh manual)
 */
export const getFinancialMetricsNoCache = async (): Promise<
  Envelope<FinancialMetrics>
> => {
  const response: Envelope<FinancialMetrics> = {
    success: true,
    data: null,
    error: null,
  };

  try {
    response.data = await _getFinancialMetrics();
  } catch (error) {
    console.error('Error getting financial metrics (no cache):', error);
    response.success = false;
    response.error =
      error instanceof Error ? error.message : 'Error desconocido';
  }

  return response;
};
