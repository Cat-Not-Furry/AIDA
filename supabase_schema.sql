-- Ejecutar en la consola de Supabase o a través de migraciones

-- users table se gestiona desde Auth de Supabase, no es necesario crear

CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  json_structure jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid REFERENCES templates(id) ON DELETE SET NULL,
  file_url text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
