# Sistema de Gestión de Rentas - Municipalidad de Chamical

## 📍 Información General

### Descripción

Sistema integral de gestión de rentas municipales para la Municipalidad de Chamical, La Rioja. Permite la administración de impuestos, tasas y contribuciones municipales, así como la gestión de contribuyentes y el procesamiento de pagos.

### Tecnologías Principales

- **Frontend**: Next.js 15+ con App Router
- **Backend**: API Routes de Next.js
- **Base de Datos**: PostgreSQL con Supabase
- **ORM**: Prisma
- **Autenticación**: Supabase Auth
- **Estilos**: Tailwind CSS
- **Deployment**: Vercel

## 🏗️ Arquitectura del Sistema

### Estructura de Rutas

```
src/app/
├── (client)/           # Portal público
│   └── (sections)/     # Secciones del portal
├── (backoffice)/       # Panel administrativo
│   └── private/admin/  # Módulos administrativos
├── (taxpayer_dashboard)/ # Portal del contribuyente
│   └── [secciones]/    # Secciones del contribuyente
├── auth/               # Sistema de autenticación
├── api/                # API Routes
└── pdf-viewer/         # Visor de PDFs
```

### Módulos Principales

#### Portal Público (`(client)`)

- **Información**: Datos públicos de la municipalidad
- **Trámites**: Formularios y consultas ciudadanas
- **Organismo**: Información institucional
- **Centro de Ayuda**: Soporte y documentación

#### Panel Administrativo (`(backoffice)`)

- **Dashboard**: Métricas y análisis
- **Gestión de Contribuyentes**: Administración de usuarios
- **Declaraciones Juradas**: Procesamiento de DDJJ
- **Habilitaciones Comerciales**: Licencias y permisos
- **Gestión de Cobranzas**: Control de pagos
- **Propiedades**: Catastro municipal
- **Recibos**: Generación de comprobantes

#### Portal del Contribuyente (`(taxpayer_dashboard)`)

- **Resumen**: Estado fiscal personal
- **Mi Cuenta**: Gestión de datos personales
- **Mis Declaraciones**: Historial de DDJJ
- **Mis Pagos**: Facturas y pagos

## 🔐 Sistema de Autenticación

### Roles de Usuario

- **Administrador** (role_id = 1): Acceso completo al sistema
- **Contribuyente** (role_id = 5): Acceso a portal personal
- **Público**: Acceso solo a información pública

### Flujo de Autenticación

1. **Registro**: Solicitud de alta con validación
2. **Verificación**: Confirmación de email
3. **Login**: Inicio de sesión con credenciales
4. **Autorización**: Redirección según rol
5. **Sesión**: Manejo de tokens JWT

## 📊 Base de Datos

### Esquemas Principales

- **auth**: Usuarios y autenticación (Supabase)
- **public**: Datos de negocio (PostgreSQL)

### Entidades Principales

- **users**: Usuarios del sistema
- **commercial_enablement**: Habilitaciones comerciales
- **affidavits**: Declaraciones juradas
- **invoices**: Facturas y pagos
- **property**: Propiedades municipales
- **receipts**: Recibos y comprobantes

## 🎨 Interfaz de Usuario

### Sistema de Diseño

- **Framework**: Tailwind CSS
- **Componentes**: Radix UI + shadcn/ui
- **Iconos**: Lucide React
- **Fuentes**: Open Sans (Google Fonts)

### Características

- **Responsive**: Adaptación a todos los dispositivos
- **Accesible**: Cumple estándares WCAG
- **Tema**: Soporte para modo claro/oscuro
- **Animaciones**: Transiciones suaves

## 🔄 Flujos de Negocio

### Gestión de Contribuyentes

1. **Registro**: Solicitud de alta
2. **Validación**: Verificación de datos
3. **Aprobación**: Activación de cuenta
4. **Gestión**: Administración de datos

### Procesamiento de Declaraciones

1. **Presentación**: Contribuyente presenta DDJJ
2. **Validación**: Verificación automática
3. **Revisión**: Análisis administrativo
4. **Aprobación**: Aprobación o rechazo
5. **Notificación**: Comunicación del resultado

### Gestión de Pagos

1. **Generación**: Creación de facturas
2. **Notificación**: Aviso al contribuyente
3. **Pago**: Proceso de pago en línea
4. **Confirmación**: Validación del pago
5. **Comprobante**: Generación de recibo

## 🚀 Optimizaciones

### Performance

- **SSR/SSG**: Renderizado híbrido
- **Lazy Loading**: Carga bajo demanda
- **Image Optimization**: Optimización automática
- **Bundle Splitting**: División inteligente

### Seguridad

- **JWT Tokens**: Autenticación segura
- **Role-based Access**: Control de acceso
- **Input Validation**: Validación de entrada
- **Rate Limiting**: Protección contra spam

### UX

- **Loading States**: Estados de carga claros
- **Error Handling**: Manejo amigable de errores
- **Feedback**: Confirmaciones inmediatas
- **Navigation**: Navegación intuitiva

## 📈 Métricas y Análisis

### Dashboard Administrativo

- **Recaudación**: Ingresos por período
- **Morosidad**: Análisis de deudas
- **Declaraciones**: Estado de DDJJ
- **Pagos**: Volumen de transacciones

### Reportes Disponibles

- **Financieros**: Balance y flujo de caja
- **Operativos**: Estadísticas de uso
- **Fiscales**: Análisis de obligaciones
- **Auditoría**: Logs de actividades

## 🔗 Integraciones

### Servicios Externos

- **Supabase**: Base de datos y autenticación
- **Vercel**: Deployment y hosting
- **Google Analytics**: Análisis de uso
- **Email Service**: Notificaciones por email

### APIs

- **AFIP**: Validación de CUIT/CUIL
- **Pagos**: Pasarelas de pago
- **Notificaciones**: Servicios de SMS/Email

## 📋 Configuración del Proyecto

### Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=
DIRECT_URL=

# Email
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=
```

### Scripts Disponibles

```json
{
  "dev": "next dev -p 3005",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:generate": "prisma generate",
  "db:pull": "prisma db pull"
}
```

## 🔗 Enlaces Relacionados

- [Documentación Técnica](../technical-details.doc.md)
- [Historias de Usuario](../user-stories.doc.md)
- [Configuración de Desarrollo](../config/development-setup.doc.md)
- [Guía de Deployment](../deployment/deployment-guide.doc.md)
- [Manual de Usuario](../user-manual/user-manual.doc.md)
