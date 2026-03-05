# Matriz de riesgos y mitigación

Este documento resume riesgos pendientes, su impacto y la acción recomendada por fase.

## Estado general

- Proyecto en fase funcional inicial (MVP operativo).
- No hay riesgos bloqueantes para continuar desarrollo.
- Se recomienda cerrar primero los riesgos de operación y observabilidad.

## Matriz

| Riesgo | Severidad | Impacto | Bloquea Fase 1 | Acción recomendada |
|---|---|---|---|---|
| `npm warn Unknown env config "devdir"` | Baja | Ruido en consola y posible incompatibilidad futura de npm | No | Limpiar variable de entorno local (`npm_config_devdir`) fuera del proyecto; no requiere cambios de código |
| Fallback OCR multi-proveedor no activo | Media | Si falla OCR principal no hay recuperación automática | No | Implementar en Fase 2 con feature flag (`ENABLE_OCR_FALLBACK`) y proveedor configurable |
| PDF final generado en frontend | Media | Fidelidad visual limitada según documento | No | Mantener en Fase 1, evaluar migración o mejora en Fase 2/3 |
| Dependencia de Supabase público en pruebas | Media | Riesgo de exposición de URLs de documentos | No (en pruebas) | Pasar bucket a privado cuando cierre Fase 1 y aplicar políticas de acceso |
| Falta de métricas de confianza OCR estandarizadas | Baja/Media | Dificulta activar fallback por calidad | No | Definir métrica única en backend antes de activar regla de confianza |

## Qué cerrar hoy

1. Mantener el flujo E2E funcionando con pruebas reales (normal, ruido, grande, checkboxes).
2. Documentar resultados de prueba por ruta y por endpoint.
3. Confirmar que el historial de versiones se guarda correctamente en `document_versions`.

## Qué cerrar esta semana

1. Ajustar bucket `documents` a privado y revisar política de acceso por usuario.
2. Definir y documentar naming definitivo de archivos en storage.
3. Estabilizar mensajes de error y reintentos para casos 500/504.

## Qué dejar para Fase 2

1. Activar fallback OCR: `tesseract -> google_vision -> openai`.
2. Introducir control de costo por documento para fallback.
3. Unificar criterio de confianza OCR en backend.

## Criterio de salida de riesgo (Fase 1)

Se considera riesgo controlado para Fase 1 cuando:

- Lint y servidor pasan sin errores funcionales.
- Flujo completo de escaneo -> edición -> guardado -> historial funciona con al menos 3 casos reales.
- No hay pérdida de versiones ni sobrescritura accidental de documentos.
