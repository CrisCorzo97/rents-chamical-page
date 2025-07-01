// Tipos para los datos del dashboard administrativo

// ============================================================================
// TIPOS BASE
// ============================================================================

export interface Envelope<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

// ============================================================================
// MÉTRICAS FINANCIERAS PRINCIPALES
// ============================================================================

export interface FinancialMetrics {
  totalCollected: number;
  totalPending: number;
  totalPenalties: number;
  totalCommercialEnablements: number;
  totalProperties: number;
  totalCementery: number;
}

// ============================================================================
// RECAUDACIÓN POR PERÍODO
// ============================================================================

export interface RevenueTimelineData {
  period: string;
  commercialActivity: number;
  properties: number;
  cementery: number;
  others: number;
  total: number;
}

export interface RevenueTimelineResponse {
  data: RevenueTimelineData[];
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

// ============================================================================
// DISTRIBUCIÓN DE RECAUDACIÓN POR TIPO
// ============================================================================

export interface RevenueDistributionData {
  type: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface RevenueDistributionResponse {
  data: RevenueDistributionData[];
  totalAmount: number;
}

// ============================================================================
// ESTADO DE DECLARACIONES
// ============================================================================

export interface DeclarationStatusData {
  status:
    | 'pending_payment'
    | 'under_review'
    | 'approved'
    | 'refused'
    | 'defeated';
  count: number;
  amount: number;
  percentage: number;
}

export interface DeclarationStatusResponse {
  data: DeclarationStatusData[];
  totalDeclarations: number;
  totalAmount: number;
}

// ============================================================================
// FLUJO DE CAJA DIARIO
// ============================================================================

export interface DailyCashFlowData {
  date: string;
  income: number;
  expenses: number;
  netFlow: number;
  cumulativeFlow: number;
}

export interface DailyCashFlowResponse {
  data: DailyCashFlowData[];
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netFlow: number;
  };
}

// ============================================================================
// COMPARATIVA MENSUAL
// ============================================================================

export interface MonthlyComparisonData {
  category: string;
  currentMonth: number;
  previousMonth: number;
  difference: number;
  percentageChange: number;
}

export interface MonthlyComparisonResponse {
  data: MonthlyComparisonData[];
  currentMonth: string;
  previousMonth: string;
  summary: {
    totalCurrent: number;
    totalPrevious: number;
    totalDifference: number;
    totalPercentageChange: number;
  };
}

// ============================================================================
// FILTROS Y PARÁMETROS
// ============================================================================

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  taxType?: string;
  status?: string;
}

export interface DashboardParams {
  filters?: DashboardFilters;
  refresh?: boolean;
}

// ============================================================================
// ESTADOS DE CARGA
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: string;
  lastUpdated?: string;
}

// ============================================================================
// CONFIGURACIÓN DE GRÁFICOS
// ============================================================================

export interface ChartConfig {
  colors: string[];
  height: number;
  width?: number;
  responsive?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
}

export interface ChartTheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  muted: string;
}

// ============================================================================
// TIPOS PARA CACHE
// ============================================================================

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  key: string;
  version?: string;
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version?: string;
}

// ============================================================================
// TIPOS PARA COMPONENTES
// ============================================================================

export interface ChartComponentProps<T> {
  data: T;
  loading: boolean;
  error?: string;
  config?: ChartConfig;
  onRefresh?: () => void;
}

export interface CardComponentProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  error?: string;
}
