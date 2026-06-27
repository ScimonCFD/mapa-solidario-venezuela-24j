# Arquitectura de datos - rama experimental

Esta rama (`feature/base-datos-login`) prepara la maqueta para conectarse a una base de datos compartida sin romper la version estable.

## Estado actual

La app sigue usando `localStorage`, pero el acceso a datos esta encapsulado en `dataProvider` dentro de `app.js`.

Operaciones actuales:

- `listReports()`
- `createReport(report)`
- `updateReport(id, updatedReport)`
- `listResources()`
- `createResource(resource)`

La idea es que Firebase/Firestore, Supabase u otro backend implementen estas mismas operaciones.

## Flujo operativo deseado

- El publico ve solo la vista publica.
- El publico no crea reportes directamente; reporta por WhatsApp.
- Admin y voluntarios entran con login.
- Admin puede autorizar/desactivar voluntarios.
- Voluntarios autorizados pueden crear y validar reportes.
- Solo reportes `Verificado`, `En ruta` o `Entregado` aparecen en publico.
- Datos personales y contacto interno nunca se publican.

## Datos minimos

### users

- id
- email
- nombre
- role: `admin` o `voluntario`
- active
- created_at

### reports

- id
- created_at
- state
- place
- parish
- category
- quantity
- priority
- description
- contact
- first_name
- last_name
- national_id
- phone
- location_link
- channel
- status
- evidence
- created_by
- verified_by
- lat
- lng

### report_status_history

- id
- report_id
- old_status
- new_status
- changed_by
- note
- created_at

## Reglas criticas

- La vista publica debe leer una salida segura, no la tabla completa de reportes privados.
- El cliente publico no debe recibir `first_name`, `last_name`, `national_id`, `phone`, `contact`, `location_link` exacto ni notas internas.
- El cambio de estado debe registrar quien lo hizo.
- El login no debe implementarse desde cero; usar Firebase Auth, Supabase Auth u otro proveedor confiable.

## Ramas

- `master`: maqueta estable.
- `v0.1-mvp-maqueta`: tag de retorno.
- `feature/base-datos-login`: trabajo experimental para login/base de datos.

