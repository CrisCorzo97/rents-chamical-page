# Sección Información - Cliente

## 📍 Ubicación

`src/app/(client)/(sections)/informacion/`

## 🎯 Propósito

Esta sección proporciona información pública sobre la municipalidad, incluyendo calendario fiscal, información fiscal, novedades, y tasas y contribuciones.

## 🏗️ Estructura

### Rutas Principales

- **`/informacion`** - Página principal de información
- **`/informacion/calendario`** - Calendario de vencimientos fiscales
- **`/informacion/informacion-fiscal`** - Información fiscal general
- **`/informacion/novedades`** - Novedades y comunicaciones
- **`/informacion/tasas-contribuciones`** - Tasas y contribuciones municipales

### Componentes Principales

- **InformacionPage**: Página principal que lista todas las secciones de información
- **CalendarioFiscal**: Componente del calendario de vencimientos
- **InformacionFiscal**: Información fiscal general
- **NovedadesList**: Lista de novedades y comunicaciones
- **TasasContribuciones**: Información sobre tasas y contribuciones

### Funcionalidades

- ✅ Información pública de la municipalidad
- ✅ Calendario de vencimientos fiscales
- ✅ Información fiscal actualizada
- ✅ Novedades y comunicaciones oficiales
- ✅ Tasas y contribuciones municipales
- ✅ Descarga de documentos informativos

## 🔗 Dependencias

### Componentes UI Utilizados

- `Card` - [Ver documentación](../components/ui/card.doc.md)
- `Button` - [Ver documentación](../components/ui/button.doc.md)
- `Table` - [Ver documentación](../components/ui/table.doc.md)
- `Calendar` - [Ver documentación](../components/ui/calendar.doc.md)
- `Tabs` - [Ver documentación](../components/ui/tabs.doc.md)
- `Alert` - [Ver documentación](../components/ui/alert.doc.md)

### Hooks Utilizados

- `useCalendarData` - [Ver documentación](../hooks/use-calendar-data.doc.md)
- `useNovedades` - [Ver documentación](../hooks/use-novedades.doc.md)
- `useTasasContribuciones` - [Ver documentación](../hooks/use-tasas-contribuciones.doc.md)

### Servicios Utilizados

- `getCalendarioFiscal` - [Ver documentación](../lib/services/calendario.doc.md)
- `getNovedades` - [Ver documentación](../lib/services/novedades.doc.md)
- `getTasasContribuciones` - [Ver documentación](../lib/services/tasas.doc.md)

## 🔐 Seguridad

- Información pública sin restricciones
- Validación de datos mostrados
- Protección contra inyección de contenido
- Rate limiting en consultas

## 📊 Estados de la Aplicación

### Estados de Carga

- `isLoading`: Durante la carga inicial
- `isRefreshing`: Durante la actualización de datos
- `isFiltering`: Durante el filtrado de información

### Estados de Error

- `loadError`: Errores durante la carga
- `filterError`: Errores en filtros
- `networkError`: Errores de conectividad

## 🎨 Interfaz de Usuario

### Página Principal (`/informacion`)

1. **Menú de Información**
   - Calendario fiscal
   - Información fiscal
   - Novedades
   - Tasas y contribuciones

2. **Acceso Rápido**
   - Información más consultada
   - Alertas importantes
   - Enlaces útiles

### Subrutas Específicas

#### `/informacion/calendario`

- Calendario interactivo de vencimientos
- Filtros por tipo de obligación
- Exportación de calendario
- Notificaciones de próximos vencimientos

#### `/informacion/informacion-fiscal`

- Información general fiscal
- Guías y manuales
- Preguntas frecuentes
- Contactos útiles

#### `/informacion/novedades`

- Lista de novedades recientes
- Filtros por categoría
- Búsqueda de novedades
- Suscripción a notificaciones

#### `/informacion/tasas-contribuciones`

- Listado de tasas y contribuciones
- Información detallada de cada tasa
- Calculadoras de impuestos
- Descarga de formularios

## 🔄 Flujo de Datos

### 1. Carga de Información

```typescript
// Al cargar información:
1. Obtener datos desde API
2. Procesar y formatear información
3. Aplicar filtros si existen
4. Renderizar componentes
```

### 2. Filtrado de Datos

```typescript
// Al aplicar filtros:
1. Capturar parámetros de filtro
2. Actualizar consulta a API
3. Refrescar datos filtrados
4. Actualizar interfaz
```

### 3. Exportación de Datos

```typescript
// Al exportar información:
1. Preparar datos para exportación
2. Generar archivo (PDF, Excel)
3. Descargar archivo
4. Mostrar confirmación
```

## 📋 Tipos de Información

### Calendario Fiscal

- **Vencimientos Mensuales**: Fechas de vencimiento por mes
- **Tipos de Obligación**: Categorías de obligaciones
- **Alertas**: Próximos vencimientos
- **Exportación**: Descarga de calendario

### Información Fiscal

- **Guías**: Manuales de procedimientos
- **Preguntas Frecuentes**: FAQ fiscal
- **Contactos**: Información de contacto
- **Enlaces Útiles**: Recursos adicionales

### Novedades

- **Comunicaciones Oficiales**: Noticias municipales
- **Cambios Normativos**: Actualizaciones legales
- **Eventos**: Eventos municipales
- **Alertas**: Información importante

### Tasas y Contribuciones

- **Listado Completo**: Todas las tasas municipales
- **Detalles por Tasa**: Información específica
- **Calculadoras**: Herramientas de cálculo
- **Formularios**: Documentos descargables

## 🚀 Optimizaciones

### Performance

- Carga lazy de contenido pesado
- Cache de información estática
- Optimización de imágenes
- Compresión de datos

### UX

- Navegación intuitiva
- Búsqueda rápida
- Filtros eficientes
- Información clara y accesible

## 🔗 Enlaces Relacionados

- [Layout del Cliente](../layouts/client-layout.doc.md)
- [Página Principal de Información](../rutas-especificas/informacion-page.doc.md)
- [Calendario Fiscal](../rutas-especificas/calendario-fiscal.doc.md)
- [Novedades](../rutas-especificas/novedades-list.doc.md)
- [Tasas y Contribuciones](../rutas-especificas/tasas-contribuciones.doc.md)
- [Componentes UI](../components/ui/index.doc.md)
- [Hooks Personalizados](../hooks/index.doc.md)
