# Reglas Rapidas

Usa estas reglas por defecto en tareas del dia a dia.

## Alcance
- Prioridad: documentacion (`README.md` y docs tecnicas).
- No cambiar arquitectura ni logica de negocio sin autorizacion explicita.
- Si hay duda de alcance, preguntar antes de ejecutar.

## Cambios de codigo
- Solo se permite codigo dentro de `aida`.
- Si el cambio es importante, nuevo o complejo: pedir confirmacion primero.
- No tocar OCR externo ni proyectos fuera de `aida`.

## Propuestas obligatorias en cambios relevantes
- Resumen del cambio.
- Pros.
- Contras.
- Posibles errores o regresiones.
- Impacto en compatibilidad OCR <-> editor.
- Pregunta final de autorizacion.

## Seguridad y configuracion
- Nunca hardcodear secretos.
- Variables sensibles solo en `.env` no versionado.
- No inventar endpoints, variables o tablas no aprobadas.

## Calidad de salida
- Mantener soluciones simples y accionables.
- Explicar como validar cada cambio.
- Si no se puede validar algo, declararlo de forma explicita.
