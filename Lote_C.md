# LOTE C - Cierre y robustez (T7, T8, T9, T10)

Objetivo:
Completar PDF versionado, historial de versiones, manejo robusto de errores y documentacion final.

Alcance:
- T7 Generacion y subida de PDF versionado
- T8 Vista de detalle e historial
- T9 Manejo de errores y estados
- T10 Documentacion final de Fase 1

Reglas:
1) Mantener naming acordado para PDF.
2) No activar fallback multi-proveedor (solo preparar estructura si hace falta).
3) Mantener cambios acotados y sin sobreingenieria.

Tareas concretas:
- Generar nombre de PDF con regla:
  `[nombre_documento]_[punto_clave_1]_[punto_clave_2].pdf`
  normalizado (minusculas, sin acentos, espacios a guiones).
- Subir PDF versionado al bucket `documents` y guardar `pdf_url`.
- Implementar/ajustar `src/app/documentos/[id]/page.tsx` para mostrar:
  - metadata del documento
  - lista de versiones (desc)
  - enlace a PDF por version
- Componente de versiones (si no existe) con informacion:
  - version_number
  - created_at
  - status
  - engine
  - pdf_url
- Endurecer manejo de errores:
  - 400/422/500/504
  - mensajes claros
  - estados de UI consistentes
- Actualizar README con:
  - setup final
  - flujo E2E
  - notas de fase 1
  - referencia a `indice_agente.md`, `reglas_rapidas.md`, `analisis_profundo.md`

Criterios de aceptacion:
- Documento con historial navegable y PDFs accesibles.
- Errores controlados en UI.
- README listo para onboarding tecnico de equipo.

Entrega esperada:
- Resumen de cambios.
- Checklist de pruebas ejecutadas.
- Riesgos pendientes para Fase 2.
