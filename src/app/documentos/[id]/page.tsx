"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import VersionList from "@/components/documents/VersionList";
import type { DocumentRecord, DocumentVersionRecord } from "@/types/documents";

type DocumentDetail = Pick<
	DocumentRecord,
	"id" | "original_filename" | "pdf_url" | "created_at" | "updated_at"
>;

export default function DocumentoDetallePage() {
	const params = useParams<{ id: string }>();
	const documentId = params.id;
	const { user } = useAuth();
	const [document, setDocument] = useState<DocumentDetail | null>(null);
	const [versions, setVersions] = useState<DocumentVersionRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadData() {
			if (!isSupabaseConfigured) {
				setError("Supabase no está configurado. No se puede cargar el detalle del documento.");
				setLoading(false);
				return;
			}

			if (!user?.id || !documentId) {
				setLoading(false);
				return;
			}

			const { data: docData, error: docError } = await supabase
				.from("documents")
				.select("id, original_filename, pdf_url, created_at, updated_at")
				.eq("id", documentId)
				.eq("user_id", user.id)
				.single();

			if (docError) {
				setError(docError.message);
				setLoading(false);
				return;
			}

			setDocument(docData as DocumentDetail);

			const { data: versionsData, error: versionsError } = await supabase
				.from("document_versions")
				.select(
					"id, document_id, version_number, json_data, pdf_url, status, source, engine, fallback_reason, created_at",
				)
				.eq("document_id", documentId)
				.order("version_number", { ascending: false });

			if (versionsError) {
				setError(versionsError.message);
			} else {
				setVersions((versionsData as DocumentVersionRecord[]) || []);
			}

			setLoading(false);
		}

		loadData();
	}, [documentId, user?.id]);

	return (
		<div className="flex flex-col gap-6">
			<Link href="/documentos" className="text-primary font-medium hover:underline">
				← Volver a documentos
			</Link>
			{!isSupabaseConfigured && (
				<div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					Modo degradado activo: configura Supabase para consultar versiones.
				</div>
			)}

			{loading && <p>Cargando detalle del documento...</p>}
			{error && <p className="text-red-500">{error}</p>}

			{document && (
				<div className="bg-white rounded-2xl border p-4">
					<h1 className="text-2xl font-bold">{document.original_filename}</h1>
					<p className="text-sm text-secondary">
						Creado: {new Date(document.created_at).toLocaleString()}
					</p>
					<p className="text-sm text-secondary">
						Actualizado: {new Date(document.updated_at).toLocaleString()}
					</p>
					{document.pdf_url && (
						<div className="mt-2">
							<a
								href={document.pdf_url}
								target="_blank"
								rel="noreferrer"
								className="text-primary font-medium hover:underline"
							>
								Abrir PDF actual
							</a>
						</div>
					)}
				</div>
			)}

			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Historial de versiones</h2>
				<VersionList versions={versions} />
			</section>
		</div>
	);
}
