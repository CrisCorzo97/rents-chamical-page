# Componentes UI - Biblioteca de Componentes

## 📍 Ubicación

`src/components/ui/`

## 🎯 Propósito

Esta biblioteca de componentes proporciona una base sólida y consistente para la interfaz de usuario de toda la aplicación, basada en Radix UI y estilizada con Tailwind CSS.

## 🏗️ Estructura

### Componentes Principales

- **Button**: Botones con variantes y estados
- **Card**: Contenedores de contenido
- **Form**: Componentes de formulario
- **Input**: Campos de entrada
- **Table**: Tablas de datos
- **Dialog**: Modales y diálogos
- **Navigation**: Componentes de navegación
- **Feedback**: Componentes de retroalimentación

### Funcionalidades

- ✅ Componentes accesibles (ARIA)
- ✅ Variantes y estados consistentes
- ✅ Integración con Tailwind CSS
- ✅ Soporte para temas claro/oscuro
- ✅ Componentes responsive
- ✅ Animaciones suaves

## 🔗 Dependencias

### Librerías Externas

- `@radix-ui/react-*` - Componentes base de Radix UI
- `class-variance-authority` - Sistema de variantes
- `clsx` - Utilidad para clases CSS
- `tailwind-merge` - Merge de clases Tailwind
- `lucide-react` - Iconos

### Configuraciones

- `tailwind.config.ts` - Configuración de Tailwind
- `components.json` - Configuración de shadcn/ui

## 🔐 Accesibilidad

- Soporte completo para ARIA
- Navegación por teclado
- Lectores de pantalla
- Contraste adecuado
- Estados de foco visibles

## 📊 Estados de los Componentes

### Estados Comunes

- `default`: Estado por defecto
- `hover`: Estado al pasar el mouse
- `focus`: Estado al recibir foco
- `disabled`: Estado deshabilitado
- `loading`: Estado de carga
- `error`: Estado de error

### Estados Específicos

- `primary/secondary`: Variantes de botones
- `sm/md/lg`: Tamaños de componentes
- `success/warning/error`: Estados de alertas

## 🎨 Sistema de Diseño

### Colores

```typescript
// Paleta de colores
primary: '#0f172a'; // Slate 900
secondary: '#64748b'; // Slate 500
accent: '#3b82f6'; // Blue 500
destructive: '#ef4444'; // Red 500
success: '#22c55e'; // Green 500
warning: '#f59e0b'; // Amber 500
```

### Tipografía

```typescript
// Escala de tipografía
text-xs: '0.75rem' // 12px
text-sm: '0.875rem' // 14px
text-base: '1rem' // 16px
text-lg: '1.125rem' // 18px
text-xl: '1.25rem' // 20px
text-2xl: '1.5rem' // 24px
```

### Espaciado

```typescript
// Sistema de espaciado
p-1: '0.25rem' // 4px
p-2: '0.5rem' // 8px
p-3: '0.75rem' // 12px
p-4: '1rem' // 16px
p-6: '1.5rem' // 24px
p-8: '2rem' // 32px
```

## 🔄 Flujo de Datos

### 1. Renderizado de Componentes

```typescript
// Al renderizar un componente:
1. Aplicar variantes y props
2. Generar clases CSS dinámicas
3. Aplicar estilos de Tailwind
4. Renderizar elemento HTML
5. Aplicar eventos y listeners
```

### 2. Manejo de Estados

```typescript
// Al cambiar estado:
1. Detectar cambio de props
2. Actualizar clases CSS
3. Aplicar animaciones si es necesario
4. Notificar cambios a componentes padre
```

### 3. Interacciones de Usuario

```typescript
// Al interactuar con componente:
1. Capturar evento de usuario
2. Validar estado actual
3. Ejecutar callback correspondiente
4. Actualizar estado visual
5. Emitir evento si es necesario
```

## 📋 Componentes Disponibles

### Componentes de Formulario

- **Button**: Botones con variantes y estados
- **Input**: Campos de entrada de texto
- **Form**: Componentes de formulario con validación
- **Select**: Selectores desplegables
- **Checkbox**: Casillas de verificación
- **Switch**: Interruptores
- **Textarea**: Áreas de texto

### Componentes de Layout

- **Card**: Contenedores de contenido
- **Container**: Contenedores responsivos
- **Grid**: Sistema de grilla
- **Stack**: Apilamiento vertical
- **Divider**: Separadores

### Componentes de Navegación

- **NavigationMenu**: Menús de navegación
- **Breadcrumb**: Migas de pan
- **Pagination**: Paginación
- **Tabs**: Pestañas
- **Sidebar**: Barra lateral

### Componentes de Feedback

- **Alert**: Alertas y notificaciones
- **Toast**: Notificaciones temporales
- **Dialog**: Modales y diálogos
- **Tooltip**: Información contextual
- **Progress**: Barras de progreso

### Componentes de Datos

- **Table**: Tablas de datos
- **DataTable**: Tablas avanzadas con filtros
- **Badge**: Etiquetas y badges
- **Avatar**: Avatares de usuario
- **Calendar**: Calendarios

## 🚀 Optimizaciones

### Performance

- Componentes optimizados con React.memo
- Lazy loading de componentes pesados
- Bundle splitting automático
- Tree shaking de CSS

### UX

- Animaciones suaves y consistentes
- Estados de carga claros
- Feedback inmediato en interacciones
- Diseño responsive

### Accesibilidad

- Soporte completo para ARIA
- Navegación por teclado
- Contraste adecuado
- Estados de foco visibles

## 🔗 Enlaces Relacionados

- [Configuración de Tailwind](../config/tailwind-config.doc.md)
- [Sistema de Temas](../config/theme-system.doc.md)
- [Componentes Personalizados](../componentes/custom-components.doc.md)
- [Hooks de Componentes](../hooks/component-hooks.doc.md)
- [Utilidades CSS](../lib/css-utils.doc.md)
