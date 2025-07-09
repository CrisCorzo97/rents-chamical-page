# Servicios de Supabase - Base de Datos y Autenticación

## 📍 Ubicación

`src/lib/supabase/`

## 🎯 Propósito

Esta sección maneja toda la interacción con Supabase, incluyendo la configuración de clientes, autenticación, y operaciones de base de datos.

## 🏗️ Estructura

### Archivos Principales

- **`client.ts`** - Cliente de Supabase para el navegador
- **`server.ts`** - Cliente de Supabase para el servidor
- **`middleware.ts`** - Middleware de autenticación
- **`prisma.ts`** - Configuración de Prisma ORM

### Funcionalidades

- ✅ Configuración de clientes Supabase
- ✅ Autenticación de usuarios
- ✅ Operaciones de base de datos
- ✅ Middleware de seguridad
- ✅ Integración con Prisma ORM

## 🔗 Dependencias

### Librerías Externas

- `@supabase/supabase-js` - Cliente principal de Supabase
- `@supabase/ssr` - Soporte para Server-Side Rendering
- `@prisma/client` - Cliente de Prisma ORM
- `prisma` - Herramientas de Prisma

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-database-url
DIRECT_URL=your-direct-database-url
```

## 🔐 Seguridad

- Validación de tokens JWT
- Control de acceso basado en roles
- Protección de rutas sensibles
- Encriptación de datos sensibles
- Rate limiting en operaciones

## 📊 Estados de la Aplicación

### Estados de Autenticación

- `authenticated`: Usuario autenticado
- `unauthenticated`: Usuario no autenticado
- `loading`: Cargando estado de autenticación
- `error`: Error en autenticación

### Estados de Base de Datos

- `connected`: Conexión establecida
- `disconnected`: Sin conexión
- `querying`: Ejecutando consulta
- `error`: Error en consulta

## 🎨 Configuración de Clientes

### Cliente del Navegador

```typescript
// src/lib/supabase/client.ts
export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

### Cliente del Servidor

```typescript
// src/lib/supabase/server.ts
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Manejo de errores
          }
        },
      },
    }
  );
}
```

## 🔄 Flujo de Datos

### 1. Inicialización de Cliente

```typescript
// Al inicializar cliente:
1. Verificar variables de entorno
2. Crear instancia de cliente
3. Configurar interceptores
4. Establecer listeners de eventos
```

### 2. Autenticación de Usuario

```typescript
// Al autenticar usuario:
1. Recibir credenciales
2. Validar con Supabase Auth
3. Generar token JWT
4. Almacenar en cookies
5. Redirigir según rol
```

### 3. Operaciones de Base de Datos

```typescript
// Al ejecutar operación:
1. Validar permisos de usuario
2. Ejecutar consulta en Supabase
3. Procesar respuesta
4. Manejar errores
5. Retornar datos
```

## 📋 Operaciones Disponibles

### Autenticación

- **Sign Up**: Registro de nuevos usuarios
- **Sign In**: Inicio de sesión
- **Sign Out**: Cierre de sesión
- **Password Reset**: Recuperación de contraseña
- **Email Verification**: Verificación de email

### Operaciones de Usuario

- **Get User**: Obtener datos del usuario actual
- **Update User**: Actualizar datos del usuario
- **Delete User**: Eliminar usuario
- **Get User Role**: Obtener rol del usuario

### Operaciones de Base de Datos

- **Select**: Consultas de lectura
- **Insert**: Inserción de datos
- **Update**: Actualización de datos
- **Delete**: Eliminación de datos
- **Upsert**: Inserción o actualización

### Operaciones Específicas

- **Get Taxpayer Data**: Datos del contribuyente
- **Get Dashboard Data**: Datos del dashboard
- **Get Affidavits**: Declaraciones juradas
- **Get Invoices**: Facturas y pagos

## 🚀 Optimizaciones

### Performance

- Pool de conexiones
- Cache de consultas frecuentes
- Lazy loading de datos
- Compresión de respuestas

### Seguridad

- Validación de entrada
- Sanitización de datos
- Rate limiting
- Auditoría de operaciones

### UX

- Estados de carga claros
- Manejo de errores amigable
- Retry automático en fallos
- Feedback inmediato

## 🔗 Enlaces Relacionados

- [Configuración de Prisma](../config/prisma-config.doc.md)
- [Sistema de Autenticación](../auth/auth-system.doc.md)
- [Middleware de Seguridad](../middleware/security-middleware.doc.md)
- [Servicios de Datos](../servicios/data-services.doc.md)
- [Variables de Entorno](../config/environment-vars.doc.md)
