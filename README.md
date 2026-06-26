# Mapa Solidario Venezuela 24J

Prototipo operativo para coordinar reportes, verificacion, necesidades publicables, inventario y transporte durante una emergencia.

## Como probar

Abre `index.html` en el navegador, o sirve la carpeta con:

```bash
python3 -m http.server 8000
```

Luego entra a `http://localhost:8000`.

## Flujo del MVP

1. Crear reportes desde WhatsApp o Google Forms.
2. Verificar cada reporte antes de publicarlo.
3. Publicar solo datos agregados, sin contactos ni direcciones exactas.
4. Registrar inventario, transporte y voluntarios.
5. Exportar CSV o JSON para auditoria, respaldo o migracion a backend.

## Regla operativa

Menos viralizacion, mas verificacion. Menos acopio ciego, mas entrega efectiva.

## Siguiente paso tecnico

Decision actual de entrada de datos:

- WhatsApp para mensajes directos y coordinacion manual.
- Google Forms para reportes estructurados.
- Sin APIs pagas ni automatizacion compleja al inicio.

Vista publica:

- Busqueda manual por zona o necesidad.
- Boton opcional `Ver necesidades cerca de mi`.
- La ubicacion del usuario no se guarda; solo se usa en el navegador para ordenar resultados aproximados.
- Nombre, telefono, cedula, notas internas y links de ubicacion son datos internos; no se muestran publicamente.

Cuando el flujo este validado, conectar el frontend a una base compartida con autenticacion por roles:

- `intake`: crea reportes.
- `verificador`: valida o descarta reportes.
- `logistica`: asigna inventario y rutas.
- `publico`: solo lee necesidades agregadas.
