# Dashboard Administrativo - Sistema de Filtros y Refresh

## 📋 Resumen

Este documento describe la implementación del sistema de filtros y refresh funcional del dashboard administrativo. El sistema permite filtrar datos por fechas, períodos y actualizar automáticamente los gráficos.

## 🎯 Funcionalidades Implementadas

### ✅ Filtros de Fecha

- **DateRangePicker**: Selector de fechas con presets predefinidos
- **Filtros dinámicos**: Los gráficos se actualizan automáticamente al cambiar fechas
- **Presets**: Hoy, ayer, últimos 7/30 días, este mes, mes anterior, etc.
- **Validación**: Fechas válidas y rangos apropiados

### ✅ Sistema de Refresh

- **Refresh manual**: Botón para actualizar datos manualmente
- **Auto-refresh**: Actualización automática configurable (1min - 1hora)
- **Cache invalidation**: Invalidación inteligente del cache de Next.js
- **Estados de carga**: Indicadores visuales durante la actualización

### ✅ Estado Global

- **DashboardContext**: Estado centralizado para todo el dashboard
- **Filtros persistentes**: Los filtros se mantienen entre navegaciones
- **Configuración**: Auto-refresh, intervalos, visibilidad de gráficos

## 🏗️ Arquitectura

### Hooks Principales

#### `useDashboardState`

```typescript
// Estado global del dashboard
const [state, actions] = useDashboardState();

// Estado incluye:
(-isLoading,
  isRefreshing,
  isExporting - autoRefresh,
  refreshInterval - selectedPeriod,
  dateRange - visibleCharts,
  lastUpdated,
  nextRefresh -
    error -
    // Acciones incluyen:
    refresh(),
  refreshAll() - setAutoRefresh(),
  setRefreshInterval() - setSelectedPeriod(),
  setDateRange() - toggleChart(),
  setChartVisibility() - exportData(),
  clearError(),
  setError());
```

#### `useDashboardFilters`

```typescript
// Conecta filtros con datos
const { filters, updateFilters, resetFilters, refreshAllData } = useDashboardFilters();

// Funcionalidades:
- Inicialización automática de fechas por defecto
- Actualización de filtros con refresh automático
- Reset de filtros a valores por defecto
- Trigger para forzar refresh de todos los datos
```

#### `useDashboardData`

```typescript
// Hook base para datos con cache
const { data, loading, error, refetch, invalidateCache } = useDashboardData(
  fetchFunction,
  { autoRefresh, refreshInterval, onError, onSuccess }
);

// Hooks específicos:
-useFinancialMetrics() -
  useRevenueTimeline(period, startDate, endDate) -
  useRevenueDistribution(startDate, endDate) -
  useDeclarationStatus() -
  useDailyCashFlow(startDate, endDate);
```

### Componentes Principales

#### `DashboardContent`

- Componente principal que orquesta todo el dashboard
- Conecta hooks de estado y filtros
- Maneja eventos de refresh y exportación
- Renderiza gráficos condicionalmente según visibilidad

#### `DateRangePicker`

- Selector de fechas con presets
- Integrado con el estado global
- Triggers refresh automático al cambiar fechas
- Estados de loading y validación

#### `DashboardSettings`

- Panel de configuración del dashboard
- Control de auto-refresh e intervalos
- Visibilidad de gráficos
- Acciones rápidas (refresh, export)

#### `DashboardStatusSimple`

- Indicador de estado del dashboard
- Muestra última actualización
- Estados de error y loading
- Botón de refresh rápido

## 🔄 Flujo de Datos

### 1. Inicialización

```typescript
// Al cargar el dashboard:
1. DashboardProvider envuelve el contenido
2. useDashboardState inicializa estado global
3. useDashboardFilters establece fechas por defecto (últimos 30 días)
4. Los hooks de datos se ejecutan con filtros iniciales
```

### 2. Cambio de Filtros

```typescript
// Cuando el usuario cambia filtros:
1. DateRangePicker llama handleDateRangeChange()
2. updateFilters() actualiza estado global
3. refreshAllData() incrementa refreshTrigger
4. useEffect en useDashboardDataWithFilters detecta cambio
5. Todos los hooks de datos ejecutan refetch()
6. Los gráficos se actualizan con nuevos datos
```

### 3. Refresh Manual

```typescript
// Cuando el usuario hace refresh:
1. handleRefresh() se ejecuta
2. actions.refresh() actualiza estado
3. invalidateDashboardCache() limpia cache
4. refreshAllData() fuerza refresh de datos
5. Todos los gráficos se actualizan
```

