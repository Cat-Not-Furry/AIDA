# Guía rápida: conectar AIDA con Supabase

Esta guía es para dejar el proyecto funcionando con base de datos y storage.

## 1) Crear proyecto en Supabase

1. Entra a `https://supabase.com`.
2. Crea un proyecto nuevo.
3. Espera a que termine el aprovisionamiento.

## 2) Obtener credenciales

En Supabase, ve a `Project Settings -> API` y copia:

- `Project URL`
- `anon public key`

## 3) Configurar variables en AIDA

En la raíz de `aida`, crea el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
NEXT_PUBLIC_API_OCR_URL=https://api-ocr-g2g4.onrender.com
```

Tip:
- No subir `.env.local` a git.
- Puedes usar `.env.example` como referencia.

## 4) Crear bucket de documentos

En Supabase:

1. Ve a `Storage`.
2. Crea bucket `documents`.
3. Para pruebas internas, puedes dejarlo público.
4. Recomendado para producción: privado + políticas por usuario autenticado.

## 5) Ejecutar esquema SQL

Ve a `SQL Editor` y ejecuta tu `supabase_schema.sql`.

Debe crear como mínimo:

- `templates`
- `documents`
- `document_versions`

Campos esperados (resumen):

- `templates`: `id, name, description, html_url, created_at`
- `documents`: `id, user_id, template_id, original_filename, json_data, pdf_url, created_at, updated_at`
- `document_versions`: `id, document_id, version_number, json_data, pdf_url, status, source, engine, fallback_reason, created_at`

## 6) Revisar autenticación

En `Authentication`:

1. Habilita Email/Password.
2. Crea un usuario de prueba.
3. En AIDA, entra por `/login`.

## 7) Levantar el proyecto

En raíz de `aida`:

```bash
npm install
npm run dev
```

Abre:
- `http://localhost:3000`

## 8) Prueba funcional mínima

1. Ir a `/plantillas/scan`.
2. Subir imagen/documento.
3. Procesar OCR.
4. Editar campos.
5. Guardar versión.
6. Ir a `/documentos` y luego `/documentos/[id]`.
7. Verificar versión y PDF en storage.

## 9) Errores comunes

- **"Supabase client not initialized"**
	- Faltan variables o están mal escritas en `.env.local`.
- **No guarda versiones**
	- Revisar que exista `document_versions`.
- **No sube PDF**
	- Revisar bucket `documents` y políticas.
- **Login funciona pero no consulta**
	- Revisar RLS/policies y que `user_id` coincida con el usuario autenticado.

## 10) Recomendación para siguiente paso

Cuando termine validación interna:

1. Pasar bucket a privado.
2. Definir políticas de acceso por usuario.
3. Activar y probar fallback OCR en fase 2 (Tesseract -> Google Vision -> OpenAI).
