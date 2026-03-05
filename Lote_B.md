# LOTE B - Flujo funcional (T4, T5, T6)

Objetivo:
Implementar flujo real: subir documento -> OCR -> editar -> guardar documento y version.

Alcance:
- T4 Integrar /plantillas/scan con OCR real
- T5 Editor dinamico completo
- T6 Guardado en documents + document_versions

Reglas:
1) No cambiar arquitectura.
2) No inventar endpoints/campos no definidos.
3) Si falta definicion de algun campo importante, detener y preguntar.
4) No introducir autoguardado (no aplica en esta fase).

Tareas concretas:
- Reemplazar logica simulada en `src/app/plantillas/scan/page.tsx` por OCR real usando capa del lote A.
- Permitir carga y procesamiento de imagen/documento con estados de UI:
  - loading
  - error
  - ready
- Implementar editor dinamico para:
  - `texto_completo`
  - `texto_estructurado` (fechas, dias, horarios, materiales, notas)
  - `checkboxes` (si existen)
- Manejar casos con datos vacios sin romper UI.
- Al guardar:
  - crear/actualizar registro en `documents`
  - insertar nueva version en `document_versions`
  - incrementar `version_number`
  - persistir `json_data`
  - setear `source`, `engine`, `fallback_reason` segun corresponda

Criterios de aceptacion:
- Flujo funcional real en `/plantillas/scan`.
- Cada guardado explicito crea una nueva version.
- Sin autoguardado.
- No hay dependencia de mocks para OCR.

Entrega esperada:
- Archivos modificados.
- Pasos de prueba manual.
- Limitaciones detectadas para lote C.
