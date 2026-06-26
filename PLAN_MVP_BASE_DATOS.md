# Plan MVP con base de datos

Objetivo: que varios voluntarios puedan crear, verificar y consultar reportes compartidos sin publicar datos sensibles ni pagar APIs al inicio.

## Decision operativa recibida

El feedback activista valida:

- Los campos iniciales de la maqueta estan bien.
- No deben publicarse datos que identifiquen personas.
- La verificacion debe ser interna con voluntarios seleccionados.
- La entrada inicial queda limitada a WhatsApp y Google Forms.
- El mapa debe reflejar una base de datos de reportes verificados.
- Hay poco o ningun presupuesto para APIs pagas.

## Flujo minimo recomendado

1. La gente reporta por WhatsApp o Google Forms.
2. Un voluntario de entrada convierte mensajes de WhatsApp en reportes estructurados.
3. Un voluntario verificador revisa evidencia o llama al contacto interno.
4. Si se verifica, el reporte cambia a `Verificado`.
5. La vista publica y el mapa leen solo reportes `Verificado`, `En ruta` o `Entregado`.
6. La vista publica oculta nombre, telefono, contacto interno, notas sensibles y direccion exacta.

## Arquitectura sin APIs pagas

### Fase 1: manual y barata

- Google Forms recoge reportes.
- WhatsApp se atiende manualmente, sin API al inicio.
- Se exporta CSV o se revisa Google Sheets.
- Voluntarios copian reportes validados a la app o a la base de datos.
- La app publica solo datos seguros.

Esta fase evita depender de integraciones automaticas mientras se valida el proceso.

### Fase 2: base compartida

Opciones:

- Supabase/PostgreSQL: menos codigo de backend, autenticacion incluida, buena para MVP.
- Node + Express + PostgreSQL: mas control, util si el colaborador quiere backend propio.
- Node + Express + MongoDB: viable si el colaborador prefiere Mongo, aunque PostgreSQL encaja bien con reportes estructurados.

### Fase 3: automatizacion posterior

- Importar CSV de Google Forms.
- Leer Google Sheets si el equipo decide habilitarlo.
- Integrar WhatsApp solo cuando haya capacidad, permisos y criterio de seguridad.

## Alcance cerrado del MVP de entrada

Incluido:

- WhatsApp manual.
- Google Forms.
- Google Sheets como bandeja inicial de reportes.
- Importacion manual o CSV.

Excluido por ahora:

- WhatsApp Business API.
- X API.
- Instagram/Facebook Graph API.
- Telegram bot.
- IA para clasificar mensajes.
- Automatizaciones n8n/Make/Zapier.

## Modelo de datos inicial

### reports

- `id`
- `created_at`
- `source`: WhatsApp, Google Forms
- `state`
- `place_public`: municipio, parroquia o sector publicable
- `location_internal`: direccion o referencia sensible, solo interna
- `category`
- `quantity`
- `priority`
- `description_public`
- `contact_internal`
- `status`: pendiente, verificado, en_ruta, entregado, descartado
- `created_by`
- `verified_by`
- `verified_at`
- `verification_notes_internal`

### resources

- `id`
- `type`: inventario, transporte, voluntariado
- `item`
- `quantity`
- `location`
- `owner_contact_internal`
- `status`: disponible, asignado, usado

### verification_events

- `id`
- `report_id`
- `volunteer_id`
- `event_type`: llamada, foto, contacto_local, organizacion, descarte
- `notes_internal`
- `created_at`

### users

- `id`
- `name`
- `role`: intake, verificador, logistica, admin
- `trusted_by`
- `active`

## Vista publica

La vista publica solo debe consultar campos seguros:

- estado
- zona publicable
- categoria
- cantidad aproximada
- prioridad
- estado del caso
- descripcion resumida
- distancia aproximada si el usuario decide compartir ubicacion en su navegador

No debe mostrar:

- telefonos
- nombres
- direcciones exactas
- notas internas
- nombres de verificadores
- evidencias sensibles
- ubicacion exacta del usuario que consulta

## Geolocalizacion publica opcional

El MVP puede incluir un boton `Ver necesidades cerca de mi`.

- No se pide ubicacion al cargar la pagina.
- Solo se pide permiso si el usuario toca el boton.
- Si acepta, la ubicacion se usa localmente para ordenar necesidades verificadas cercanas.
- Si rechaza, puede buscar manualmente por estado, municipio o necesidad.
- La ubicacion del usuario no se guarda en la base de datos.
- Los reportes usan coordenadas aproximadas por zona, no direcciones exactas.

## Proxima tarea tecnica

Crear una primera base compartida y conectar la maqueta a ella, manteniendo la app simple.
