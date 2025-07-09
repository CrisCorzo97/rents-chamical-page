# Página Mi Cuenta - Contribuyente

## 📍 Ubicación

`src/app/(taxpayer_dashboard)/mi-cuenta/page.tsx`

## 🎯 Propósito

Esta página permite a los contribuyentes gestionar su información personal, datos fiscales y configuraciones de su cuenta en el portal de contribuyentes.

## 🏗️ Estructura

### Componentes Principales

- **MiCuentaPage**: Componente principal que renderiza la página
- **PersonalInfoForm**: Formulario para datos personales
- **FiscalInfoSection**: Sección de información fiscal
- **ContactInfoForm**: Formulario para información de contacto
- **PreferencesSection**: Configuraciones de preferencias

### Funcionalidades

- ✅ Visualización de datos del contribuyente
- ✅ Edición de información personal y fiscal
- ✅ Actualización de datos de contacto
- ✅ Configuración de preferencias de notificación
- ✅ Validación de CUIT/CUIL
- ✅ Historial de cambios de datos

## 🔗 Dependencias

### Componentes UI Utilizados

- `Button` - [Ver documentación](../components/ui/button.doc.md)
- `Card` - [Ver documentación](../components/ui/card.doc.md)
- `Form` - [Ver documentación](../components/ui/form.doc.md)
- `Input` - [Ver documentación](../components/ui/input.doc.md)
- `Label` - [Ver documentación](../components/ui/label.doc.md)
- `Tabs` - [Ver documentación](../components/ui/tabs.doc.md)

### Hooks Utilizados

- `useTaxpayerContext` - [Ver documentación](../hooks/use-taxpayer-context.doc.md)
- `useForm` - [Ver documentación](../hooks/use-form.doc.md)
- `useToast` - [Ver documentación](../hooks/use-toast.doc.md)

### Servicios Utilizados

- `getTaxpayerData` - [Ver documentación](../lib/get-taxpayer-data.doc.md)
- `updateTaxpayerProfile` - [Ver documentación](../lib/services/taxpayer.doc.md)

## 🔐 Seguridad

- Validación de autenticación mediante middleware
- Verificación de rol de contribuyente (role_id = 5)
- Validación de CUIT/CUIL con AFIP
- Protección de datos personales según normativa

## 📊 Estados de la Aplicación

### Estados de Carga

- `isLoading`: Durante la carga inicial de datos
- `isUpdating`: Durante la actualización de información
- `isValidatingCuit`: Durante la validación de CUIT/CUIL

### Estados de Error

- `validationError`: Errores de validación de formularios
- `updateError`: Errores durante la actualización
- `cuitValidationError`: Errores en validación de CUIT/CUIL

## 🎨 Interfaz de Usuario

### Secciones Principales

1. **Información Personal**
   - Nombre completo
   - DNI/CUIL
   - Fecha de nacimiento
   - Nacionalidad

2. **Información Fiscal**
   - CUIT/CUIL
   - Categoría fiscal
   - Domicilio fiscal
   - Actividad económica

3. **Información de Contacto**
   - Email
   - Teléfono
   - Domicilio particular
   - Domicilio comercial

4. **Preferencias**
   - Configuración de notificaciones
   - Preferencias de comunicación
   - Configuración de alertas

## 🔄 Flujo de Datos

### 1. Carga Inicial

```typescript
// Al cargar la página:
1. Verificar autenticación del contribuyente
2. Obtener datos del perfil desde TaxpayerContext
3. Cargar información en los formularios
4. Renderizar componentes con datos
```

### 2. Actualización de Información

```typescript
// Al enviar formulario de actualización:
1. Validar datos del formulario
2. Validar CUIT/CUIL si fue modificado
3. Mostrar estado de carga
4. Enviar datos a la API
5. Actualizar contexto del contribuyente
6. Mostrar notificación de éxito/error
```

### 3. Validación de CUIT/CUIL

```typescript
// Al validar CUIT/CUIL:
1. Verificar formato del CUIT/CUIL
2. Consultar servicio de AFIP
3. Validar que pertenece al contribuyente
4. Actualizar información fiscal
5. Mostrar resultado de validación
```

## 🧪 Validaciones

### Validaciones de Formulario

- **Nombre**: Requerido, mínimo 2 caracteres
- **DNI**: Formato válido argentino
- **CUIT/CUIL**: Formato válido, dígito verificador correcto
- **Email**: Formato válido, único en el sistema
- **Teléfono**: Formato argentino opcional
- **Domicilio**: Requerido para domicilio fiscal

### Validaciones de Negocio

- Solo contribuyentes pueden acceder
- CUIT/CUIL debe ser válido según AFIP
- Email debe ser único en el sistema
- Domicilio fiscal debe ser real y verificable

## 🚀 Optimizaciones

### Performance

- Carga lazy de componentes pesados
- Debounce en validaciones de formulario
- Cache de datos del contribuyente
- Optimización de re-renders

### UX

- Feedback inmediato en validaciones
- Estados de carga claros
- Mensajes de error descriptivos
- Confirmaciones antes de acciones críticas
- Tour guiado para nuevos usuarios

## 🔗 Enlaces Relacionados

- [Layout del Dashboard de Contribuyente](../layouts/taxpayer-dashboard-layout.doc.md)
- [Contexto del Contribuyente](../context/taxpayer-context.doc.md)
- [Sistema de Autenticación](../auth/auth-system.doc.md)
- [Componentes UI](../components/ui/index.doc.md)
- [Hooks Personalizados](../hooks/index.doc.md)
