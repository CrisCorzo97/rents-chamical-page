# Sección Dashboard del Contribuyente

## 📍 Ubicación

`src/app/(taxpayer_dashboard)/`

## 🎯 Propósito

Esta sección proporciona a los contribuyentes un portal personalizado para gestionar sus obligaciones tributarias, realizar pagos, presentar declaraciones y consultar su estado fiscal.

## 🏗️ Estructura

### Rutas Principales

- **`/taxpayer`** - Dashboard principal del contribuyente
- **`/taxpayer/resumen`** - Vista general del estado fiscal
- **`/taxpayer/mi-cuenta`** - Gestión de cuenta personal
- **`/taxpayer/mis-declaraciones`** - Gestión de declaraciones juradas
- **`/taxpayer/mis-pagos`** - Gestión de pagos y facturas

### Componentes Principales

- **TaxpayerLayout**: Layout principal del portal del contribuyente
- **CustomSidebar**: Navegación lateral personalizada
- **TaxpayerDataProvider**: Contexto de datos del contribuyente
- **TourProvider**: Sistema de tours guiados
- **DashboardCards**: Tarjetas informativas del dashboard

### Funcionalidades

- ✅ Dashboard personalizado con resumen fiscal
- ✅ Gestión de declaraciones juradas
- ✅ Realización de pagos en línea
- ✅ Consulta de facturas y recibos
- ✅ Gestión de cuenta personal
- ✅ Sistema de notificaciones
- ✅ Tour guiado para nuevos usuarios

## 🔗 Dependencias

### Componentes UI Utilizados

- `Sidebar` - [Ver documentación](../components/ui/sidebar.doc.md)
- `Card` - [Ver documentación](../components/ui/card.doc.md)
- `Button` - [Ver documentación](../components/ui/button.doc.md)
- `Table` - [Ver documentación](../components/ui/table.doc.md)
- `Form` - [Ver documentación](../components/ui/form.doc.md)
- `Alert` - [Ver documentación](../components/ui/alert.doc.md)

### Hooks Utilizados

- `useTaxpayerContext` - [Ver documentación](../hooks/use-taxpayer-context.doc.md)
- `useForm` - [Ver documentación](../hooks/use-form.doc.md)
- `useToast` - [Ver documentación](../hooks/use-toast.doc.md)
- `useMobile` - [Ver documentación](../hooks/use-mobile.doc.md)

### Servicios Utilizados

- `getTaxpayerData` - [Ver documentación](../lib/get-taxpayer-data.doc.md)
- `getOverviewData` - [Ver documentación](../services/overview.action.doc.md)
- `getAffidavits` - [Ver documentación](../services/affidavits.actions.doc.md)
- `getInvoices` - [Ver documentación](../services/invoices.actions.doc.md)

## 🔐 Seguridad

- Validación de autenticación mediante middleware
- Verificación de rol de contribuyente (role_id = 5)
- Filtrado de datos por contribuyente autenticado
- Protección de información personal
- Encriptación de datos sensibles

## 📊 Estados de la Aplicación

### Estados de Carga

- `isLoading`: Durante la carga inicial
- `isRefreshing`: Durante la actualización de datos
- `isProcessing`: Durante el procesamiento de acciones
- `isCalculating`: Durante cálculos fiscales

### Estados de Error

- `loadError`: Errores durante la carga
- `actionError`: Errores en acciones del contribuyente
- `validationError`: Errores de validación
- `networkError`: Errores de conectividad

## 🎨 Interfaz de Usuario

### Layout Principal

1. **Sidebar de Navegación**
   - Menú de secciones disponibles
   - Información del contribuyente
   - Acceso rápido a funciones

2. **Header**
   - Datos del contribuyente
   - Notificaciones
   - Acceso a cuenta

3. **Contenido Principal**
   - Área de trabajo dinámica
   - Breadcrumbs de navegación
   - Acciones contextuales

### Secciones Específicas

#### Resumen (`/taxpayer/resumen`)

- Balance general de obligaciones
- Estado de licencias comerciales
- Pagos recientes
- Alertas importantes

#### Mi Cuenta (`/taxpayer/mi-cuenta`)

- Información personal
- Datos fiscales
- Preferencias de notificación
- Configuración de seguridad

#### Mis Declaraciones (`/taxpayer/mis-declaraciones`)

- Lista de declaraciones presentadas
- Estados de procesamiento
- Nueva declaración
- Historial de declaraciones

#### Mis Pagos (`/taxpayer/mis-pagos`)

- Facturas pendientes
- Historial de pagos
- Nuevo pago
- Descarga de comprobantes

## 🔄 Flujo de Datos

### 1. Autenticación y Carga de Datos

```typescript
// Al acceder al portal:
1. Verificar autenticación del contribuyente
2. Cargar datos del perfil desde TaxpayerContext
3. Obtener información fiscal actualizada
4. Renderizar dashboard personalizado
```

### 2. Navegación entre Secciones

```typescript
// Al navegar entre secciones:
1. Validar permisos de acceso
2. Cargar datos específicos de la sección
3. Aplicar filtros y paginación
4. Actualizar interfaz
```

### 3. Acciones del Contribuyente

```typescript
// Al realizar acciones:
1. Validar datos de entrada
2. Ejecutar acción en backend
3. Actualizar estado local
4. Mostrar confirmación
5. Registrar en historial
```

## 📋 Funcionalidades por Sección

### Dashboard Principal

- **Resumen Fiscal**: Balance general de obligaciones
- **Alertas**: Notificaciones importantes
- **Acciones Rápidas**: Funciones más utilizadas
- **Actividad Reciente**: Últimas acciones realizadas

### Gestión de Declaraciones

- **Listado**: Todas las declaraciones presentadas
- **Estados**: Pendientes, aprobadas, rechazadas
- **Nueva Declaración**: Formulario de declaración
- **Historial**: Historial completo de declaraciones

### Gestión de Pagos

- **Facturas Pendientes**: Obligaciones por pagar
- **Historial**: Pagos realizados
- **Nuevo Pago**: Proceso de pago en línea
- **Comprobantes**: Descarga de recibos

### Gestión de Cuenta

- **Información Personal**: Datos personales
- **Información Fiscal**: Datos fiscales
- **Preferencias**: Configuración de notificaciones
- **Seguridad**: Cambio de contraseña

## 🚀 Optimizaciones

### Performance

- Carga lazy de secciones pesadas
- Cache de datos del contribuyente
- Optimización de consultas fiscales
- Compresión de respuestas

### UX

- Interfaz intuitiva y responsive
- Tour guiado para nuevos usuarios
- Feedback inmediato en acciones
- Navegación clara y eficiente

## 🔗 Enlaces Relacionados

- [Layout del Dashboard de Contribuyente](../layouts/taxpayer-dashboard-layout.doc.md)
- [Contexto del Contribuyente](../context/taxpayer-context.doc.md)
- [Página de Resumen](../rutas-especificas/resumen-page.doc.md)
- [Página de Mi Cuenta](../rutas-especificas/mi-cuenta-page.doc.md)
- [Página de Mis Declaraciones](../rutas-especificas/mis-declaraciones-page.doc.md)
- [Página de Mis Pagos](../rutas-especificas/mis-pagos-page.doc.md)
- [Componentes UI](../components/ui/index.doc.md)
- [Hooks Personalizados](../hooks/index.doc.md)