### 4. Auto-Refresh

```typescript
// Auto-refresh configurado:
1. useEffect en useDashboardState programa timeout
2. Al expirar, ejecuta refresh()
3. Actualiza lastUpdated y nextRefresh
4. Los hooks con autoRefresh habilitado se actualizan
```

## 🎨 Interfaz de Usuario

### Controles Principales

- **Botón Refresh**: Actualización manual con indicador de loading
- **Botón Export**: Exportación de datos (simulada)
- **Configuración**: Panel desplegable con todas las opciones
- **Filtros de Fecha**: Selector con presets y calendario
- **Estado**: Indicador de última actualización y errores

### Estados Visuales

- **Loading**: Spinner en botones y gráficos
- **Error**: Mensajes de error con opción de cerrar
- **Success**: Indicadores de actualización exitosa
- **Auto-refresh**: Información de próxima actualización

## 🔧 Configuración

### Auto-Refresh

```typescript
// Intervalos disponibles:
- 1 minuto (60s)
- 5 minutos (300s) - Por defecto
- 10 minutos (600s)
- 30 minutos (1800s)
- 1 hora (3600s)
```

### Cache

```typescript
// Configuración por tipo de dato:
- Métricas Financieras: 5 minutos
- Datos de Recaudación: 10 minutos
- Estado de Declaraciones: 2 minutos
- Flujo de Caja: 5 minutos
- Comparativa Mensual: 1 hora
```

### Filtros por Defecto

```typescript
// Configuración inicial:
- Período: 'monthly'
- Fechas: Últimos 30 días
- Auto-refresh: true
- Intervalo: 5 minutos
- Todos los gráficos visibles
```

## 🚀 Uso

### Cambiar Filtros

1. Usar el `DateRangePicker` para seleccionar fechas
2. Los gráficos se actualizan automáticamente
3. Usar presets para selecciones rápidas
4. Botón "Resetear" para volver a valores por defecto

### Configurar Auto-Refresh

1. Abrir panel de configuración
2. Activar/desactivar auto-refresh
3. Seleccionar intervalo deseado
4. Los cambios se aplican inmediatamente

### Refresh Manual

1. Usar botón "Actualizar" en la barra superior
2. O usar botón en el panel de configuración
3. O usar botón en el indicador de estado
4. Todos los gráficos se actualizan simultáneamente

### Exportar Datos

1. Usar botón "Exportar" (funcionalidad simulada)
2. Se muestra indicador de progreso
3. Al completar se muestra confirmación

## 🐛 Troubleshooting

### Problemas Comunes

#### Los gráficos no se actualizan

- Verificar que los filtros estén aplicados correctamente
- Revisar la consola para errores de red
- Verificar que el cache se esté invalidando

#### Auto-refresh no funciona

- Verificar que esté activado en configuración
- Revisar el intervalo seleccionado
- Verificar que no haya errores bloqueando

#### Errores de datos

- Los errores se muestran en el indicador de estado
- Usar botón de refresh para reintentar
- Verificar conectividad de red

### Debug

```typescript
// Logs disponibles:
-'Dashboard refreshed successfully' -
  'Dashboard cache invalidated successfully' -
  'Error refreshing dashboard: [error]' -
  'Date range changed: [dates]';
```

## 📈 Próximas Mejoras

### Funcionalidades Pendientes

- [ ] Exportación real de datos (CSV, JSON, PDF)
- [ ] Más opciones de filtros (por tipo de impuesto, estado)
- [ ] Guardar configuración en localStorage
- [ ] Notificaciones push de actualizaciones
- [ ] Modo offline con datos cacheados

### Optimizaciones

- [ ] Debounce en cambios de filtros
- [ ] Lazy loading de gráficos no visibles
- [ ] Compresión de datos en cache
- [ ] Prefetch de datos próximos

## 📝 Notas Técnicas

### Dependencias

- `dayjs`: Manejo de fechas
- `date-fns`: Formateo de fechas
- `next/cache`: Sistema de cache
- `recharts`: Gráficos

### Performance

- Cache inteligente reduce consultas a la base de datos
- Debounce en filtros evita requests excesivos
- Lazy loading de componentes mejora tiempo de carga
- Auto-refresh controlado evita loops infinitos

### Seguridad

- Validación de fechas en frontend y backend
- Sanitización de parámetros de filtros
- Rate limiting en auto-refresh
- Manejo seguro de errores
