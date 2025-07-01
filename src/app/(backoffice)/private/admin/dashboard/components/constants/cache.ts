// ============================================================================
// CONFIGURACIÓN DE CACHE
// ============================================================================

export const CACHE_TAGS = {
  DASHBOARD_METRICS: 'dashboard-metrics',
  REVENUE_DATA: 'revenue-data',
  DECLARATIONS_DATA: 'declarations-data',
  FINANCIAL_METRICS: 'financial-metrics',
  REVENUE_TIMELINE: 'revenue-timeline',
  REVENUE_DISTRIBUTION: 'revenue-distribution',
  DECLARATION_STATUS: 'declaration-status',
  DAILY_CASH_FLOW: 'daily-cash-flow',
  MONTHLY_COMPARISON: 'monthly-comparison',
} as const;

export const CACHE_KEYS = {
  FINANCIAL_METRICS: 'financial-metrics',
  REVENUE_TIMELINE: (period: string, startDate?: string, endDate?: string) =>
    `revenue-timeline-${period}-${startDate || 'default'}-${endDate || 'default'}`,
  REVENUE_DISTRIBUTION: (startDate?: string, endDate?: string) =>
    `revenue-distribution-${startDate || 'default'}-${endDate || 'default'}`,
  DECLARATION_STATUS: 'declaration-status',
  DAILY_CASH_FLOW: (startDate?: string, endDate?: string) =>
    `daily-cash-flow-${startDate || 'default'}-${endDate || 'default'}`,
  MONTHLY_COMPARISON: 'monthly-comparison',
} as const;

// ============================================================================
// CONFIGURACIONES ESPECÍFICAS POR TIPO DE DATO
// ============================================================================

export const CACHE_CONFIGS = {
  // Métricas financieras - cache por 5 minutos
  FINANCIAL_METRICS: {
    revalidate: 300, // 5 minutos
    tags: [CACHE_TAGS.FINANCIAL_METRICS, CACHE_TAGS.DASHBOARD_METRICS],
  },

  // Datos de recaudación - cache por 10 minutos
  REVENUE_DATA: {
    revalidate: 600, // 10 minutos
    tags: [CACHE_TAGS.REVENUE_DATA, CACHE_TAGS.DASHBOARD_METRICS],
  },

  // Estado de declaraciones - cache por 2 minutos
  DECLARATIONS_DATA: {
    revalidate: 120, // 2 minutos
    tags: [CACHE_TAGS.DECLARATIONS_DATA, CACHE_TAGS.DASHBOARD_METRICS],
  },

  // Flujo de caja - cache por 5 minutos
  CASH_FLOW: {
    revalidate: 300, // 5 minutos
    tags: [CACHE_TAGS.DAILY_CASH_FLOW, CACHE_TAGS.DASHBOARD_METRICS],
  },

  // Comparativa mensual - cache por 1 hora
  MONTHLY_COMPARISON: {
    revalidate: 3600, // 1 hora
    tags: [CACHE_TAGS.MONTHLY_COMPARISON, CACHE_TAGS.DASHBOARD_METRICS],
  },
} as const;
