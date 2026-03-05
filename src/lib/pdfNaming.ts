import type { OcrResponse } from "@/types/ocr";

function normalizeText(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

function firstRelevantLine(text: string): string {
	const lines = text
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);
	return lines[0] ?? "";
}

function toIsoDate(value: string): string {
	const isoPattern = /\b\d{4}-\d{2}-\d{2}\b/;
	const isoMatch = value.match(isoPattern);
	if (isoMatch) {
		return isoMatch[0];
	}

	const dayMonthYearPattern = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/;
	const dayMonthYearMatch = value.match(dayMonthYearPattern);
	if (dayMonthYearMatch) {
		const day = dayMonthYearMatch[1].padStart(2, "0");
		const month = dayMonthYearMatch[2].padStart(2, "0");
		const year = dayMonthYearMatch[3];
		return `${year}-${month}-${day}`;
	}

	return "";
}

function fallbackTimestamp(): string {
	return new Date().toISOString().replace(/[:.]/g, "-");
}

export function buildPdfFileName(data: OcrResponse): string {
	const rawTitle = firstRelevantLine(data.texto_completo) || data.filename || "documento";
	const title = normalizeText(rawTitle).slice(0, 60) || "documento";
	const firstDate = data.texto_estructurado.fechas[0] ?? "";
	const dateKey = toIsoDate(firstDate) || fallbackTimestamp().slice(0, 10);
	const fallbackKey = `documento-${fallbackTimestamp().slice(0, 19)}`;

	return `${title}_${dateKey}_${fallbackKey}.pdf`;
}
