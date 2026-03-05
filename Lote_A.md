# LOTE A - Base tecnica (T1, T2, T3)

Objetivo:
Dejar lista la base tecnica para integrar OCR + editor en AIDA sin romper lo existente.

Alcance:
- T1 Preparacion de entorno y base Supabase
- T2 Tipos canonicos OCR + Versionado
- T3 Servicio OCR desacoplado

Reglas:
1) No cambiar arquitectura ni logica de negocio.
2) No agregar dependencias nuevas salvo necesidad estricta.
3) No modificar fuera de AIDA.
4) Si hay una decision importante/ambigua, detener y pedir confirmacion con pros/contras/riesgos.
5) Mantener soluciones simples.

Tareas concretas:
- Verificar/ajustar variables de entorno usadas por frontend:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - NEXT_PUBLIC_API_OCR_URL
- Verificar/ajustar `src/lib/supabaseClient.ts` para uso consistente.
- Crear/ajustar tipos en `src/types/ocr.ts` para respuesta de `/ocr/documento_completo`.
- Crear/ajustar tipos de entidades:
  - Document
  - DocumentVersion
  - Engine = 'tesseract' | 'google_vision' | 'openai' | 'manual'
- Crear servicio OCR desacoplado (`src/lib/ocrClient.ts` o equivalente) con:
  - llamada a `/ocr/documento_completo`
  - manejo de errores HTTP
  - normalizacion minima de respuesta para editor
- Actualizar README solo en seccion setup si hace falta.

Criterios de aceptacion:
- Proyecto compila sin errores de tipos por estos cambios.
- Hay una capa OCR reutilizable (no fetch disperso).
- Los tipos reflejan estructura real OCR + versionado acordado.
- No se rompe ningun flujo existente.

Entrega esperada:
- Lista de archivos cambiados.
- Resumen de que quedo listo.
- Riesgos pendientes (si aplica).
