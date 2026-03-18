"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function ScanTemplatePage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !name) {
      setError("Debes seleccionar un archivo y dar un nombre");
      return;
    }
    // stub: pretend OCR returns structure detected by OCR
    const mockStructure = { nombre: "Nombre completo", fecha: "Fecha", clave: "Clave" };
    const { error: supaError } = await supabase.from("templates").insert({
      name,
      json_structure: mockStructure,
      user_id: user?.id,
    });
    if (supaError) {
      setError(supaError.message);
    } else {
      // redirect to plantillas list
      window.location.href = "/plantillas";
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <h1 className="text-2xl font-bold">Escaneo de plantilla</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Nombre de plantilla"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className=""
      />
      <button onClick={handleUpload} className="btn-primary py-2 px-4 rounded-full">
        Guardar plantilla (simulado)
      </button>
    </div>
  );
}
