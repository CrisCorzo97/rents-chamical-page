'use client';

import { useState, useEffect, useCallback } from 'react';
import { Envelope, LoadingState } from '../types/dashboard.types';
import { invalidateDashboardCache } from '../services/cache.service';

// ============================================================================
// TIPOS PARA EL HOOK
// ============================================================================

interface UseDashboardDataOptions<T> {
  initialData?: T;
  autoRefresh?: boolean;
  refreshInterval?: number; // en milisegundos
  onError?: (error: string) => void;
  onSuccess?: (data: T) => void;
}

interface UseDashboardDataReturn<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
  invalidateCache: () => Promise<void>;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook personalizado para manejar datos del dashboard con cache de Next.js
 */
export function useDashboardData<T>(
  fetchFunction: () => Promise<Envelope<T>>,
  options: UseDashboardDataOptions<T> = {}
): UseDashboardDataReturn<T> {
  const {
    initialData,
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutos por defecto
    onError,
    onSuccess,
  } = options;

  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    isError: false,
    lastUpdated: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  // Función para obtener datos
  const fetchData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, isLoading: true, isError: false }));
      setError(null);

      const response = await fetchFunction();

      if (response.success && response.data) {
        setData(response.data);
        setLoading({
          isLoading: false,
          isError: false,
          lastUpdated: new Date().toISOString(),
        });
        onSuccess?.(response.data);
      } else {
        throw new Error(response.error || 'Error desconocido al obtener datos');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setLoading({
        isLoading: false,
        isError: true,
        error: errorMessage,
        lastUpdated: new Date().toISOString(),
      });
      onError?.(errorMessage);
    }
  }, [fetchFunction, onSuccess, onError]);

  // Función para invalidar cache
  const invalidateCache = useCallback(async () => {
    try {
      await invalidateDashboardCache();
      // Refetch automático después de invalidar cache
      await fetchData();
    } catch (err) {
      console.error('Error invalidating cache:', err);
    }
  }, [fetchData]);

  // Función para refetch manual
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Efecto para auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache,
  };
}

// ============================================================================
// HOOKS ESPECÍFICOS PARA CADA TIPO DE DATO
// ============================================================================

/**
 * Hook para métricas financieras
 */
export function useFinancialMetrics(autoRefresh = false) {
  const fetchMetrics = async () => {
    const response = await fetch('/api/dashboard/financial-metrics');
    return response.json();
  };

  return useDashboardData(fetchMetrics, {
    autoRefresh,
    refreshInterval: 300000, // 5 minutos
  });
}

/**
 * Hook para datos de recaudación por período
 */
export function useRevenueTimeline(
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
  startDate?: string,
  endDate?: string,
  autoRefresh = false
) {
  const fetchRevenueTimeline = async () => {
    const params = new URLSearchParams({
      period,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const response = await fetch(`/api/dashboard/revenue-timeline?${params}`);
    return response.json();
  };

  return useDashboardData(fetchRevenueTimeline, {
    autoRefresh,
    refreshInterval: 600000, // 10 minutos
  });
}

/**
 * Hook para distribución de recaudación
 */
export function useRevenueDistribution(
  startDate?: string,
  endDate?: string,
  autoRefresh = false
) {
  const fetchRevenueDistribution = async () => {
    const params = new URLSearchParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const response = await fetch(
      `/api/dashboard/revenue-distribution?${params}`
    );
    return response.json();
  };

  return useDashboardData(fetchRevenueDistribution, {
    autoRefresh,
    refreshInterval: 600000, // 10 minutos
  });
}

/**
 * Hook para estado de declaraciones
 */
export function useDeclarationStatus(autoRefresh = false) {
  const fetchDeclarationStatus = async () => {
    const response = await fetch('/api/dashboard/declaration-status');
    return response.json();
  };

  return useDashboardData(fetchDeclarationStatus, {
    autoRefresh,
    refreshInterval: 120000, // 2 minutos
  });
}

/**
 * Hook para flujo de caja diario
 */
export function useDailyCashFlow(
  startDate?: string,
  endDate?: string,
  autoRefresh = false
) {
  const fetchDailyCashFlow = async () => {
    const params = new URLSearchParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const response = await fetch(`/api/dashboard/daily-cash-flow?${params}`);
    return response.json();
  };

  return useDashboardData(fetchDailyCashFlow, {
    autoRefresh,
    refreshInterval: 300000, // 5 minutos
  });
}

/**
 * Hook para comparativa mensual
 */
export function useMonthlyComparison(autoRefresh = false) {
  const fetchMonthlyComparison = async () => {
    const response = await fetch('/api/dashboard/monthly-comparison');
    return response.json();
  };

  return useDashboardData(fetchMonthlyComparison, {
    autoRefresh,
    refreshInterval: 3600000, // 1 hora
  });
}

// ============================================================================
// HOOKS DE UTILIDAD
// ============================================================================

/**
 * Hook para manejar múltiples datos del dashboard
 */
export function useDashboardDataMultiple<T extends Record<string, any>>(
  dataFetchers: Record<keyof T, () => Promise<Envelope<any>>>,
  options: UseDashboardDataOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    isError: false,
    lastUpdated: undefined,
  });
  const [errors, setErrors] = useState<Record<keyof T, string | null>>(
    {} as any
  );

  const fetchAllData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, isLoading: true, isError: false }));
      setErrors({} as any);

      const results = await Promise.allSettled(
        Object.entries(dataFetchers).map(async ([key, fetcher]) => {
          const response = await fetcher();
          return { key, response };
        })
      );

      const newData: Partial<T> = {};
      const newErrors: Partial<Record<keyof T, string | null>> = {};
      let hasErrors = false;

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { key, response } = result.value;
          if (response.success && response.data) {
            newData[key as keyof T] = response.data;
          } else {
            newErrors[key as keyof T] = response.error || 'Error desconocido';
            hasErrors = true;
          }
        } else {
          const key = Object.keys(dataFetchers)[results.indexOf(result)];
          newErrors[key as keyof T] = 'Error en la petición';
          hasErrors = true;
        }
      });

      setData(newData as T);
      setErrors(newErrors as Record<keyof T, string | null>);
      setLoading({
        isLoading: false,
        isError: hasErrors,
        lastUpdated: new Date().toISOString(),
      });

      if (!hasErrors && options.onSuccess) {
        options.onSuccess(newData as T);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setLoading({
        isLoading: false,
        isError: true,
        error: errorMessage,
        lastUpdated: new Date().toISOString(),
      });
      options.onError?.(errorMessage);
    }
  }, [dataFetchers, options]);

  const refetch = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const invalidateCache = useCallback(async () => {
    try {
      await invalidateDashboardCache();
      await fetchAllData();
    } catch (err) {
      console.error('Error invalidating cache:', err);
    }
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    loading,
    errors,
    refetch,
    invalidateCache,
  };
}
