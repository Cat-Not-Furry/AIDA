export interface OcrDocumentoCompletoRespuesta {
	success: boolean;
	filename: string;
	texto_completo: string;
	texto_estructurado?: {
		texto_limpio?: string;
		horarios?: string[];
		dias?: string[];
		materiales?: string[];
		fechas?: string[];
	};
	metadata?: Record<string, unknown>;
}

export class OcrService {
	static async procesarDocumentoCompleto(
		archivo: File,
		lang = "spa"
	): Promise<OcrDocumentoCompletoRespuesta> {
		const formData = new FormData();
		formData.append("file", archivo);
		formData.append("lang", lang);

		const respuesta = await fetch(
			"https://api-ocr-g2g4.onrender.com/ocr/documento_completo",
			{
				method: "POST",
				body: formData
			}
		);

		if (!respuesta.ok) {
			throw new Error("Error al procesar el documento con OCR");
		}

		return (await respuesta.json()) as OcrDocumentoCompletoRespuesta;
	}
}

