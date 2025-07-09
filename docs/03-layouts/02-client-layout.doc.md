# Layout del Cliente - Portal Público

## 📍 Ubicación

`src/app/(client)/layout.tsx`

## 🎯 Propósito

Este layout proporciona la estructura común para todas las páginas del portal público de la municipalidad, incluyendo el header principal y la navegación básica.

## 🏗️ Estructura

### Componentes Principales

- **ClientLayout**: Componente principal que envuelve las páginas del cliente
- **MainHeader**: Header principal con navegación y logo
- **MainContent**: Contenedor principal del contenido
- **Footer**: Pie de página (comentado actualmente)

### Funcionalidades

- ✅ Header consistente en todas las páginas públicas
- ✅ Navegación principal del sitio
- ✅ Logo y branding de la municipalidad
- ✅ Estructura responsive
- ✅ Área de contenido flexible

## 🔗 Dependencias

### Componentes UI Utilizados

- `MainHeader` - [Ver documentación](../ui/main-header/header.doc.md)

### Configuraciones

- `globals.css` - Estilos globales
- `tailwind.config.ts` - Configuración de Tailwind CSS

## 🔐 Seguridad

- Acceso público sin restricciones
- Navegación segura entre páginas
- Protección contra ataques XSS básicos

## 📊 Estados de la Aplicación

### Estados de Navegación

- `currentPage`: Página actual
- `navigationState`: Estado de navegación
- `mobileMenuOpen`: Estado del menú móvil

## 🎨 Interfaz de Usuario

### Estructura Principal

```typescript
<main className='min-h-screen flex flex-col'>
  <MainHeader />
  <section className='grow p-4'>{children}</section>
  {/* <footer className='w-full h-28 bg-slate-200 grow-0 mt-8' /> */}
</main>
```

### Header Principal

- **Logo**: Logo de la municipalidad
- **Navegación**: Menú principal de navegación
- **Acciones**: Botones de acción (login, etc.)
- **Responsive**: Adaptación para dispositivos móviles

### Área de Contenido

- **Flexible**: Se adapta al contenido
- **Padding**: Espaciado consistente
- **Responsive**: Adaptación a diferentes pantallas

## 🔄 Flujo de Datos

### 1. Carga de Página

```typescript
// Al cargar una página del cliente:
1. Renderizar MainHeader
2. Cargar contenido específico de la página
3. Aplicar estilos y layout
4. Mostrar página completa
```

### 2. Navegación

```typescript
// Al navegar entre páginas:
1. Actualizar estado de navegación
2. Cargar nueva página
3. Mantener header consistente
4. Actualizar breadcrumbs si aplica
```

### 3. Responsive Design

```typescript
// Al cambiar tamaño de pantalla:
1. Detectar breakpoint
2. Ajustar layout del header
3. Adaptar navegación
4. Optimizar contenido
```

## 📋 Secciones del Layout

### Header (MainHeader)

- **Logo y Branding**: Identidad visual de la municipalidad
- **Navegación Principal**: Menú de secciones principales
- **Acciones Rápidas**: Login, búsqueda, etc.
- **Menú Móvil**: Navegación para dispositivos móviles

### Contenido Principal

- **Área Flexible**: Se adapta al contenido de cada página
- **Padding Consistente**: Espaciado uniforme
- **Responsive**: Adaptación a diferentes pantallas

### Footer (Comentado)

- **Información de Contacto**: Datos de la municipalidad
- **Enlaces Útiles**: Enlaces importantes
- **Redes Sociales**: Enlaces a redes sociales
- **Información Legal**: Términos y condiciones

## 🚀 Optimizaciones

### Performance

- Carga optimizada del header
- Lazy loading de contenido pesado
- Optimización de imágenes del logo
- Compresión de CSS

### UX

- Navegación intuitiva y clara
- Diseño responsive
- Carga rápida de páginas
- Experiencia consistente

### SEO

- Estructura HTML semántica
- Metadatos específicos por página
- URLs amigables
- Sitemap automático

## 🔗 Enlaces Relacionados

- [Layout Raíz](../layouts/root-layout.doc.md)
- [Header Principal](../ui/main-header/header.doc.md)
- [Sección de Trámites](../rutas-con-subrutas/tramites-section.doc.md)
- [Sección de Información](../rutas-con-subrutas/informacion-section.doc.md)
- [Componentes UI](../components/ui/index.doc.md)
- [Configuración de Tailwind](../config/tailwind-config.doc.md)
