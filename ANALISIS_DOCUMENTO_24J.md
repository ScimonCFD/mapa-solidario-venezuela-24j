# Analisis del documento Mapa Solidario Venezuela 24J

Documento revisado: `/home/simon/Downloads/Mapa Solidario Venezuela 24J.pdf`

## Lectura general

El documento propone un sistema de coordinacion humanitaria inspirado en Mexico 19S. No pide empezar con una app grande ni con inteligencia artificial. Pide ordenar datos, verificar reportes y publicar solo informacion segura.

La maqueta actual esta alineada con el nucleo del documento:

- formulario de reportes
- tablero de verificacion
- inventario/transporte/voluntarios
- mapa o vista publica agregada
- exportacion CSV/JSON
- separacion entre datos internos y datos publicos

## Lo que el documento confirma

1. El MVP debe estar pensado para 72 horas.
2. La prioridad es datos limpios, no IA.
3. WhatsApp y formularios son canales iniciales razonables.
4. El equipo decidio iniciar con Google Forms y WhatsApp.
5. El mapa publico debe mostrar necesidades agregadas, no personas.
6. Los voluntarios verificadores deben ser seleccionados.
7. Todo reporte no verificado debe quedar marcado como preliminar.
8. La app debe funcionar bien en celular y con baja conectividad.
9. Debe poder exportar CSV.

## Diferencias contra la maqueta actual

### Faltan modulos explicitos

El documento menciona seis modulos:

- formulario de reportes
- tablero de verificacion
- inventario de centros de acopio
- registro de voluntarios y transporte
- mapa publico de necesidades agregadas
- bitacora de entregas

La maqueta ya cubre casi todo, pero la bitacora de entregas todavia no esta separada como modulo propio.

### Faltan centros de acopio como entidad

Ahora estan mezclados dentro de recursos. Para el MVP puede servir, pero el documento sugiere modelarlos con:

- ubicacion
- responsable
- horario
- inventario por categoria
- capacidad
- necesidades actuales

### Faltan estados mas precisos

El documento recomienda:

- recibido
- en verificacion
- verificado
- asignado
- en ruta
- entregado
- cerrado
- falso/duplicado

La maqueta fue actualizada para usar estos estados.

### Faltan categorias completas

El documento recomienda incluir:

- agua
- alimentos
- medicamentos
- atencion medica
- rescate
- refugio
- higiene
- transporte
- energia
- telecomunicaciones
- insumos para bebes
- adultos mayores
- mascotas
- remocion de escombros

La maqueta fue actualizada con estas categorias.

## Arquitectura recomendada para este equipo

Para el contexto actual, recomendaria este camino:

### Fase 1: validacion operativa

- Usar la maqueta actual.
- Usar Google Forms para reportes estructurados.
- Usar WhatsApp manualmente para mensajes directos.
- Exportar CSV.
- Verificar internamente con voluntarios seleccionados.

### Fase 2: base compartida

- Supabase/PostgreSQL como primera opcion.
- Alternativa: Node + Express + PostgreSQL si el colaborador quiere construir backend propio.
- Mantener frontend simple mientras se valida el flujo.

### Fase 3: mapa real y dashboard

- Leaflet + OpenStreetMap para mapa publico.
- Metabase si hace falta dashboard operativo.
- Publicar solo datos agregados.

### Fase 4: automatizacion

- n8n para importar formularios o conectar flujos, solo despues.
- WhatsApp API solo despues, porque puede tener costo y permisos.

## Riesgos importantes

- Publicar datos personales por accidente.
- Recibir reportes duplicados y contarlos como necesidades separadas.
- Que voluntarios no verificados puedan cambiar datos sensibles.
- Que el mapa de ubicaciones exactas ponga en riesgo a personas vulnerables.
- Construir integraciones antes de validar el flujo humano.

## Proxima decision

La pregunta mas importante para tu amigo activista no es tecnica:

Quienes son los primeros 3 a 5 voluntarios confiables que pueden verificar reportes?

Sin esa respuesta, la base de datos existe pero no hay confianza. Con esa respuesta, podemos conectar la maqueta a una base compartida y empezar a operar de forma controlada.
