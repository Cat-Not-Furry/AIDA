import { NextResponse } from "next/server";

export const runtime = "nodejs";

const OCR_SPACE_API_KEY = process.env.OCR_SPACE_API_KEY || "";
const OCR_SPACE_ENDPOINT = "https://api.ocr.space/parse/image";
const MAX_FILE_SIZE_BYTES = 1024 * 1024;

type OcrSpaceResponse = {
	OCRExitCode?: number;
	IsErroredOnProcessing?: boolean;
	ErrorMessage?: string;
	ParsedResults?: Array<{
		ParsedText?: string;
	}>;
};

function detail(message: string, status: number): NextResponse {
	return NextResponse.json({ detail: message }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
	if (!OCR_SPACE_API_KEY) {
		return detail("Falta configurar OCR_SPACE_API_KEY en el backend.", 500);
	}

	try {
		const formData = await request.formData();
		const file = formData.get("file");
		const langRaw = formData.get("lang");
		const lang = typeof langRaw === "string" ? langRaw : "spa";

		if (!(file instanceof File)) {
			return detail("No se encontró el archivo en el campo file.", 400);
		}

		if (file.size <= 0) {
			return detail("El archivo está vacío.", 400);
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			return detail(
				"El archivo supera el máximo permitido para fallback OCR.space (1MB).",
				413,
			);
		}

		const ocrSpaceFormData = new FormData();
		ocrSpaceFormData.append("apikey", OCR_SPACE_API_KEY);
		ocrSpaceFormData.append("file", file);
		ocrSpaceFormData.append("language", lang === "eng" ? "eng" : "spa");
		ocrSpaceFormData.append("OCREngine", "2");

		const ocrSpaceResponse = await fetch(OCR_SPACE_ENDPOINT, {
			method: "POST",
			body: ocrSpaceFormData,
		});

		const payload = (await ocrSpaceResponse.json().catch(() => ({}))) as OcrSpaceResponse;

		if (!ocrSpaceResponse.ok) {
			return detail(
				payload.ErrorMessage || `OCR.space error ${ocrSpaceResponse.status}`,
				ocrSpaceResponse.status,
			);
		}

		if (payload.IsErroredOnProcessing) {
			return detail(
				payload.ErrorMessage || "OCR.space falló al procesar el documento.",
				500,
			);
		}

		const parsedText =
			payload.ParsedResults?.[0]?.ParsedText?.trim() ?? "";
		const lineCount = parsedText ? parsedText.split("\n").length : 0;

		const fallbackPayload = {
			success: true,
			filename: file.name,
			texto_completo: parsedText,
			texto_estructurado: {
				texto_limpio: parsedText,
				horarios: [],
				dias: [],
				materiales: [],
				notas: "",
				fechas: [],
			},
			checkboxes: [],
			metadata: {
				language: lang,
				optimizacion: "texto",
				lineas_detectadas: lineCount,
				correct_spelling: false,
			},
			coordenadas: [],
		};

		return NextResponse.json(fallbackPayload, { status: 200 });
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Error inesperado en fallback OCR.";
		return detail(message, 500);
	}
}
