# AIDA Web

Aplicación web en Next.js para autenticación, gestión de plantillas y flujo de edición de documentos OCR.

## Requisitos

- Node.js 20+
- npm 10+

## Variables de entorno

Crea `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
NEXT_PUBLIC_API_OCR_URL=https://api-ocr-g2g4.onrender.com
```

> Importante: el archivo debe llamarse exactamente `.env.local`.  
> Si se llama `.env.locales`, Next.js no cargará las variables.

## Ejecución local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Base mínima en Supabase

- Habilitar Auth.
- Crear bucket `documents`.
- Ejecutar `supabase_schema.sql` para tablas `templates`, `documents` y `document_versions`.

## Flujo E2E (Fase 1)

1. Ir a `plantillas/scan`.
2. Subir archivo y procesar con `POST /ocr/documento_completo`.
3. Editar `texto_completo`, campos estructurados y checkboxes.
4. Guardar versión:
   - Actualiza `documents`.
   - Inserta fila en `document_versions`.
   - Sube PDF versionado al bucket `documents`.
5. Consultar historial en `documentos/[id]`.

## Convención de PDF versionado

- Formato: `[nombre_documento]_[punto_clave_1]_[punto_clave_2].pdf`.
- Normalización: minúsculas, sin acentos, espacios a guiones.
- Ubicación en storage: `documents/versions/<document_id>/`.

## Limitaciones actuales (Fase 1)

- Sin autoguardado.
- Sin fallback multi-proveedor activo (solo motor principal).
- El PDF versionado se genera en frontend como salida funcional inicial.

## Errores comunes

- **Supabase client not initialized**
	- Causa: faltan `NEXT_PUBLIC_SUPABASE_URL` o `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
	- Solución: definir ambas variables en `.env.local` y reiniciar `npm run dev`.
- **Hydration mismatch en desarrollo**
	- Causa frecuente: extensiones que mutan el DOM (ej. Dark Reader).
	- Solución: probar en ventana incógnito o desactivar la extensión para confirmar.

## Modo degradado sin Supabase

Si faltan variables de Supabase, la app entra en modo degradado:

- Se mantiene navegable para revisar UI.
- Se deshabilitan acciones que dependen de DB/Storage (guardar versiones, listar documentos, carga de escaneos asociados).
- Se muestran avisos locales en páginas afectadas.

### Salir del modo degradado

1. Renombra el archivo de entorno a `.env.local` (si está como `.env.locales`).
2. Define:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Reinicia el servidor de desarrollo:
   - `npm run dev`

## Guía para agentes

Para trabajo asistido con agentes en este proyecto:

- Punto de entrada: `indice_agente.md`
- Reglas de uso diario: `reglas_rapidas.md`
- Escalamiento para decisiones complejas: `analisis_profundo.md`
- Riesgos y mitigación por fase: `riesgos_mitigacion.md`
