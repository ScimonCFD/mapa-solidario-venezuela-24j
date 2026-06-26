# Brief tecnico para colaborador

Proyecto: Mapa Solidario Venezuela 24J

## Estado actual

Hay un prototipo web estatico con HTML, CSS y JavaScript vanilla.

Funciones actuales:

- Crear reportes de necesidades.
- Cambiar estado de reportes: pendiente, verificado, en ruta, entregado, descartado.
- Mostrar una vista publica sin contactos internos.
- Registrar recursos: inventario, transporte y voluntariado.
- Exportar reportes a CSV y JSON.
- Guardar datos localmente en el navegador con `localStorage`.

Archivos principales:

- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `REVISION_ACTIVISTA.md`
- `PLAN_MVP_BASE_DATOS.md`

## Como correrlo

```bash
python3 -m http.server 8000 --directory /home/simon/Documents/Terremoto_Venezuela_2026
```

Abrir:

```text
http://localhost:8000/index.html
```

## Lo que falta para hacerlo colaborativo

Ahora mismo cada navegador tiene sus propios datos. Para que varias personas trabajen juntas hace falta backend.

Opciones tecnicas razonables:

1. Supabase/PostgreSQL: rapido, barato, con auth y base de datos.
2. Node + Express + PostgreSQL: mas control, mas trabajo.
3. Node + Express + MongoDB: flexible, util si el equipo ya domina Mongo.

Recomendacion para emergencia: Supabase/PostgreSQL o Node + Express + PostgreSQL.

El activista valido que los campos iniciales estan bien y que la verificacion debe ser interna. La decision operativa actual es dejar el MVP con WhatsApp y Google Forms como entrada de datos.

## Tareas utiles para el colaborador

### Alta prioridad

- Definir modelo de datos inicial: reportes, recursos, usuarios, eventos de verificacion.
- Crear backend minimo para guardar reportes compartidos.
- Agregar autenticacion simple por roles.
- Separar datos publicos de datos internos.
- Permitir carga manual o importacion CSV desde Google Forms.
- Mantener WhatsApp como entrada manual al inicio, sin API paga.

### Media prioridad

- Agregar deteccion manual de duplicados.
- Agregar historial de cambios por reporte.
- Agregar filtros por estado, municipio, categoria y prioridad.
- Agregar exportacion limpia para auditoria.

### Baja prioridad

- Migrar frontend a React si el flujo ya esta validado.
- Agregar mapa real con coordenadas aproximadas.
- Agregar notificaciones o integraciones externas.

## Roles sugeridos

- Intake: crea reportes desde mensajes, llamadas o formularios.
- Verificador: confirma, descarta o marca duplicados.
- Logistica: asigna recursos y transporte.
- Admin: gestiona usuarios y ve datos internos.
- Publico: solo ve necesidades agregadas y verificadas.

## Principios de seguridad

- No publicar telefonos.
- No publicar nombres de afectados.
- No publicar direcciones exactas.
- No exponer datos internos en endpoints publicos.
- Mantener todo reporte como preliminar hasta verificacion.

## Pregunta tecnica central

Que version minima permite que 3 a 5 voluntarios creen y verifiquen reportes compartidos sin exponer datos sensibles?

## Alcance actual

No construir integraciones con redes sociales todavia. El primer backend/base compartida debe asumir dos fuentes:

- `WhatsApp`
- `Google Forms`
