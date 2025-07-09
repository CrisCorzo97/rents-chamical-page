# Página de Cuenta - Administrador

## 📍 Ubicación

`src/app/(backoffice)/private/admin/account/page.tsx`

## 🎯 Propósito

Esta página permite a los administradores gestionar su información de cuenta personal, incluyendo datos personales, credenciales de acceso y configuraciones de perfil.

## 🏗️ Estructura

### Componentes Principales

- **AccountPage**: Componente principal que renderiza la página
- **AccountForm**: Formulario para editar información personal
- **PasswordChangeForm**: Formulario para cambiar contraseña
- **ProfileSection**: Sección de información del perfil

### Funcionalidades

- ✅ Visualización de datos del usuario actual
- ✅ Edición de información personal (nombre, email, teléfono)
- ✅ Cambio de contraseña con validación
- ✅ Actualización de preferencias de notificación
- ✅ Validación de datos en tiempo real

## 🔗 Dependencias

### Componentes UI Utilizados

- `Button` - [Ver documentación](../components/ui/button.doc.md)
- `Card` - [Ver documentación](../components/ui/card.doc.md)
- `Form` - [Ver documentación](../components/ui/form.doc.md)
- `Input` - [Ver documentación](../components/ui/input.doc.md)
- `Label` - [Ver documentación](../components/ui/label.doc.md)

### Hooks Utilizados

- `useForm` - [Ver documentación](../hooks/use-form.doc.md)
- `useToast` - [Ver documentación](../hooks/use-toast.doc.md)

### Servicios Utilizados

- `createSupabaseServerClient` - [Ver documentación](../lib/supabase/server.doc.md)
- `updateUserProfile` - [Ver documentación](../lib/services/user.doc.md)

## 🔐 Seguridad

- Validación de autenticación mediante middleware
- Verificación de rol de administrador (role_id = 1)
- Encriptación de contraseñas con bcrypt
- Validación de datos en frontend y backend

## 📊 Estados de la Aplicación

### Estados de Carga

- `isLoading`: Durante la carga inicial de datos
- `isUpdating`: Durante la actualización de información
- `isChangingPassword`: Durante el cambio de contraseña

### Estados de Error

- `validationError`: Errores de validación de formularios
- `updateError`: Errores durante la actualización
- `passwordError`: Errores específicos del cambio de contraseña

## 🎨 Interfaz de Usuario

### Secciones Principales

1. **Información Personal**
   - Nombre completo
   - Email
   - Teléfono
   - Cargo/Posición

2. **Seguridad**
   - Cambio de contraseña
   - Configuración de autenticación de dos factores

3. **Preferencias**
   - Configuración de notificaciones
   - Preferencias de idioma
   - Configuración de tema

## 🔄 Flujo de Datos

### 1. Carga Inicial

```typescript
// Al cargar la página:
1. Verificar autenticación del usuario
2. Obtener datos del perfil desde Supabase
3. Cargar información en los formularios
4. Renderizar componentes con datos
```

### 2. Actualización de Información

```typescript
// Al enviar formulario de actualización:
1. Validar datos del formulario
2. Mostrar estado de carga
3. Enviar datos a la API
4. Actualizar estado local
5. Mostrar notificación de éxito/error
```

### 3. Cambio de Contraseña

```typescript
// Al cambiar contraseña:
1. Validar contraseña actual
2. Validar nueva contraseña (fuerza, confirmación)
3. Encriptar nueva contraseña
4. Actualizar en base de datos
5. Invalidar sesiones existentes
```

## 🧪 Validaciones

### Validaciones de Formulario

- **Nombre**: Requerido, mínimo 2 caracteres
- **Email**: Formato válido, único en el sistema
- **Teléfono**: Formato argentino opcional
- **Contraseña actual**: Requerida para cambios
- **Nueva contraseña**: Mínimo 8 caracteres, incluir mayúsculas, minúsculas y números

### Validaciones de Negocio

- Solo administradores pueden acceder
- Email debe ser único en el sistema
- Contraseña actual debe ser correcta
- No se puede cambiar email a uno ya existente

## 🚀 Optimizaciones

### Performance

- Carga lazy de componentes pesados
- Debounce en validaciones de formulario
- Cache de datos del usuario
- Optimización de re-renders

### UX

- Feedback inmediato en validaciones
- Estados de carga claros
- Mensajes de error descriptivos
- Confirmaciones antes de acciones críticas

## 🔗 Enlaces Relacionados

- [Layout del Backoffice](../layouts/backoffice-layout.doc.md)
- [Sistema de Autenticación](../auth/auth-system.doc.md)
- [Componentes UI](../components/ui/index.doc.md)
- [Hooks Personalizados](../hooks/index.doc.md)
