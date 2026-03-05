import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type GeneratedDocument = {
  id: string;
  original_filename: string;
  pdf_url: string | null;
  created_at: string;
};

export default async function TemplateDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Plantilla</h1>
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Modo degradado activo: configura Supabase para consultar plantillas y documentos.
        </div>
      </div>
    );
  }

  // fetch template metadata server-side
  const { data: template } = await supabase
    .from("templates")
    .select("id, name, description, html_url, created_at")
    .eq("id", id)
    .single();

  // fetch documents for this template
  const { data: documents } = await supabase
    .from("documents")
    .select("id, original_filename, pdf_url, created_at")
    .eq("template_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Plantilla: {template?.name || "-"}</h1>
      {template?.description && <p className="text-secondary">{template.description}</p>}
      {template?.html_url && (
        <a
          href={template.html_url}
          className="text-primary font-medium hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Abrir referencia de plantilla
        </a>
      )}

      <section>
        <h2 className="font-semibold text-xl mb-2">Documentos generados</h2>
        {documents && documents.length > 0 ? (
          <ul className="space-y-2">
            {(documents as GeneratedDocument[]).map((doc) => (
              <li key={doc.id}>
                <p className="font-medium">{doc.original_filename}</p>
                <p className="text-sm text-secondary">
                  {new Date(doc.created_at).toLocaleString()}
                </p>
                {doc.pdf_url && (
                  <a
                    href={doc.pdf_url}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir PDF
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-secondary">No se ha generado ningún documento todavía.</p>
        )}
      </section>
    </div>
  );
}
