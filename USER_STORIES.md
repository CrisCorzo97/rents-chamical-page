# Historias de Usuario - Sistema de Gestión de Rentas

## Sprint 1 (Semanas 1-2): Sistema de Backup y Recuperación

### Objetivo

Implementar un sistema robusto de backup y recuperación de datos para garantizar la integridad y disponibilidad de la información.

### Historia 1: Visualizar listado de respaldos creados

**Como** administrador del sistema

**Quiero** ver un listado de los respaldos automáticos ya creados desde Google Drive

**Para** tener visibilidad y control sobre las copias de seguridad de la base de datos

#### ✅ Criterios de aceptación

- En el panel de administración debe haber una sección llamada "Respaldos".

- Debe mostrar una tabla con columnas:

  - Fecha de creación

  - Nombre del archivo

  - Tamaño del archivo

  - Hash de integridad (ej: SHA256)

  - Estado (Exitoso ✅)

- La tabla debe listar únicamente los respaldos almacenados en Google Drive.

- Debe mostrar los últimos 30 respaldos por defecto y permitir paginación.

- Debe permitir filtrar por mes (ejemplo: ver solo respaldos de marzo 2025).

- Cada respaldo debe tener un botón para descargar (ver Historia 2).

#### 🔧 Tareas técnicas sugeridas

- Crear endpoint /api/admin/backups que liste archivos desde Google Drive API (usando Service Account).

- Implementar filtro de fechas a nivel backend (usando createdTime en la API de Drive).

- Calcular y guardar hashes (SHA256) al momento del backup (ver Workflow).

- Frontend en app/admin/backups/page.tsx usando React Query + Tailwind.

#### 💡 Notas técnicas

- La API de Google Drive permite consultar archivos con filtros como fecha (createdTime) y propiedades personalizadas.

- Podemos almacenar el hash SHA256 junto con cada respaldo como archivo .sha256, o como propiedad (appProperties) en Google Drive para fácil consulta.

- La paginación se puede manejar en el backend usando pageSize y nextPageToken que ofrece la API de Drive.

### Historia 2: Descargar respaldo desde el panel

**Como** administrador del sistema

**Quiero** descargar un respaldo específico de forma segura desde el panel

**Para** poder restaurarlo si ocurre un incidente en el sistema

#### ✅ Criterios de aceptación

- Cada fila en la tabla debe tener un botón "Descargar".

- La descarga debe pasar por un proxy backend para mayor seguridad (evitar exponer directamente la URL de Google Drive).

- La descarga debe requerir autenticación y autorización (sólo usuarios con role_id = 1).

- El archivo descargado debe mantener el nombre original (backup-YYYY-MM-DD.sql).

- El backend debe devolver también el hash para que el administrador pueda validar la integridad del archivo descargado.

#### 🔧 Tareas técnicas sugeridas

- Implementar endpoint /api/admin/backups/[fileId]/download.

- Usar Google Drive API para leer y servir el archivo como stream.

- Incluir el hash en los headers de la respuesta (X-Backup-Hash).

- En frontend, permitir que el admin vea y compare hash descargado vs hash esperado.

#### 💡 Notas técnicas

- La autenticación puede basarse en Supabase JWT que ya usás; validar role_id = 1 antes de servir el archivo.

- Se recomienda usar res.setHeader("X-Backup-Hash", hash) en la respuesta para facilitar validación.

- Para obtener el archivo .sha256 desde Google Drive, podemos buscarlo usando la relación por nombre o appProperties.

### Historia 3: Visualización de estado general de respaldos

**Como** administrador del sistema

**Quiero** ver un indicador claro sobre el estado de los respaldos automáticos

**Para** detectar a tiempo si hubo ausencia de respaldos recientes

#### ✅ Criterios de aceptación

- En el dashboard de administración debe haber un widget que indique:

  - ✅ Último respaldo exitoso: 05-mayo-2025

  - ⚠️ Alerta si no hay respaldos en los últimos 7 días (ejemplo: "No se encontró respaldo en la última semana ❗").

- No es necesario mostrar detalles de fallas en GitHub Actions (sólo ausencia de respaldos).

- Al hacer clic en el widget, debe redirigir a la sección de respaldos detallados.

- Esta alerta se muestra solo en el dashboard admin (por ahora, no por email).

#### 🔧 Tareas técnicas sugeridas

- Crear endpoint /api/admin/backups/status que busque respaldos en los últimos 7 días en Google Drive.

- En frontend, crear widget en app/admin/dashboard/page.tsx.

- Usar semáforo visual (verde = OK, rojo = Falta respaldo).

#### 💡 Notas técnicas

- El backend puede usar la fecha actual menos 7 días (now() - 7d) para consultar archivos en Drive y validar si hay respaldo reciente.

- No es necesario consultar GitHub Actions directamente, solo basarse en existencia de archivos recientes en Drive.

#### 📅 Ajustes adicionales (confirmados)

- La frecuencia del workflow en GitHub Actions se ajusta a cada 7 días (cron: '0 3 _/7 _ \*').

- La fuente oficial de datos de respaldos es solo Google Drive.

- Las descargas pasan siempre por backend para mayor seguridad.

- Los respaldos incluirán un hash (ejemplo: SHA256) que el admin podrá verificar.

#### 📝 Notas generales para el equipo técnico

- Se debe modificar el backup.yml de GitHub Actions para que al generar el .sql calcule su hash SHA256 y lo almacene junto con el archivo (puede ser como backup-YYYY-MM-DD.sha256).

- En Google Drive:

  - Se recomienda usar nombres consistentes (backup-YYYY-MM-DD.sql y backup-YYYY-MM-DD.sha256).

  - Alternativamente, usar appProperties para guardar el hash dentro del archivo .sql.

