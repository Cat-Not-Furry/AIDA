import type {
	OcrRawResponse,
	OcrResponse,
	OcrStructuredText,
	OcrMetadata,
	OcrCheckbox,
	OcrCoordinate,
} from "@/types/ocr";

const OCR_BASE_URL = process.env.NEXT_PUBLIC_API_OCR_URL || "";
const OCR_FALLBACK_BASE_URL = process.env.NEXT_PUBLIC_API_OCR_FALLBACK_URL || "";
const OCR_FALLBACK_PROVIDER = process.env.NEXT_PUBLIC_OCR_FALLBACK_PROVIDER || "OCR.space";

export interface ProcessDocumentOptions {
	lang?: string;
	returnCoords?: boolean;
	useUnifiedOcr?: boolean;
	optimizeFor?: "texto" | "estructura" | "precision";
	signal?: AbortSignal;
}

export interface ProcessDocumentResult {
	data: OcrResponse;
	usedFallback: boolean;
	provider: "primary" | "fallback";
	providerLabel: string;
}

export class OcrClientError extends Error {
	public readonly status: number;

	public constructor(message: string, status: number) {
		super(message);
		this.name = "OcrClientError";
		this.status = status;
	}
}

function normalizeStructuredText(
	value: OcrRawResponse["texto_estructurado"],
): OcrStructuredText {
	return {
		texto_limpio: value?.texto_limpio ?? "",
		horarios: Array.isArray(value?.horarios) ? value.horarios : [],
		dias: Array.isArray(value?.dias) ? value.dias : [],
		materiales: Array.isArray(value?.materiales) ? value.materiales : [],
		notas: value?.notas ?? "",
		fechas: Array.isArray(value?.fechas) ? value.fechas : [],
	};
}

function normalizeMetadata(value: OcrRawResponse["metadata"]): OcrMetadata {
	return {
		language: value?.language ?? "spa",
		optimizacion: value?.optimizacion ?? "texto",
		lineas_detectadas: value?.lineas_detectadas ?? 0,
		correct_spelling: value?.correct_spelling ?? false,
	};
}

function normalizeCheckboxes(value: OcrRawResponse["checkboxes"]): OcrCheckbox[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.map((item) => {
		const checkbox = item as Partial<OcrCheckbox>;
		return {
			pregunta: checkbox.pregunta ?? "",
			respuesta: checkbox.respuesta === "marcado" ? "marcado" : "no_marcado",
			tipo: checkbox.tipo ?? "square",
			confianza: checkbox.confianza ?? 0,
		};
	});
}

function normalizeCoordinates(value: OcrRawResponse["coordenadas"]): OcrCoordinate[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.map((item) => {
		const coordinate = item as Partial<OcrCoordinate>;
		const bbox = Array.isArray(coordinate.bbox)
			? (coordinate.bbox.slice(0, 4) as [number, number, number, number])
			: ([0, 0, 0, 0] as [number, number, number, number]);

		return {
			texto: coordinate.texto ?? "",
			bbox,
			confianza: coordinate.confianza ?? 0,
			linea: coordinate.linea ?? 0,
			bloque: coordinate.bloque ?? 0,
			parrafo: coordinate.parrafo ?? 0,
		};
	});
}

function normalizeOcrResponse(raw: OcrRawResponse): OcrResponse {
	return {
		success: Boolean(raw.success),
		filename: raw.filename ?? "",
		texto_completo: raw.texto_completo ?? raw.text ?? "",
		texto_estructurado: normalizeStructuredText(raw.texto_estructurado),
		checkboxes: normalizeCheckboxes(raw.checkboxes),
		metadata: normalizeMetadata(raw.metadata),
		coordenadas: normalizeCoordinates(raw.coordenadas),
	};
}

async function toErrorMessage(response: Response): Promise<string> {
	try {
		const payload = (await response.json()) as { detail?: string; error?: string };
		return payload.detail || payload.error || `Error OCR ${response.status}`;
	} catch {
		return `Error OCR ${response.status}`;
	}
}

export function isOcrConfigured(): boolean {
	return Boolean(OCR_BASE_URL);
}

function buildFormData(file: File, options: ProcessDocumentOptions): FormData {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("lang", options.lang ?? "spa");
	formData.append("optimizar_para", options.optimizeFor ?? "texto");

	if (options.returnCoords ?? true) {
		formData.append("return_coords", "true");
	}

	if (options.useUnifiedOcr ?? false) {
		formData.append("use_unified_ocr", "true");
	} else {
		formData.append("use_unified_ocr", "false");
	}

	return formData;
}

async function requestOcr(
	baseUrl: string,
	file: File,
	options: ProcessDocumentOptions,
): Promise<OcrResponse> {
	const response = await fetch(`${baseUrl}/ocr/documento_completo`, {
		method: "POST",
		body: buildFormData(file, options),
		signal: options.signal,
	});

	if (!response.ok) {
		const message = await toErrorMessage(response);
		throw new OcrClientError(message, response.status);
	}

	const raw = (await response.json()) as OcrRawResponse;
	return normalizeOcrResponse(raw);
}

export async function processDocument(
	file: File,
	options: ProcessDocumentOptions = {},
): Promise<ProcessDocumentResult> {
	if (!OCR_BASE_URL) {
		throw new OcrClientError(
			"Falta configurar NEXT_PUBLIC_API_OCR_URL",
			500,
		);
	}

	try {
		const data = await requestOcr(OCR_BASE_URL, file, options);
		return {
			data,
			usedFallback: false,
			provider: "primary",
			providerLabel: "OCR principal",
		};
	} catch (error: unknown) {
		if (!(error instanceof OcrClientError)) {
			throw error;
		}

		const shouldFallback = error.status === 504 && Boolean(OCR_FALLBACK_BASE_URL);
		if (!shouldFallback) {
			throw error;
		}

		try {
			const data = await requestOcr(OCR_FALLBACK_BASE_URL, file, options);
			return {
				data,
				usedFallback: true,
				provider: "fallback",
				providerLabel: OCR_FALLBACK_PROVIDER,
			};
		} catch (fallbackError: unknown) {
			if (fallbackError instanceof OcrClientError) {
				throw new OcrClientError(
					`OCR principal respondió 504 y fallback (${OCR_FALLBACK_PROVIDER}) falló: ${fallbackError.message}`,
					fallbackError.status,
				);
			}

			throw new OcrClientError(
				`OCR principal respondió 504 y fallback (${OCR_FALLBACK_PROVIDER}) falló por error inesperado.`,
				500,
			);
		}
	}
}
