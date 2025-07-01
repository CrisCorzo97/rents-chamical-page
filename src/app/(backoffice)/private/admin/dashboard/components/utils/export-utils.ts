'use server';

import {
  FinancialMetrics,
  RevenueTimelineData,
  RevenueDistributionData,
  DeclarationStatusData,
  DailyCashFlowData,
} from '../../types/dashboard.types';
import { getFinancialMetrics } from '../../services/dashboard-metrics.service';
import {
  getRevenueTimeline,
  getRevenueDistribution,
  getDailyCashFlow,
} from '../../services/revenue-data.service';
import { getDeclarationStatus } from '../../services/declarations-data.service';
import { formatNumberToCurrency } from '@/lib/formatters';

// ============================================================================
// TIPOS DE EXPORTACIÓN
// ============================================================================

export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  includeCharts?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface ExportData {
  financialMetrics: FinancialMetrics;
  revenueTimeline: RevenueTimelineData[];
  revenueDistribution: RevenueDistributionData[];
  declarationStatus: DeclarationStatusData[];
  cashFlow: DailyCashFlowData[];
  metadata: {
    exportDate: string;
    dateRange?: string;
    period?: string;
  };
}

// ============================================================================
// FUNCIONES DE EXPORTACIÓN
// ============================================================================

/**
 * Obtiene todos los datos del dashboard para exportación
 */
export async function getDashboardDataForExport(
  options: ExportOptions
): Promise<ExportData> {
  try {
    // Obtener todos los datos en paralelo
    const [
      financialMetricsResponse,
      revenueTimelineResponse,
      revenueDistributionResponse,
      declarationStatusResponse,
      cashFlowResponse,
    ] = await Promise.all([
      getFinancialMetrics(),
      getRevenueTimeline(options.period || 'monthly'),
      getRevenueDistribution(),
      getDeclarationStatus(),
      getDailyCashFlow(),
    ]);

    // Verificar que todos los datos se obtuvieron correctamente
    if (!financialMetricsResponse.success || !financialMetricsResponse.data) {
      throw new Error('Error obteniendo métricas financieras');
    }

    if (!revenueTimelineResponse.success || !revenueTimelineResponse.data) {
      throw new Error('Error obteniendo timeline de ingresos');
    }

    if (
      !revenueDistributionResponse.success ||
      !revenueDistributionResponse.data
    ) {
      throw new Error('Error obteniendo distribución de ingresos');
    }

    if (!declarationStatusResponse.success || !declarationStatusResponse.data) {
      throw new Error('Error obteniendo estado de declaraciones');
    }

    if (!cashFlowResponse.success || !cashFlowResponse.data) {
      throw new Error('Error obteniendo flujo de caja');
    }

    return {
      financialMetrics: financialMetricsResponse.data,
      revenueTimeline: revenueTimelineResponse.data.data,
      revenueDistribution: revenueDistributionResponse.data.data,
      declarationStatus: declarationStatusResponse.data.data,
      cashFlow: cashFlowResponse.data.data,
      metadata: {
        exportDate: new Date().toISOString(),
        dateRange: options.dateRange
          ? `${options.dateRange.startDate} - ${options.dateRange.endDate}`
          : undefined,
        period: options.period,
      },
    };
  } catch (error) {
    console.error('Error getting dashboard data for export:', error);
    throw new Error('Error obteniendo datos para exportación');
  }
}

/**
 * Convierte datos a formato CSV
 */
export function convertToCSV(data: ExportData): string {
  const lines: string[] = [];

  // Encabezado
  lines.push('Dashboard Administrativo - Reporte de Datos');
  lines.push(
    `Fecha de Exportación: ${new Date(data.metadata.exportDate).toLocaleString('es-AR')}`
  );
  if (data.metadata.dateRange) {
    lines.push(`Período: ${data.metadata.dateRange}`);
  }
  if (data.metadata.period) {
    lines.push(`Frecuencia: ${data.metadata.period}`);
  }
  lines.push('');

  // Métricas Financieras
  lines.push('MÉTRICAS FINANCIERAS');
  lines.push('Concepto,Valor');
  lines.push(
    `Total Recaudado,${formatNumberToCurrency(data.financialMetrics.totalCollected)}`
  );
  lines.push(
    `Total Pendiente,${formatNumberToCurrency(data.financialMetrics.totalPending)}`
  );
  lines.push(
    `Total Multas,${formatNumberToCurrency(data.financialMetrics.totalPenalties)}`
  );
  lines.push(
    `Habilitaciones Comerciales,${data.financialMetrics.totalCommercialEnablements}`
  );
  lines.push(`Propiedades,${data.financialMetrics.totalProperties}`);
  lines.push(`Cementerio,${data.financialMetrics.totalCementery}`);
  lines.push('');

  // Timeline de Ingresos
  lines.push('EVOLUCIÓN DE INGRESOS');
  lines.push('Período,Actividad Comercial,Propiedades,Cementerio,Otros,Total');
  data.revenueTimeline.forEach((item) => {
    lines.push(
      `${item.period},${item.commercialActivity},${item.properties},${item.cementery},${item.others},${item.total}`
    );
  });
  lines.push('');

  // Distribución de Recaudación
  lines.push('DISTRIBUCIÓN DE RECAUDACIÓN');
  lines.push('Tipo,Monto,Porcentaje');
  data.revenueDistribution.forEach((item) => {
    lines.push(`${item.type},${item.amount},${item.percentage.toFixed(2)}%`);
  });
  lines.push('');

  // Estado de Declaraciones
  lines.push('ESTADO DE DECLARACIONES');
  lines.push('Estado,Cantidad,Monto,Porcentaje');
  data.declarationStatus.forEach((item) => {
    lines.push(
      `${item.status},${item.count},${formatNumberToCurrency(item.amount)},${item.percentage.toFixed(2)}%`
    );
  });
  lines.push('');

  // Flujo de Caja
  lines.push('FLUJO DE CAJA DIARIO');
  lines.push('Fecha,Ingresos,Egresos,Flujo Neto,Flujo Acumulado');
  data.cashFlow.forEach((item) => {
    lines.push(
      `${item.date},${item.income},${item.expenses},${item.netFlow},${item.cumulativeFlow}`
    );
  });

  return lines.join('\n');
}

