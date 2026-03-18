export interface DocumentoDTO {
	id: string;
	id_expediente: string;
	tipo_documento: string;
	titulo: string | null;
	descripcion: string | null;
	fecha_documento: string | null;
	ruta_storage: string;
	metadata_ocr: any | null;
	created_at: string;
	updated_at: string;
}

export class Documento {
	id: string;
	idExpediente: string;
	tipoDocumento: string;
	titulo: string | null;
	descripcion: string | null;
	fechaDocumento: Date | null;
	rutaStorage: string;
	metadataOcr: any | null;
	createdAt: Date;
	updatedAt: Date;

	constructor(dto: DocumentoDTO) {
		this.id = dto.id;
		this.idExpediente = dto.id_expediente;
		this.tipoDocumento = dto.tipo_documento;
		this.titulo = dto.titulo;
		this.descripcion = dto.descripcion;
		this.fechaDocumento = dto.fecha_documento ? new Date(dto.fecha_documento) : null;
		this.rutaStorage = dto.ruta_storage;
		this.metadataOcr = dto.metadata_ocr;
		this.createdAt = new Date(dto.created_at);
		this.updatedAt = new Date(dto.updated_at);
	}
}

