"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface DocumentFormProps {
  structure: Record<string, string>;
  templateId?: string;
}

export default function DocumentForm({ structure, templateId }: DocumentFormProps) {
  const { user } = useAuth();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    Object.keys(structure).forEach((k) => (init[k] = ""));
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, val: string) => {
    setValues((v) => ({ ...v, [key]: val }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      // simple PDF creation
      const doc = new jsPDF();
      let y = 10;
      Object.entries(values).forEach(([k, v]) => {
        doc.text(`${k}: ${v}`, 10, y);
        y += 10;
      });
      const blob = doc.output("blob");

      const filename = `doc-${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filename, blob as Blob);
      if (uploadError) throw uploadError;

      // record metadata
      await supabase.from("documents").insert({
        user_id: user?.id,
        template_id: templateId,
        original_filename: filename,
        json_data: values,
        pdf_url: uploadData?.path
          ? supabase.storage.from("documents").getPublicUrl(uploadData.path).data.publicUrl
          : null,
      });

      alert("Documento generado y guardado");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al generar documento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="font-semibold">Rellenar campos</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {Object.entries(structure).map(([key, label]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium">{label}</label>
            <input
              value={values[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="btn-primary mt-4 py-2 px-4 rounded-full"
      >
        {saving ? "Generando…" : "Generar PDF"}
      </button>
    </div>
  );
}