/**
 * Convierte datos a formato JSON
 */
export function convertToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Genera un reporte en texto plano
 */
export function generateTextReport(data: ExportData): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('DASHBOARD ADMINISTRATIVO - REPORTE DE DATOS');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(
    `Fecha de Exportación: ${new Date(data.metadata.exportDate).toLocaleString('es-AR')}`
  );
  if (data.metadata.dateRange) {
    lines.push(`Período: ${data.metadata.dateRange}`);
  }
  if (data.metadata.period) {
    lines.push(`Frecuencia: ${data.metadata.period}`);
  }
  lines.push('');

  // Métricas Financieras
  lines.push('MÉTRICAS FINANCIERAS');
  lines.push('-'.repeat(30));
  lines.push(
    `Total Recaudado: ${formatNumberToCurrency(data.financialMetrics.totalCollected)}`
  );
  lines.push(
    `Total Pendiente: ${formatNumberToCurrency(data.financialMetrics.totalPending)}`
  );
  lines.push(
    `Total Multas: ${formatNumberToCurrency(data.financialMetrics.totalPenalties)}`
  );
  lines.push(
    `Habilitaciones Comerciales: ${data.financialMetrics.totalCommercialEnablements}`
  );
  lines.push(`Propiedades: ${data.financialMetrics.totalProperties}`);
  lines.push(`Cementerio: ${data.financialMetrics.totalCementery}`);
  lines.push('');

  // Resumen de Distribución
  lines.push('DISTRIBUCIÓN DE RECAUDACIÓN');
  lines.push('-'.repeat(30));
  data.revenueDistribution.forEach((item) => {
    lines.push(
      `${item.type}: ${formatNumberToCurrency(item.amount)} (${item.percentage.toFixed(1)}%)`
    );
  });
  lines.push('');

  // Resumen de Declaraciones
  lines.push('ESTADO DE DECLARACIONES');
  lines.push('-'.repeat(30));
  data.declarationStatus.forEach((item) => {
    lines.push(
      `${item.status}: ${item.count} declaraciones - ${formatNumberToCurrency(item.amount)}`
    );
  });
  lines.push('');

  // Resumen de Flujo de Caja
  const totalIncome = data.cashFlow.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.cashFlow.reduce(
    (sum, item) => sum + item.expenses,
    0
  );
  const netFlow = totalIncome - totalExpenses;

  lines.push('RESUMEN DE FLUJO DE CAJA');
  lines.push('-'.repeat(30));
  lines.push(`Total Ingresos: ${formatNumberToCurrency(totalIncome)}`);
  lines.push(`Total Egresos: ${formatNumberToCurrency(totalExpenses)}`);
  lines.push(`Flujo Neto: ${formatNumberToCurrency(netFlow)}`);
  lines.push('');

  lines.push('='.repeat(60));
  lines.push('FIN DEL REPORTE');
  lines.push('='.repeat(60));

  return lines.join('\n');
}

/**
 * Función principal de exportación
 */
export async function exportDashboardData(
  options: ExportOptions
): Promise<{ data: string; filename: string; contentType: string }> {
  try {
    const dashboardData = await getDashboardDataForExport(options);

    let data: string;
    let filename: string;
    let contentType: string;

    const timestamp = new Date().toISOString().split('T')[0];

    switch (options.format) {
      case 'csv':
        data = convertToCSV(dashboardData);
        filename = `dashboard-reporte-${timestamp}.csv`;
        contentType = 'text/csv';
        break;

      case 'json':
        data = convertToJSON(dashboardData);
        filename = `dashboard-datos-${timestamp}.json`;
        contentType = 'application/json';
        break;

      case 'xlsx':
        // TODO: Implementar exportación a Excel
        throw new Error('Exportación a Excel no implementada aún');

      case 'pdf':
        // TODO: Implementar exportación a PDF
        throw new Error('Exportación a PDF no implementada aún');

      default:
        data = generateTextReport(dashboardData);
        filename = `dashboard-reporte-${timestamp}.txt`;
        contentType = 'text/plain';
    }

    return { data, filename, contentType };
  } catch (error) {
    console.error('Error exporting dashboard data:', error);
    throw new Error('Error en la exportación de datos');
  }
}
