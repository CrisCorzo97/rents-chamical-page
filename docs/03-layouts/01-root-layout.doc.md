# Layout Raíz - Aplicación Principal

## 📍 Ubicación

`src/app/layout.tsx`

## 🎯 Propósito

Este es el layout raíz de la aplicación que envuelve todas las páginas y proporciona la configuración global, incluyendo metadatos, fuentes, y componentes globales.

## 🏗️ Estructura

### Componentes Principales

- **RootLayout**: Componente principal que envuelve toda la aplicación
- **Toaster**: Sistema de notificaciones global
- **Analytics**: Sistema de análisis de Vercel
- **Font Configuration**: Configuración de fuentes tipográficas

### Funcionalidades

- ✅ Configuración global de la aplicación
- ✅ Sistema de notificaciones global
- ✅ Análisis de uso con Vercel Analytics
- ✅ Configuración de fuentes tipográficas
- ✅ Metadatos SEO básicos
- ✅ Configuración de idioma

## 🔗 Dependencias

### Componentes UI Utilizados

- `Toaster` - [Ver documentación](../components/ui/toaster.doc.md)

### Librerías Externas

- `@vercel/analytics` - Sistema de análisis de Vercel
- `next/font/google` - Fuentes de Google Fonts
- `next` - Framework de Next.js

### Configuraciones

- `globals.css` - Estilos globales de la aplicación
- `tailwind.config.ts` - Configuración de Tailwind CSS
- `next.config.js` - Configuración de Next.js

## 🔐 Seguridad

- Configuración de CSP (Content Security Policy)
- Configuración de CORS
- Headers de seguridad básicos
- Configuración de cookies seguras

## 📊 Estados de la Aplicación

### Estados Globales

- `isLoading`: Estado de carga global
- `isError`: Estado de error global
- `isOnline`: Estado de conectividad

### Estados de Notificación

- `toastQueue`: Cola de notificaciones
- `notificationState`: Estado de notificaciones

## 🎨 Interfaz de Usuario

### Configuración de Fuentes

```typescript
// Configuración de Open Sans
const poppins = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
});
```

### Metadatos SEO

```typescript
export const metadata: Metadata = {
  title: 'Rentas Digital',
  description: 'Rentas Municipal de Chamical',
};
```

### Estructura HTML

```html
<html lang="es">
  <body className="{`${poppins.variable}" font-sans`}>
    {children}
    <Toaster />
    <Analytics />
  </body>
</html>
```

## 🔄 Flujo de Datos

### 1. Inicialización de la Aplicación

```typescript
// Al cargar la aplicación:
1. Configurar fuentes tipográficas
2. Inicializar sistema de notificaciones
3. Configurar análisis de Vercel
4. Aplicar estilos globales
5. Renderizar contenido principal
```

### 2. Manejo de Notificaciones

```typescript
// Al mostrar notificaciones:
1. Recibir evento de notificación
2. Agregar a cola de notificaciones
3. Mostrar notificación con Toaster
4. Remover de cola al completar
```

### 3. Análisis de Uso

```typescript
// Al registrar eventos:
1. Capturar evento de usuario
2. Enviar a Vercel Analytics
3. Registrar en dashboard
4. Generar reportes
```

## 📋 Configuraciones

### Fuentes Tipográficas

- **Familia**: Open Sans
- **Pesos**: 300, 400, 500, 600, 700
- **Subconjuntos**: Latin, Latin Extended
- **Variable CSS**: --font-open-sans

### Metadatos SEO

- **Título**: Rentas Digital
- **Descripción**: Rentas Municipal de Chamical
- **Idioma**: Español (es)
- **Charset**: UTF-8

### Análisis

- **Proveedor**: Vercel Analytics
- **Configuración**: Automática
- **Privacidad**: Cumple GDPR
- **Reportes**: Dashboard de Vercel

## 🚀 Optimizaciones

### Performance

- Carga optimizada de fuentes
- Compresión de CSS global
- Lazy loading de componentes pesados
- Optimización de imágenes

### SEO

- Metadatos optimizados
- Estructura HTML semántica
- Configuración de Open Graph
- Sitemap automático

### UX

- Sistema de notificaciones consistente
- Fuentes legibles y accesibles
- Carga rápida de la aplicación
- Experiencia fluida

## 🔗 Enlaces Relacionados

- [Layout del Cliente](../layouts/client-layout.doc.md)
- [Layout del Backoffice](../layouts/backoffice-layout.doc.md)
- [Layout del Dashboard de Contribuyente](../layouts/taxpayer-dashboard-layout.doc.md)
- [Sistema de Notificaciones](../components/ui/toaster.doc.md)
- [Configuración de Tailwind](../config/tailwind-config.doc.md)
- [Configuración de Next.js](../config/next-config.doc.md)
