# Google Forms MVP

Decision: el MVP usara Google Forms y WhatsApp como entrada de datos.

## Objetivo del formulario

Capturar reportes estructurados con los datos minimos necesarios para verificarlos, sin publicar datos personales.

## Campos recomendados

1. Estado
2. Municipio / parroquia / sector
3. Tipo de necesidad
4. Numero aproximado de personas afectadas
5. Urgencia
6. Descripcion breve
7. Link de ubicacion aproximada
8. Nombre
9. Apellido
10. Cedula opcional
11. Telefono
12. Notas internas de contacto
13. Fuente o relacion con la situacion
14. Evidencia opcional
15. Consentimiento para uso interno de los datos

Los campos de nombre, apellido, cedula, telefono, ubicacion exacta o link de ubicacion son internos. No deben aparecer en la vista publica.

## Opciones cerradas

### Tipo de necesidad

- Agua
- Alimentos
- Medicinas
- Atencion medica
- Refugio
- Higiene
- Rescate
- Transporte
- Energia
- Telecomunicaciones
- Insumos para bebes
- Adultos mayores
- Mascotas
- Remocion de escombros
- Otro

### Urgencia

- Critica
- Alta
- Media
- Resuelta

### Consentimiento

Texto sugerido:

`Autorizo que estos datos se usen internamente para verificar y coordinar ayuda. Entiendo que no se publicaran nombres, telefonos ni direcciones exactas.`

Opciones:

- Si
- No

## Flujo con Google Sheets

1. Google Forms guarda respuestas en Google Sheets.
2. Un voluntario revisa nuevas filas.
3. Si el reporte esta incompleto, se contacta a la persona.
4. Si el reporte se puede verificar, se carga en la app/base compartida.
5. Solo los reportes verificados alimentan la vista publica.

## Flujo con WhatsApp

1. Llega un mensaje libre por WhatsApp.
2. Un voluntario lo convierte a los campos del formulario.
3. Si falta informacion, responde pidiendo los datos minimos.
4. El reporte entra como `Recibido` o `En verificacion`.
5. Luego sigue el mismo flujo que Google Forms.

## Mensaje sugerido para pedir reportes por WhatsApp

`Para ordenar la ayuda, envia un solo mensaje con: Estado, municipio/sector, necesidad, cantidad aproximada de personas, urgencia, descripcion breve y contacto de referencia. No compartas datos sensibles si no son necesarios.`
