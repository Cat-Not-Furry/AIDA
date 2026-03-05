"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { OcrClientError, processDocument } from "@/lib/ocrClient";
import { buildPdfFileName } from "@/lib/pdfNaming";
import type { OcrCheckbox, OcrResponse } from "@/types/ocr";
import type { DocumentRecord, DocumentVersionRecord } from "@/types/documents";

type StructuredListKey = "fechas" | "dias" | "horarios" | "materiales";

export default function ScanTemplatePage() {
	const { user } = useAuth();
	const [file, setFile] = useState<File | null>(null);
	const [lang, setLang] = useState("spa");
	const [processing, setProcessing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);
	const [documentId, setDocumentId] = useState<string | null>(null);
	const [ocrData, setOcrData] = useState<OcrResponse | null>(null);

	const hasEditorData = Boolean(ocrData);

	const canProcess = useMemo(() => Boolean(file) && !processing, [file, processing]);
	const canSave = useMemo(
		() => isSupabaseConfigured && Boolean(file) && Boolean(ocrData) && !saving,
		[file, ocrData, saving],
	);

	function updateStructuredField(
		key: StructuredListKey,
		index: number,
		value: string,
	) {
		if (!ocrData) {
			return;
		}
		const updated = { ...ocrData };
		const nextList = [...updated.texto_estructurado[key]];
		nextList[index] = value;
		updated.texto_estructurado = { ...updated.texto_estructurado, [key]: nextList };
		setOcrData(updated);
	}

	function addStructuredField(key: StructuredListKey) {
		if (!ocrData) {
			return;
		}
		const updated = { ...ocrData };
		const nextList = [...updated.texto_estructurado[key], ""];
		updated.texto_estructurado = { ...updated.texto_estructurado, [key]: nextList };
		setOcrData(updated);
	}

	function updateCheckbox(index: number, checked: boolean) {
		if (!ocrData) {
			return;
		}
		const updatedCheckboxes = [...ocrData.checkboxes];
		const current = updatedCheckboxes[index];
		updatedCheckboxes[index] = {
			...current,
			respuesta: checked ? "marcado" : "no_marcado",
		};
		setOcrData({ ...ocrData, checkboxes: updatedCheckboxes });
	}

	function generatePdfBlob(data: OcrResponse): Blob {
		const pdf = new jsPDF();
		const maxLineWidth = 180;
		let y = 14;

		pdf.setFontSize(14);
		pdf.text("Documento editado - AIDA", 10, y);
		y += 10;

		pdf.setFontSize(10);

		function printLine(line: string) {
			const lines = pdf.splitTextToSize(line, maxLineWidth);
			lines.forEach((value: string) => {
				if (y > 280) {
					pdf.addPage();
					y = 14;
				}
				pdf.text(value, 10, y);
				y += 6;
			});
		}

		printLine(`Archivo: ${data.filename || "sin_nombre"}`);
		printLine(`Idioma: ${data.metadata.language}`);
		y += 2;

		printLine("Fechas: " + (data.texto_estructurado.fechas.join(" | ") || "-"));
		printLine("Dias: " + (data.texto_estructurado.dias.join(" | ") || "-"));
		printLine("Horarios: " + (data.texto_estructurado.horarios.join(" | ") || "-"));
		printLine(
			"Materiales: " + (data.texto_estructurado.materiales.join(" | ") || "-"),
		);
		printLine("Notas: " + (data.texto_estructurado.notas || "-"));

		if (data.checkboxes.length) {
			y += 2;
			printLine("Checkboxes:");
			data.checkboxes.forEach((checkbox: OcrCheckbox) => {
				printLine(
					`- [${checkbox.respuesta === "marcado" ? "x" : " "}] ${checkbox.pregunta}`,
				);
			});
		}

		y += 2;
		printLine("Texto completo:");
		printLine(data.texto_completo || "");

		return pdf.output("blob");
	}

	async function getNextVersionNumber(currentDocumentId: string): Promise<number> {
		const { data, error: versionError } = await supabase
			.from("document_versions")
			.select("version_number")
			.eq("document_id", currentDocumentId)
			.order("version_number", { ascending: false })
			.limit(1);

		if (versionError) {
			throw versionError;
		}
		const lastVersion = (data as Pick<DocumentVersionRecord, "version_number">[])[0];
		return (lastVersion?.version_number || 0) + 1;
	}

	async function ensureDocument(data: OcrResponse): Promise<string> {
		if (documentId) {
			return documentId;
		}

		const insertPayload = {
			user_id: user?.id,
			template_id: null,
			original_filename: file?.name ?? data.filename ?? "documento_sin_nombre",
			json_data: data,
			pdf_url: null,
		};

		const { data: inserted, error: insertError } = await supabase
			.from("documents")
			.insert(insertPayload)
			.select("id")
			.single();

		if (insertError) {
			throw insertError;
		}
		const row = inserted as Pick<DocumentRecord, "id">;
		setDocumentId(row.id);
		return row.id;
	}

	async function handleProcess() {
		if (!file) {
			setError("Selecciona un archivo antes de procesar.");
			return;
		}
		setError(null);
		setInfo(null);
		setProcessing(true);

		try {
			const result = await processDocument(file, { lang });
			setOcrData(result);
			setInfo("OCR completado. Puedes editar y guardar.");
		} catch (err: unknown) {
			if (err instanceof OcrClientError) {
				setError(`OCR (${err.status}): ${err.message}`);
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Ocurrió un error al procesar el documento.");
			}
		} finally {
			setProcessing(false);
		}
	}

	async function handleSave() {
		if (!isSupabaseConfigured) {
			setError("Supabase no está configurado. Configura .env.local para habilitar guardado.");
			return;
		}
		if (!user?.id) {
			setError("Necesitas iniciar sesión para guardar.");
			return;
		}
		if (!ocrData) {
			setError("No hay datos para guardar.");
			return;
		}

		setSaving(true);
		setError(null);
		setInfo(null);

		try {
			const currentDocumentId = await ensureDocument(ocrData);
			const nextVersionNumber = await getNextVersionNumber(currentDocumentId);
			const pdfBlob = generatePdfBlob(ocrData);
			const finalPdfName = buildPdfFileName(ocrData);
			const pdfPath = `versions/${currentDocumentId}/v${nextVersionNumber}_${finalPdfName}`;

			const { error: uploadError } = await supabase.storage
				.from("documents")
				.upload(pdfPath, pdfBlob, { upsert: false });
			if (uploadError) {
				throw uploadError;
			}

			const { data: publicUrlData } = supabase.storage
				.from("documents")
				.getPublicUrl(pdfPath);
			const pdfUrl = publicUrlData.publicUrl;

			const { error: updateError } = await supabase
				.from("documents")
				.update({
					json_data: ocrData,
					pdf_url: pdfUrl,
					updated_at: new Date().toISOString(),
				})
				.eq("id", currentDocumentId);
			if (updateError) {
				throw updateError;
			}

			const { error: versionInsertError } = await supabase
				.from("document_versions")
				.insert({
					document_id: currentDocumentId,
					version_number: nextVersionNumber,
					json_data: ocrData,
					pdf_url: pdfUrl,
					status: "draft",
					source: "ocr",
					engine: "tesseract",
					fallback_reason: null,
				});
			if (versionInsertError) {
				throw versionInsertError;
			}

			setInfo(
				`Guardado correcto. Documento ${currentDocumentId}, versión ${nextVersionNumber}.`,
			);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "No se pudo guardar.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex flex-col gap-6 max-w-4xl">
			<h1 className="text-2xl font-bold">Escaneo y edición OCR</h1>
			<p className="text-secondary">
				Sube un documento, corrige los datos y guarda una nueva versión.
			</p>

			{error && <p className="text-red-500">{error}</p>}
			{info && <p className="text-green-600">{info}</p>}
			{!isSupabaseConfigured && (
				<div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					Modo degradado activo: puedes procesar OCR y editar, pero no guardar versiones hasta configurar Supabase.
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
				<div className="md:col-span-2">
					<label className="text-sm font-medium">Archivo</label>
					<input
						type="file"
						accept="image/*,application/pdf"
						onChange={(event) =>
							setFile(event.target.files ? event.target.files[0] : null)
						}
						className="border rounded-lg px-3 py-2 w-full"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Idioma OCR</label>
					<select
						value={lang}
						onChange={(event) => setLang(event.target.value)}
						className="border rounded-lg px-3 py-2 w-full"
					>
						<option value="spa">Español</option>
						<option value="eng">Inglés</option>
					</select>
				</div>
			</div>

			<div className="flex flex-wrap gap-3">
				<button
					onClick={handleProcess}
					disabled={!canProcess}
					className="btn-primary py-2 px-4 rounded-full disabled:opacity-60"
				>
					{processing ? "Procesando OCR..." : "Procesar con OCR"}
				</button>
				<button
					onClick={handleSave}
					disabled={!canSave}
					className="btn-primary py-2 px-4 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{saving ? "Guardando..." : "Guardar versión"}
				</button>
			</div>

			{hasEditorData && ocrData && (
				<div className="bg-white rounded-2xl border p-4 space-y-5">
					<div>
						<label className="block text-sm font-semibold mb-1">Texto completo</label>
						<textarea
							value={ocrData.texto_completo}
							onChange={(event) =>
								setOcrData({ ...ocrData, texto_completo: event.target.value })
							}
							className="border rounded-lg px-3 py-2 w-full h-48"
						/>
					</div>

					<StructuredSection
						title="Fechas"
						values={ocrData.texto_estructurado.fechas}
						onChange={(index, value) => updateStructuredField("fechas", index, value)}
						onAdd={() => addStructuredField("fechas")}
					/>
					<StructuredSection
						title="Días"
						values={ocrData.texto_estructurado.dias}
						onChange={(index, value) => updateStructuredField("dias", index, value)}
						onAdd={() => addStructuredField("dias")}
					/>
					<StructuredSection
						title="Horarios"
						values={ocrData.texto_estructurado.horarios}
						onChange={(index, value) =>
							updateStructuredField("horarios", index, value)
						}
						onAdd={() => addStructuredField("horarios")}
					/>
					<StructuredSection
						title="Materiales"
						values={ocrData.texto_estructurado.materiales}
						onChange={(index, value) =>
							updateStructuredField("materiales", index, value)
						}
						onAdd={() => addStructuredField("materiales")}
					/>

					<div>
						<label className="block text-sm font-semibold mb-1">Notas</label>
						<textarea
							value={ocrData.texto_estructurado.notas}
							onChange={(event) =>
								setOcrData({
									...ocrData,
									texto_estructurado: {
										...ocrData.texto_estructurado,
										notas: event.target.value,
									},
								})
							}
							className="border rounded-lg px-3 py-2 w-full h-24"
						/>
					</div>

					{ocrData.checkboxes.length > 0 && (
						<div className="space-y-2">
							<h2 className="font-semibold">Checkboxes</h2>
							{ocrData.checkboxes.map((checkbox, index) => (
								<label key={`${checkbox.pregunta}-${index}`} className="flex gap-2">
									<input
										type="checkbox"
										checked={checkbox.respuesta === "marcado"}
										onChange={(event) =>
											updateCheckbox(index, event.target.checked)
										}
									/>
									<span>{checkbox.pregunta || `Opción ${index + 1}`}</span>
								</label>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

interface StructuredSectionProps {
	title: string;
	values: string[];
	onChange: (index: number, value: string) => void;
	onAdd: () => void;
}

function StructuredSection({
	title,
	values,
	onChange,
	onAdd,
}: StructuredSectionProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold">{title}</h2>
				<button type="button" className="text-primary text-sm" onClick={onAdd}>
					+ Agregar
				</button>
			</div>
			{values.length === 0 ? (
				<p className="text-sm text-secondary">Sin datos detectados.</p>
			) : (
				values.map((value, index) => (
					<input
						key={`${title}-${index}`}
						value={value}
						onChange={(event) => onChange(index, event.target.value)}
						className="border rounded-lg px-3 py-2 w-full"
					/>
				))
			)}
		</div>
	);
}
