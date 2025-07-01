'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDashboard } from './use-dashboard-state';
import {
  useFinancialMetrics,
  useRevenueTimeline,
  useRevenueDistribution,
  useDeclarationStatus,
  useDailyCashFlow,
} from './use-dashboard-data';

// ============================================================================
// HOOK PARA CONECTAR FILTROS CON DATOS
// ============================================================================

export function useDashboardFilters() {
  const { state, actions } = useDashboard();

  // Estados para controlar el refresh de datos
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar fechas por defecto si no están establecidas
  useEffect(() => {
    if (
      !isInitialized &&
      !state.dateRange.startDate &&
      !state.dateRange.endDate
    ) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29); // Últimos 30 días
      actions.setDateRange(start, end);
      setIsInitialized(true);
    }
  }, [isInitialized, state.dateRange, actions]);

  // Función para forzar refresh de todos los datos
  const refreshAllData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Función para actualizar filtros y refrescar datos
  const updateFiltersAndRefresh = useCallback(
    async (updates: {
      startDate?: Date | null;
      endDate?: Date | null;
      period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    }) => {
      // Actualizar estado
      if (updates.startDate !== undefined || updates.endDate !== undefined) {
        actions.setDateRange(
          updates.startDate ?? state.dateRange.startDate,
          updates.endDate ?? state.dateRange.endDate
        );
      }

      if (updates.period) {
        actions.setSelectedPeriod(updates.period);
      }

      // Forzar refresh de datos
      refreshAllData();
    },
    [actions, state.dateRange, refreshAllData]
  );

  // Función para resetear filtros
  const resetFilters = useCallback(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29); // Últimos 30 días

    actions.setDateRange(start, end);
    actions.setSelectedPeriod('monthly');
    refreshAllData();
  }, [actions, refreshAllData]);

  return {
    // Estado actual
    filters: {
      startDate: state.dateRange.startDate,
      endDate: state.dateRange.endDate,
      period: state.selectedPeriod,
      autoRefresh: state.autoRefresh,
      refreshInterval: state.refreshInterval,
    },

    // Acciones
    updateFilters: updateFiltersAndRefresh,
    resetFilters,
    refreshAllData,

    // Trigger para forzar refresh
    refreshTrigger,

    // Estado de carga
    isLoading: state.isRefreshing,
    error: state.error,
  };
}

// ============================================================================
// HOOK PARA DATOS CON FILTROS APLICADOS
// ============================================================================

export function useDashboardDataWithFilters() {
  const { filters, refreshTrigger } = useDashboardFilters();

  // Convertir fechas a strings para los hooks
  const startDateString = filters.startDate?.toISOString();
  const endDateString = filters.endDate?.toISOString();

  // Hooks de datos con filtros aplicados
  const financialMetrics = useFinancialMetrics(filters.autoRefresh);
  const revenueTimeline = useRevenueTimeline(
    filters.period,
    startDateString,
    endDateString,
    filters.autoRefresh
  );
  const revenueDistribution = useRevenueDistribution(
    startDateString,
    endDateString,
    filters.autoRefresh
  );
  const declarationStatus = useDeclarationStatus(filters.autoRefresh);
  const dailyCashFlow = useDailyCashFlow(
    startDateString,
    endDateString,
    filters.autoRefresh
  );

  // Forzar refresh cuando cambian los filtros
  useEffect(() => {
    if (refreshTrigger > 0) {
      financialMetrics.refetch();
      revenueTimeline.refetch();
      revenueDistribution.refetch();
      declarationStatus.refetch();
      dailyCashFlow.refetch();
    }
  }, [
    refreshTrigger,
    financialMetrics,
    revenueTimeline,
    revenueDistribution,
    declarationStatus,
    dailyCashFlow,
  ]);

  return {
    // Datos
    financialMetrics: financialMetrics.data,
    revenueTimeline: revenueTimeline.data,
    revenueDistribution: revenueDistribution.data,
    declarationStatus: declarationStatus.data,
    dailyCashFlow: dailyCashFlow.data,

    // Estados de carga
    loading: {
      financialMetrics: financialMetrics.loading,
      revenueTimeline: revenueTimeline.loading,
      revenueDistribution: revenueDistribution.loading,
      declarationStatus: declarationStatus.loading,
      dailyCashFlow: dailyCashFlow.loading,
    },

    // Errores
    errors: {
      financialMetrics: financialMetrics.error,
      revenueTimeline: revenueTimeline.error,
      revenueDistribution: revenueDistribution.error,
      declarationStatus: declarationStatus.error,
      dailyCashFlow: dailyCashFlow.error,
    },

    // Acciones
    refetch: {
      financialMetrics: financialMetrics.refetch,
      revenueTimeline: revenueTimeline.refetch,
      revenueDistribution: revenueDistribution.refetch,
      declarationStatus: declarationStatus.refetch,
      dailyCashFlow: dailyCashFlow.refetch,
    },

    // Filtros actuales
    filters,
  };
}
