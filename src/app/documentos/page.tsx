"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import type { DocumentRecord } from "@/types/documents";

type DocumentListItem = Pick<
	DocumentRecord,
	"id" | "original_filename" | "pdf_url" | "created_at" | "updated_at"
>;

export default function DocumentosPage() {
	const { user } = useAuth();
	const [documents, setDocuments] = useState<DocumentListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadDocuments() {
			if (!isSupabaseConfigured) {
				setError("Supabase no está configurado. La lista de documentos está deshabilitada.");
				setLoading(false);
				return;
			}

			if (!user?.id) {
				setLoading(false);
				return;
			}

			const { data, error: queryError } = await supabase
				.from("documents")
				.select("id, original_filename, pdf_url, created_at, updated_at")
				.eq("user_id", user.id)
				.order("updated_at", { ascending: false });

			if (queryError) {
				setError(queryError.message);
			} else {
				setDocuments((data as DocumentListItem[]) || []);
			}
			setLoading(false);
		}

		loadDocuments();
	}, [user?.id]);

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold">Documentos</h1>
			{!isSupabaseConfigured && (
				<div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					Modo degradado activo: configura Supabase para consultar y versionar documentos.
				</div>
			)}
			{loading && <p>Cargando documentos...</p>}
			{error && <p className="text-red-500">{error}</p>}

			{!loading && !error && documents.length === 0 && (
				<p className="text-secondary">
					No tienes documentos guardados. Ve a escaneo para crear el primero.
				</p>
			)}

			{documents.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{documents.map((document) => (
						<div key={document.id} className="bg-white rounded-2xl border p-4">
							<p className="font-semibold">{document.original_filename}</p>
							<p className="text-sm text-secondary">
								Actualizado: {new Date(document.updated_at).toLocaleString()}
							</p>
							<div className="mt-3 flex gap-3">
								<Link
									href={`/documentos/${document.id}`}
									className="text-primary font-medium hover:underline"
								>
									Ver historial
								</Link>
								{document.pdf_url && (
									<a
										href={document.pdf_url}
										target="_blank"
										rel="noreferrer"
										className="text-primary font-medium hover:underline"
									>
										Abrir PDF actual
									</a>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
