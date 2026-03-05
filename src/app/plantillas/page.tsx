"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type Template = {
  id: string;
  name: string;
  created_at: string;
};

type TemplateDocumentCountRow = {
  template_id: string;
};

export default function PlantillasPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [degradedMessage, setDegradedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      if (!isSupabaseConfigured) {
        setDegradedMessage(
          "Supabase no está configurado. Puedes ver la interfaz, pero las acciones de plantillas están deshabilitadas.",
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("templates")
        .select("id, name, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching templates", error);
      } else if (data) {
        const templateList = data as Template[];
        setTemplates(templateList);

        // now fetch document counts for these templates
        const ids = templateList.map((t) => t.id);
        if (ids.length) {
          const { data: docs } = await supabase
            .from("documents")
            .select("template_id")
            .in("template_id", ids);
          const map: Record<string, number> = {};
          const docRows = (docs as TemplateDocumentCountRow[] | null) ?? [];
          docRows.forEach((d) => {
            map[d.template_id] = (map[d.template_id] || 0) + 1;
          });
          setCounts(map);
        }
      }
      setLoading(false);
    }
    loadTemplates();
  }, []);

  const isDegraded = !isSupabaseConfigured;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Plantillas &rarr; OCR experimental</h1>
      {degradedMessage && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {degradedMessage}
        </div>
      )}

      {/* quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center">
          <svg
            suppressHydrationWarning
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-primary mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          <h2 className="text-xl font-semibold">Escanear plantillas</h2>
          <p className="text-secondary mt-2">Sube o toma una foto de una plantilla para procesarla.</p>
          <Link
            href={isDegraded ? "#" : "/plantillas/scan"}
            aria-disabled={isDegraded}
            className={`mt-6 ${isDegraded ? "pointer-events-none" : ""}`}
          >
            <button className="btn-primary py-3 px-6 rounded-full">
              Ir a escaneo
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center">
          <svg
            suppressHydrationWarning
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-secondary mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 8c-3.314 0-6 1.343-6 3v1h12v-1c0-1.657-2.686-3-6-3z"
            />
          </svg>
          <h2 className="text-xl font-semibold">Escanear documentos</h2>
          <p className="text-secondary mt-2">Convierte varias hojas en un solo PDF y asócialas a una plantilla.</p>
          <Link
            href={isDegraded ? "#" : "/plantillas/scan-docs"}
            aria-disabled={isDegraded}
            className={`mt-6 ${isDegraded ? "pointer-events-none" : ""}`}
          >
            <button className="btn-primary py-3 px-6 rounded-full">
              Comenzar escaneo
            </button>
          </Link>
        </div>
      </div>

      {/* listado de plantillas guardadas */}
      {loading ? (
        <p>Cargando plantillas…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-3xl shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">{tpl.name}</h3>
                <p className="text-sm text-muted mt-1">
                  Creada {new Date(tpl.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-secondary mt-1">
                  {counts[tpl.id] || 0} documentos
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/plantillas/${tpl.id}`}
                  className="text-primary font-medium hover:underline"
                >
                  Ver
                </Link>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <p className="text-secondary">No tienes plantillas aún.</p>
          )}
        </div>
      )}
    </div>
  );
}
