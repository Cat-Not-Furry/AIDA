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
```

## Ejecución local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Base mínima en Supabase

- Habilitar Auth.
- Crear bucket `documents`.
- Ejecutar `supabase_schema.sql` para tablas `templates` y `documents`.
