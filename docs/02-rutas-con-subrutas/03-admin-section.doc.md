# Sección Administración - Backoffice

## 📍 Ubicación

`src/app/(backoffice)/private/admin/`

## 🎯 Propósito

Esta sección proporciona a los administradores del sistema todas las herramientas necesarias para gestionar el sistema de rentas municipales, incluyendo gestión de contribuyentes, pagos, declaraciones y reportes.

## 🏗️ Estructura

### Rutas Principales

- **`/admin`** - Dashboard principal de administración
- **`/admin/dashboard`** - Panel de control con métricas y gráficos
- **`/admin/account`** - Gestión de cuenta del administrador
- **`/admin/affidavits`** - Gestión de declaraciones juradas
- **`/admin/cementery`** - Gestión de cementerio
- **`/admin/commercial_enablement`** - Gestión de habilitaciones comerciales
- **`/admin/collection_management`** - Gestión de cobranzas
- **`/admin/property`** - Gestión de propiedades
- **`/admin/receipts`** - Gestión de recibos
- **`/admin/registration_request`** - Solicitudes de registro

### Componentes Principales

- **AdminLayout**: Layout principal del panel de administración
- **Sidebar**: Navegación lateral del panel
- **Dashboard**: Panel de control con métricas
- **DataTables**: Tablas de datos para cada módulo
- **Forms**: Formularios de gestión para cada entidad

### Funcionalidades

- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión completa de contribuyentes
- ✅ Administración de declaraciones juradas
- ✅ Gestión de habilitaciones comerciales
- ✅ Control de cobranzas y pagos
- ✅ Gestión de propiedades municipales
- ✅ Generación de recibos
- ✅ Reportes y análisis
- ✅ Gestión de solicitudes de registro

## 🔗 Dependencias

### Componentes UI Utilizados

- `Sidebar` - [Ver documentación](../components/ui/sidebar.doc.md)
- `DataTable` - [Ver documentación](../components/custom-table/data-table.doc.md)
- `Card` - [Ver documentación](../components/ui/card.doc.md)
- `Button` - [Ver documentación](../components/ui/button.doc.md)
- `Form` - [Ver documentación](../components/ui/form.doc.md)
- `Chart` - [Ver documentación](../components/ui/chart.doc.md)

### Hooks Utilizados

- `useDashboardState` - [Ver documentación](../hooks/use-dashboard-state.doc.md)
- `useDataTable` - [Ver documentación](../hooks/use-data-table.doc.md)
- `useForm` - [Ver documentación](../hooks/use-form.doc.md)
- `useToast` - [Ver documentación](../hooks/use-toast.doc.md)

### Servicios Utilizados

- `createSupabaseServerClient` - [Ver documentación](../lib/supabase/server.doc.md)
- `getDashboardData` - [Ver documentación](../lib/services/dashboard.doc.md)
- `getAffidavits` - [Ver documentación](../lib/services/affidavits.doc.md)
- `getCommercialEnablements` - [Ver documentación](../lib/services/commercial-enablement.doc.md)

## 🔐 Seguridad

- Validación de autenticación mediante middleware
- Verificación de rol de administrador (role_id = 1)
- Control de acceso basado en roles
- Protección de datos sensibles
- Auditoría de acciones administrativas

## 📊 Estados de la Aplicación

### Estados de Carga

- `isLoading`: Durante la carga inicial
- `isRefreshing`: Durante la actualización de datos
- `isProcessing`: Durante el procesamiento de acciones
- `isExporting`: Durante la exportación de datos

### Estados de Error

- `loadError`: Errores durante la carga
- `actionError`: Errores en acciones administrativas
- `validationError`: Errores de validación
- `networkError`: Errores de conectividad

## 🎨 Interfaz de Usuario

### Layout Principal

1. **Sidebar de Navegación**
   - Menú de módulos disponibles
   - Indicadores de estado
   - Acceso rápido a funciones

2. **Header**
   - Información del usuario
   - Notificaciones
   - Acceso a cuenta

