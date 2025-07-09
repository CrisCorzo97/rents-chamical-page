# Página Resumen - Contribuyente

## 📍 Ubicación

`src/app/(taxpayer_dashboard)/resumen/page.tsx`

## 🎯 Propósito

Esta página proporciona una vista general del estado fiscal del contribuyente, mostrando balances, obligaciones pendientes, pagos recientes y alertas importantes.

## 🏗️ Estructura

### Componentes Principales

- **ResumenPage**: Componente principal que renderiza la página
- **CardBalance**: Tarjeta que muestra el balance general
- **CardStatus**: Tarjeta que muestra el estado de obligaciones
- **CommercialLicense**: Componente para licencias comerciales
- **RecentPayments**: Lista de pagos recientes
- **PendingObligations**: Lista de obligaciones pendientes

### Funcionalidades

- ✅ Visualización de balance general
- ✅ Estado de obligaciones tributarias
- ✅ Licencias comerciales activas
- ✅ Pagos recientes
- ✅ Obligaciones pendientes
- ✅ Alertas y notificaciones importantes
- ✅ Acceso rápido a acciones principales

## 🔗 Dependencias

### Componentes UI Utilizados

- `Card` - [Ver documentación](../components/ui/card.doc.md)
- `Button` - [Ver documentación](../components/ui/button.doc.md)
- `Badge` - [Ver documentación](../components/ui/badge.doc.md)
- `Alert` - [Ver documentación](../components/ui/alert.doc.md)
- `Tabs` - [Ver documentación](../components/ui/tabs.doc.md)

### Hooks Utilizados

- `useTaxpayerContext` - [Ver documentación](../hooks/use-taxpayer-context.doc.md)
- `useOverviewData` - [Ver documentación](../hooks/use-overview-data.doc.md)
- `useRecentPayments` - [Ver documentación](../hooks/use-recent-payments.doc.md)

### Servicios Utilizados

- `getOverviewData` - [Ver documentación](../services/overview.action.doc.md)
- `getRecentPayments` - [Ver documentación](../services/payments.action.doc.md)

## 🔐 Seguridad

- Validación de autenticación mediante middleware
- Verificación de rol de contribuyente (role_id = 5)
- Filtrado de datos por contribuyente autenticado
- Protección de información sensible

## 📊 Estados de la Aplicación

### Estados de Carga

- `isLoading`: Durante la carga inicial de datos
- `isRefreshing`: Durante la actualización de datos
- `isCalculatingBalance`: Durante el cálculo de balance

### Estados de Error

- `loadError`: Errores durante la carga de datos
- `calculationError`: Errores en cálculos de balance
- `networkError`: Errores de conectividad

## 🎨 Interfaz de Usuario

### Secciones Principales

1. **Balance General**
   - Saldo a favor/deuda total
   - Resumen por tipo de obligación
   - Indicadores visuales de estado

2. **Estado de Obligaciones**
   - Obligaciones al día
   - Obligaciones vencidas
   - Próximos vencimientos

3. **Licencias Comerciales**
   - Licencias activas
   - Estado de habilitaciones
   - Fechas de vencimiento

4. **Actividad Reciente**
   - Últimos pagos realizados
   - Declaraciones presentadas
   - Notificaciones importantes

## 🔄 Flujo de Datos

### 1. Carga Inicial

```typescript
// Al cargar la página:
1. Verificar autenticación del contribuyente
2. Cargar datos de resumen desde API
3. Calcular balance general
4. Obtener pagos recientes
5. Renderizar componentes con datos
```

### 2. Actualización de Datos

```typescript
// Al actualizar datos:
1. Detectar cambios en contexto
2. Refrescar datos de resumen
3. Recalcular balance
4. Actualizar componentes
5. Mostrar indicadores de actualización
```

### 3. Navegación a Detalles

```typescript
// Al hacer clic en elementos:
1. Validar permisos de acceso
2. Navegar a página de detalles
3. Pasar parámetros necesarios
4. Mantener contexto de navegación
```

## 📈 Datos Mostrados

### Balance General

- **Saldo Total**: Suma de todas las obligaciones
- **A Favor**: Pagos en exceso
- **En Deuda**: Obligaciones pendientes
- **Próximos Vencimientos**: Obligaciones que vencen pronto

### Tipos de Obligaciones

- **Impuestos Municipales**: Tasas y contribuciones
- **Licencias Comerciales**: Habilitaciones comerciales
- **Patentes**: Licencias de actividad
- **Otros**: Otras obligaciones municipales

### Actividad Reciente

- **Últimos 5 Pagos**: Pagos realizados recientemente
- **Declaraciones**: Declaraciones presentadas
- **Notificaciones**: Alertas importantes del sistema

## 🚀 Optimizaciones

### Performance

- Carga lazy de componentes pesados
- Cache de datos de resumen
- Optimización de cálculos de balance
- Debounce en actualizaciones

### UX

- Estados de carga claros
- Indicadores visuales de estado
- Navegación intuitiva
- Feedback inmediato en acciones

## 🔗 Enlaces Relacionados

- [Layout del Dashboard de Contribuyente](../layouts/taxpayer-dashboard-layout.doc.md)
- [Contexto del Contribuyente](../context/taxpayer-context.doc.md)
- [Página de Mis Pagos](../rutas-especificas/mis-pagos-page.doc.md)
- [Página de Mis Declaraciones](../rutas-especificas/mis-declaraciones-page.doc.md)
- [Componentes UI](../components/ui/index.doc.md)
- [Hooks Personalizados](../hooks/index.doc.md)
