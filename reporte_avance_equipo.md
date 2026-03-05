# Avance AIDA (resumen para el equipo)

Hola equipo, les comparto en corto cómo vamos con la integración OCR + editor PDF.

## Qué ya quedó listo

- Ya está integrado el flujo real de OCR en `plantillas/scan` usando:
	- `POST /ocr/documento_completo`
- La pantalla de escaneo ahora permite:
	- subir archivo
	- procesar OCR
	- editar campos detectados
	- guardar una nueva versión
- Se implementó guardado con versionado en Supabase:
	- tabla `documents`
	- tabla `document_versions`
	- subida de PDF al bucket `documents`
- Se agregó naming de PDF versionado con formato normalizado.
- Se creó vista de documentos e historial:
	- `documentos`
	- `documentos/[id]`
- Lint y build pasan correctamente.

## Qué se actualizó en documentación

- `README.md` ya incluye:
	- variables necesarias
	- flujo E2E de Fase 1
	- convención de PDF
	- limitaciones actuales
- Se agregó matriz de riesgos:
	- `riesgos_mitigacion.md`
- Se dejó guía de operación para agentes:
	- `indice_agente.md`
	- `reglas_rapidas.md`
	- `analisis_profundo.md`

## Estado actual (práctico)

- MVP funcional de escaneo -> edición -> versión: **sí**
- Historial por documento: **sí**
- Fallback OCR multi-proveedor: **pendiente (fase 2)**
- Supabase en entorno local: depende de que cada quien configure su `.env.local`

## Pendientes inmediatos sugeridos

1. Probar flujo real con 3-5 documentos del equipo.
2. Validar UX de edición (campos vacíos, checkboxes, texto largo).
3. Ajustar permisos de bucket para pasar de público (pruebas) a privado (seguro).
4. Definir cuándo una versión pasa a `published` dentro del flujo de negocio.

## Nota rápida

Si alguien ve error de Supabase al arrancar, casi siempre es porque faltan variables en `.env.local` o porque no están creadas las tablas/bucket.