- En la tabla del panel, se mostrará el hash y se permitirá descargar ambos (.sql y .sha256).

- En el widget de estado, solo se mostrará alerta por ausencia de respaldos recientes (no se mostrarán fallos de workflows).

### Hot-Fix: Ajuste en cálculo de períodos a declarar

**Como** contribuyente de Chamical

**Quiero** que el sistema solo me muestre los períodos a declarar a partir de mi fecha de alta como contribuyente

**Para** evitar que me exija declaraciones de meses anteriores a cuando comencé mi actividad

#### ✅ Criterios de aceptación

- El cálculo de períodos pendientes debe considerar:

  - La fecha de inicio de vigencia de la tasa declarable.

  - La fecha de alta del contribuyente.

- Si un contribuyente se dio de alta en marzo 2025, no debe ver períodos de enero ni febrero como pendientes.

- Aplica tanto para:

  - La generación automática de nuevas multas por falta de declaración.

  - El listado que ve el contribuyente en su portal.

- La lógica debe omitir cualquier período anterior a la fecha de alta del contribuyente.

- Debe mantenerse compatibilidad con las reglas actuales de ajuste según terminación de CUIL.

#### 🔧 Tareas técnicas sugeridas

- Ajustar la función en la Edge Function de Supabase que calcula períodos a declarar:

  - Incluir un filtro period >= contribuyente.fecha_alta.

- Revisar el script que genera nuevas multas (tax_penalties) para que no incluya períodos previos a la fecha de alta.

- Agregar un test unitario o prueba manual con un contribuyente dado de alta en mitad de un año.

- Revisar que en el frontend (portal del contribuyente) también se respete esta lógica al mostrar los períodos declarables.

#### 💡 Notas técnicas

- La tabla commercial_enablement contiene la fecha de alta relevante (registration_date o campo equivalente). Se debe utilizar esta fecha para el filtro.

- La función en Supabase que ya filtra por role_id = 5 y habilitaciones activas puede ampliarse para incorporar esta validación de fecha.

- Recordar que la fecha de inicio de la tasa y la fecha de alta del contribuyente deben combinarse: el primer período declarable es el mayor de ambas fechas.

## Sprint 2 (Semanas 3-4): Sistema de Notificaciones Push

### Objetivo

Implementar un sistema de notificaciones en tiempo real para mantener informados a los usuarios sobre sus obligaciones y pagos.

### Historias de Usuario

1. **Como** contribuyente  
   **Quiero** recibir notificaciones sobre vencimientos próximos  
   **Para** no olvidarme de realizar mis pagos

2. **Como** contribuyente  
   **Quiero** recibir confirmación cuando realice un pago  
   **Para** tener constancia inmediata de la transacción

3. **Como** administrador  
   **Quiero** poder enviar notificaciones masivas  
   **Para** comunicar información importante a todos los contribuyentes

4. **Como** usuario  
   **Quiero** poder configurar mis preferencias de notificación  
   **Para** recibir solo las alertas que me interesan

## Sprint 3 (Semanas 5-6): Dashboard Analítico

### Objetivo

Desarrollar un dashboard interactivo para visualizar y analizar datos de recaudación y morosidad.

### Historias de Usuario

1. **Como** administrador  
   **Quiero** ver gráficos de recaudación por período  
   **Para** analizar tendencias y tomar decisiones

2. **Como** administrador  
   **Quiero** filtrar datos por tipo de impuesto y zona  
   **Para** identificar áreas de mejora

3. **Como** administrador  
   **Quiero** exportar reportes en diferentes formatos  
   **Para** compartir información con otras áreas

4. **Como** administrador  
   **Quiero** ver indicadores clave de rendimiento  
   **Para** monitorear el desempeño del sistema

## Sprint 4 (Semanas 7-8): Integración con AFIP

### Objetivo

Integrar el sistema con los servicios de AFIP para validación de datos y facturación electrónica.

### Historias de Usuario

1. **Como** administrador  
   **Quiero** validar CUIT/CUIL con AFIP  
   **Para** asegurar la veracidad de los datos

2. **Como** administrador  
   **Quiero** generar facturas electrónicas  
   **Para** cumplir con las normativas vigentes

3. **Como** contribuyente  
   **Quiero** ver mis comprobantes en el sistema de AFIP  
   **Para** tener un registro oficial de mis pagos

4. **Como** administrador  
   **Quiero** sincronizar datos con AFIP automáticamente  
   **Para** mantener la información actualizada

## Sprint 5 (Semanas 9-10): Pruebas Automatizadas

### Objetivo

Implementar un conjunto completo de pruebas automatizadas para garantizar la calidad del sistema.

### Historias de Usuario

1. **Como** desarrollador  
   **Quiero** ejecutar pruebas unitarias automáticamente  
   **Para** detectar errores tempranamente

2. **Como** desarrollador  
   **Quiero** tener pruebas de integración  
   **Para** verificar que los componentes funcionan juntos

3. **Como** desarrollador  
   **Quiero** ejecutar pruebas de rendimiento  
   **Para** asegurar que el sistema responde adecuadamente

4. **Como** desarrollador  
   **Quiero** tener pruebas de seguridad  
   **Para** proteger los datos sensibles

## Criterios de Aceptación Generales

- Cada historia debe tener pruebas unitarias
- El código debe seguir las guías de estilo del proyecto
- Se debe documentar cualquier cambio en la API
- Se deben realizar pruebas de integración
- El rendimiento no debe degradarse
- Se debe mantener la compatibilidad con versiones anteriores
