import { supabase } from "@/lib/supabaseClient";
import DocumentForm from "@/components/templates/DocumentForm";

export default async function TemplateDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  // fetch template metadata server-side
  const { data: template } = await supabase
    .from("templates")
    .select("id, name, json_structure, created_at")
    .eq("id", id)
    .single();

  // fetch documents for this template
  const { data: documents } = await supabase
    .from("documents")
    .select("id, file_url, created_at")
    .eq("template_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Plantilla: {template?.name || "-"}</h1>

      {template?.json_structure && (
        <DocumentForm
          structure={template.json_structure as Record<string, string>}
          templateId={template.id}
        />
      )}

      <section>
        <h2 className="font-semibold text-xl mb-2">Documentos generados</h2>
        {documents && documents.length > 0 ? (
          <ul className="space-y-2">
            {documents.map((doc: any) => (
              <li key={doc.id}>
                <a
                  href={doc.file_url}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {new Date(doc.created_at).toLocaleString()}
                </a>
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
