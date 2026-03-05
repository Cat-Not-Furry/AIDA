export type DocumentVersionStatus = "draft" | "published";
export type DocumentVersionSource = "ocr" | "manual";
export type DocumentVersionEngine =
	| "tesseract"
	| "google_vision"
	| "openai"
	| "manual";

export interface TemplateRecord {
	id: string;
	name: string;
	description: string | null;
	html_url: string | null;
	created_at: string;
}

export interface DocumentRecord {
	id: string;
	user_id: string;
	template_id: string | null;
	original_filename: string;
	json_data: Record<string, unknown>;
	pdf_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface DocumentVersionRecord {
	id: string;
	document_id: string;
	version_number: number;
	json_data: Record<string, unknown>;
	pdf_url: string;
	status: DocumentVersionStatus;
	source: DocumentVersionSource;
	engine: DocumentVersionEngine;
	fallback_reason: string | null;
	created_at: string;
}
