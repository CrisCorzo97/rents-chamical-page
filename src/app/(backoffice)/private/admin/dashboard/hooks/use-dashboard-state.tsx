'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface DashboardState {
  isLoading: boolean;
  isRefreshing: boolean;
  isExporting: boolean;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number;
  selectedPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  visibleCharts: {
    financialMetrics: boolean;
    revenueTimeline: boolean;
    revenueDistribution: boolean;
    declarationStatus: boolean;
    cashFlow: boolean;
  };
  lastUpdated: Date | null;
  nextRefresh: Date | null;
}

export interface DashboardActions {
  refresh: () => Promise<void>;
  refreshAll: () => Promise<void>;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setSelectedPeriod: (
    period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ) => void;
  setDateRange: (startDate: Date | null, endDate: Date | null) => void;
  toggleChart: (chartId: keyof DashboardState['visibleCharts']) => void;
  setChartVisibility: (
    chartId: keyof DashboardState['visibleCharts'],
    visible: boolean
  ) => void;
  exportData: (format: 'csv' | 'json' | 'txt') => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

const initialState: DashboardState = {
  isLoading: false,
  isRefreshing: false,
  isExporting: false,
  error: null,
  autoRefresh: true,
  refreshInterval: 300,
  selectedPeriod: 'monthly',
  dateRange: {
    startDate: null,
    endDate: null,
  },
  visibleCharts: {
    financialMetrics: true,
    revenueTimeline: true,
    revenueDistribution: true,
    declarationStatus: true,
    cashFlow: true,
  },
  lastUpdated: null,
  nextRefresh: null,
};

export function useDashboardState(): [DashboardState, DashboardActions] {
  const [state, setState] = useState<DashboardState>(initialState);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  const updateState = useCallback((updates: Partial<DashboardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const refresh = useCallback(async () => {
    try {
      updateState({ isRefreshing: true, error: null });
      console.log('Invalidating dashboard cache...');

      const now = new Date();
      const nextRefresh = new Date(
        now.getTime() + state.refreshInterval * 1000
      );

      updateState({
        lastUpdated: now,
        nextRefresh,
        isRefreshing: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      updateState({
        error: errorMessage,
        isRefreshing: false,
      });
    }
  }, [state.refreshInterval, updateState]);

  const refreshAll = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      console.log('Invalidating all dashboard caches...');

      const now = new Date();
      const nextRefresh = new Date(
        now.getTime() + state.refreshInterval * 1000
      );

      updateState({
        lastUpdated: now,
        nextRefresh,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      updateState({
        error: errorMessage,
        isLoading: false,
      });
    }
  }, [state.refreshInterval, updateState]);

  const exportData = useCallback(
    async (format: 'csv' | 'json' | 'txt') => {
      try {
        updateState({ isExporting: true, error: null });
        console.log(`Exporting data in ${format} format...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateState({ isExporting: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error desconocido';
        updateState({
          error: errorMessage,
          isExporting: false,
        });
      }
    },
    [updateState]
  );

  useEffect(() => {
    if (!state.autoRefresh) {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      return;
    }

    const scheduleNextRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        refresh();
        scheduleNextRefresh();
      }, state.refreshInterval * 1000);
    };

    scheduleNextRefresh();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [state.autoRefresh, state.refreshInterval, refresh]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const actions: DashboardActions = {
    refresh,
    refreshAll,

    setAutoRefresh: (enabled: boolean) => {
      updateState({ autoRefresh: enabled });
    },

    setRefreshInterval: (interval: number) => {
      updateState({ refreshInterval: interval });
    },

    setSelectedPeriod: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
      updateState({ selectedPeriod: period });
    },

    setDateRange: (startDate: Date | null, endDate: Date | null) => {
      updateState({
        dateRange: { startDate, endDate },
      });
    },

    toggleChart: (chartId: keyof DashboardState['visibleCharts']) => {
      updateState({
        visibleCharts: {
          ...state.visibleCharts,
          [chartId]: !state.visibleCharts[chartId],
        },
      });
    },

    setChartVisibility: (
      chartId: keyof DashboardState['visibleCharts'],
      visible: boolean
    ) => {
      updateState({
        visibleCharts: {
          ...state.visibleCharts,
          [chartId]: visible,
        },
      });
    },

    exportData,

    clearError: () => {
      updateState({ error: null });
    },

    setError: (error: string) => {
      updateState({ error });
    },
  };

  return [state, actions];
}

interface DashboardContextType {
  state: DashboardState;
  actions: DashboardActions;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, actions] = useDashboardState();

  return (
    <DashboardContext.Provider value={{ state, actions }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
