export type CheckboxState = "marcado" | "no_marcado";

export interface OcrCheckbox {
	pregunta: string;
	respuesta: CheckboxState;
	tipo: string;
	confianza: number;
}

export interface OcrCoordinate {
	texto: string;
	bbox: [number, number, number, number];
	confianza: number;
	linea: number;
	bloque: number;
	parrafo: number;
}

export interface OcrStructuredText {
	texto_limpio: string;
	horarios: string[];
	dias: string[];
	materiales: string[];
	notas: string;
	fechas: string[];
}

export interface OcrMetadata {
	language: string;
	optimizacion: string;
	lineas_detectadas: number;
	correct_spelling: boolean;
}

export interface OcrResponse {
	success: boolean;
	filename: string;
	texto_completo: string;
	texto_estructurado: OcrStructuredText;
	checkboxes: OcrCheckbox[];
	metadata: OcrMetadata;
	coordenadas: OcrCoordinate[];
}

export type OcrRawResponse = Partial<OcrResponse> & {
	text?: string;
	checkboxes?: unknown[];
	coordenadas?: unknown[];
	texto_estructurado?: Partial<OcrStructuredText>;
	metadata?: Partial<OcrMetadata>;
};
