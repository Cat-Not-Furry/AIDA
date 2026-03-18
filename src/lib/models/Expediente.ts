export interface ExpedienteDTO {
	id: string;
	matricula: string;
	curp: string | null;
	nombre: string;
	apellidos: string;
	estatus: string;
	id_orientador: string | null;
	created_at: string;
	updated_at: string;
}

export class Expediente {
	id: string;
	matricula: string;
	curp: string | null;
	nombre: string;
	apellidos: string;
	estatus: string;
	idOrientador: string | null;
	createdAt: Date;
	updatedAt: Date;

	constructor(dto: ExpedienteDTO) {
		this.id = dto.id;
		this.matricula = dto.matricula;
		this.curp = dto.curp;
		this.nombre = dto.nombre;
		this.apellidos = dto.apellidos;
		this.estatus = dto.estatus;
		this.idOrientador = dto.id_orientador;
		this.createdAt = new Date(dto.created_at);
		this.updatedAt = new Date(dto.updated_at);
	}

	getNombreCompleto(): string {
		return `${this.nombre} ${this.apellidos}`;
	}

	estaActivo(): boolean {
		return this.estatus === "activo";
	}
}

