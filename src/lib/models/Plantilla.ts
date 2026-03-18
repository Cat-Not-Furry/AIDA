export interface PlantillaDTO {
	id: string;
	nombre: string;
	descripcion: string | null;
	area: string | null;
	version_actual: number;
	ruta_archivo: string | null;
	activa: boolean;
	created_at: string;
	updated_at: string;
}

export class Plantilla {
	id: string;
	nombre: string;
	descripcion: string | null;
	area: string | null;
	versionActual: number;
	rutaArchivo: string | null;
	activa: boolean;
	createdAt: Date;
	updatedAt: Date;

	constructor(dto: PlantillaDTO) {
		this.id = dto.id;
		this.nombre = dto.nombre;
		this.descripcion = dto.descripcion;
		this.area = dto.area;
		this.versionActual = dto.version_actual;
		this.rutaArchivo = dto.ruta_archivo;
		this.activa = dto.activa;
		this.createdAt = new Date(dto.created_at);
		this.updatedAt = new Date(dto.updated_at);
	}
}