3. **Contenido Principal**
   - Área de trabajo dinámica
   - Breadcrumbs de navegación
   - Acciones contextuales

### Módulos Específicos

#### Dashboard (`/admin/dashboard`)

- Métricas financieras en tiempo real
- Gráficos de recaudación
- Estado de declaraciones
- Alertas importantes

#### Gestión de Declaraciones (`/admin/affidavits`)

- Lista de declaraciones juradas
- Filtros avanzados
- Estados de procesamiento
- Reportes de declaraciones

#### Habilitaciones Comerciales (`/admin/commercial_enablement`)

- Gestión de licencias comerciales
- Estados de habilitación
- Renovaciones
- Sanciones y multas

#### Gestión de Cobranzas (`/admin/collection_management`)

- Control de pagos
- Estados de cuenta
- Generación de facturas
- Reportes de cobranza

#### Gestión de Propiedades (`/admin/property`)

- Catastro de propiedades
- Valuaciones
- Estados de propiedad
- Reportes catastrales

#### Gestión de Recibos (`/admin/receipts`)

- Generación de recibos
- Tipos de recibo
- Estados de emisión
- Reportes de recibos

## 🔄 Flujo de Datos

### 1. Autenticación y Autorización

```typescript
// Al acceder al panel:
1. Verificar token de autenticación
2. Validar rol de administrador
3. Cargar permisos específicos
4. Renderizar interfaz según permisos
```

### 2. Carga de Datos

```typescript
// Al cargar módulos:
1. Obtener datos desde API
2. Aplicar filtros y paginación
3. Procesar datos para visualización
4. Renderizar componentes
```

### 3. Acciones Administrativas

```typescript
// Al realizar acciones:
1. Validar permisos de acción
2. Ejecutar acción en backend
3. Actualizar estado local
4. Mostrar confirmación
5. Registrar en auditoría
```

## 📋 Módulos Administrativos

### Dashboard

- **Métricas Financieras**: Recaudación, morosidad, etc.
- **Gráficos Interactivos**: Visualización de datos
- **Alertas**: Notificaciones importantes
- **Acciones Rápidas**: Funciones más utilizadas

### Gestión de Contribuyentes

- **Listado**: Todos los contribuyentes registrados
- **Filtros**: Búsqueda y filtrado avanzado
- **Estados**: Estados de cuenta y obligaciones
- **Acciones**: Edición, eliminación, etc.

### Declaraciones Juradas

- **Estados**: Pendientes, aprobadas, rechazadas
- **Procesamiento**: Validación y aprobación
- **Reportes**: Estadísticas de declaraciones
- **Exportación**: Datos para análisis

### Habilitaciones Comerciales

- **Licencias**: Gestión de licencias comerciales
- **Renovaciones**: Proceso de renovación
- **Sanciones**: Aplicación de sanciones
- **Estados**: Estados de habilitación

### Cobranzas

- **Pagos**: Registro y control de pagos
- **Facturación**: Generación de facturas
- **Estados**: Estados de cuenta
- **Reportes**: Reportes de cobranza

## 🚀 Optimizaciones

### Performance

- Carga lazy de módulos pesados
- Cache de datos administrativos
- Optimización de consultas
- Compresión de respuestas

### UX

- Interfaz intuitiva y responsive
- Acciones rápidas y eficientes
- Feedback inmediato
- Navegación clara

## 🔗 Enlaces Relacionados

- [Layout del Backoffice](../layouts/backoffice-layout.doc.md)
- [Dashboard Administrativo](../rutas-especificas/dashboard-admin.doc.md)
- [Gestión de Declaraciones](../rutas-especificas/affidavits-admin.doc.md)
- [Gestión de Habilitaciones](../rutas-especificas/commercial-enablement-admin.doc.md)
- [Gestión de Cobranzas](../rutas-especificas/collection-management-admin.doc.md)
- [Componentes UI](../components/ui/index.doc.md)
- [Hooks Personalizados](../hooks/index.doc.md)
