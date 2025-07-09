# Documentación del Sistema de Gestión de Rentas - Municipalidad de Chamical

## 📚 Índice de Documentación

Esta documentación proporciona una guía completa del sistema de gestión de rentas municipales, organizada por niveles de abstracción desde lo más específico hasta lo más general.

---

## 🎯 Información General

### [Vista General del Proyecto](./00-general/01-proyecto-overview.doc.md)

Descripción completa del sistema, arquitectura, tecnologías utilizadas y flujos de negocio principales.

---

## 🏗️ Estructura de Rutas

### Rutas Específicas (Sin Subrutas)

- [Página de Cuenta - Administrador](./01-rutas-especificas/01-account-page.doc.md)
- [Página Mi Cuenta - Contribuyente](./01-rutas-especificas/02-mi-cuenta-page.doc.md)
- [Página Resumen - Contribuyente](./01-rutas-especificas/03-resumen-page.doc.md)

### Rutas con Subrutas

- [Sección Trámites - Cliente](./02-rutas-con-subrutas/01-tramites-section.doc.md)
- [Sección Información - Cliente](./02-rutas-con-subrutas/02-informacion-section.doc.md)
- [Sección Administración - Backoffice](./02-rutas-con-subrutas/03-admin-section.doc.md)
- [Sección Dashboard del Contribuyente](./02-rutas-con-subrutas/04-taxpayer-dashboard-section.doc.md)

---

## 🎨 Layouts y Estructura

### [Layout Raíz - Aplicación Principal](./03-layouts/01-root-layout.doc.md)

Configuración global, metadatos, fuentes y componentes globales.

### [Layout del Cliente - Portal Público](./03-layouts/02-client-layout.doc.md)

Estructura común para todas las páginas del portal público.

---

## 🧩 Componentes

### [Componentes UI - Biblioteca de Componentes](./04-componentes/01-ui-components.doc.md)

Biblioteca completa de componentes reutilizables basados en Radix UI y Tailwind CSS.

---

## 🔧 Servicios y Configuración

### [Servicios de Supabase - Base de Datos y Autenticación](./05-servicios/01-supabase-services.doc.md)

Configuración de clientes, autenticación y operaciones de base de datos.

---

## 📋 Cómo Usar Esta Documentación

### Para Desarrolladores

1. **Nuevos en el Proyecto**: Comenzar con la [Vista General](./00-general/01-proyecto-overview.doc.md)
2. **Implementar Funcionalidad**: Revisar la documentación de rutas específicas
3. **Modificar Componentes**: Consultar la documentación de componentes UI
4. **Configurar Servicios**: Revisar la documentación de servicios

### Para Administradores

1. **Entender el Sistema**: Leer la [Vista General](./00-general/01-proyecto-overview.doc.md)
2. **Configurar el Sistema**: Revisar la documentación de configuración
3. **Mantener el Sistema**: Consultar guías de mantenimiento

### Para Contribuyentes

1. **Usar el Portal**: Revisar la documentación de rutas del contribuyente
2. **Reportar Problemas**: Consultar guías de soporte

---

## 🔗 Enlaces Cruzados

### Sistema de Navegación

- Cada documento incluye enlaces a documentos relacionados
- Los enlaces están organizados por categorías
- Se mantiene consistencia en la nomenclatura

### Convenciones de Enlaces

- `[Ver documentación](./ruta/documento.doc.md)` - Enlaces internos
- `[Componente UI](../components/ui/componente.doc.md)` - Referencias a componentes
- `[Servicio](../servicios/servicio.doc.md)` - Referencias a servicios

---

## 📝 Convenciones de Documentación

### Estructura de Documentos

- **📍 Ubicación**: Ruta del archivo
- **🎯 Propósito**: Descripción del componente/función
- **🏗️ Estructura**: Organización interna
- **🔗 Dependencias**: Componentes y servicios utilizados
- **🔐 Seguridad**: Consideraciones de seguridad
- **📊 Estados**: Estados de la aplicación
- **🎨 Interfaz**: Aspectos de UI/UX
- **🔄 Flujo**: Flujos de datos
- **📋 Funcionalidades**: Lista de características
- **🚀 Optimizaciones**: Mejoras de performance
- **🔗 Enlaces**: Referencias relacionadas

### Formato de Código

```typescript
// Ejemplos de código con sintaxis highlighting
const ejemplo = () => {
  return 'código de ejemplo';
};
```

### Iconos de Sección

- 📍 Ubicación
- 🎯 Propósito
- 🏗️ Estructura
- 🔗 Dependencias
- 🔐 Seguridad
- 📊 Estados
- 🎨 Interfaz
- 🔄 Flujo
- 📋 Funcionalidades
- 🚀 Optimizaciones
- 🔗 Enlaces

---

## 🚀 Próximas Actualizaciones

### Documentación Pendiente

- [ ] Documentación de hooks personalizados
- [ ] Guías de testing
- [ ] Documentación de API endpoints
- [ ] Guías de deployment
- [ ] Manuales de usuario

### Mejoras Planificadas

- [ ] Búsqueda en documentación
- [ ] Ejemplos interactivos
- [ ] Videos tutoriales
- [ ] Documentación offline

---

## 📞 Soporte

### Contacto

- **Desarrollo**: Equipo de desarrollo
- **Soporte Técnico**: Área de sistemas
- **Usuarios**: Área de rentas municipal

### Recursos Adicionales

- [README del Proyecto](../README.md)
- [Historias de Usuario](../USER_STORIES.md)
- [Detalles Técnicos](../TECHNICAL_DETAILS.md)

---

_Esta documentación se actualiza regularmente. Última actualización: 09/07/2025_
