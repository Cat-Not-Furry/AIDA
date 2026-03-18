"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

type Template = { id: string; name: string };

export default function ScanDocumentsPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileList | null>(null);
  const [templateId, setTemplateId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("templates")
        .select("id, name")
        .eq("user_id", user?.id);
      if (data) setTemplates(data as Template[]);
    }
    if (user) load();
  }, [user]);

  const handleUpload = async () => {
    if (!files || !templateId) {
      setError("Selecciona archivos y plantilla");
      return;
    }
    // stub: convert to single PDF locally, then upload
    const { data, error: supaError } = await supabase.storage
      .from("documents")
      .upload(`scan-${Date.now()}.pdf`, files[0]);
    if (supaError) {
      setError(supaError.message);
    } else if (data) {
      // save metadata record
      await supabase.from("documents").insert({
        user_id: user?.id,
        template_id: templateId,
        file_url: data.path,
      });
      window.location.href = "/plantillas";
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <h1 className="text-2xl font-bold">Escaneo de documentos</h1>
      {error && <p className="text-red-500">{error}</p>}
      <select
        value={templateId}
        onChange={(e) => setTemplateId(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="">-- Selecciona plantilla --</option>
        {templates.map((tpl) => (
          <option key={tpl.id} value={tpl.id}>
            {tpl.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={(e) => setFiles(e.target.files)}
      />
      <button onClick={handleUpload} className="btn-primary py-2 px-4 rounded-full">
        Generar PDF (simulado)
      </button>
    </div>
  );
}
