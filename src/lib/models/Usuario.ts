export type RolNombre = "ORIENTADOR" | "CONTROL_ESCOLAR" | "DIRECCION" | "SUBDIRECCION";

export interface UsuarioDTO {
	id: string;
	nombre: string | null;
	apellidos: string | null;
	roles: RolNombre[];
}

export class Usuario {
	id: string;
	nombre: string | null;
	apellidos: string | null;
	roles: RolNombre[];

	constructor(dto: UsuarioDTO) {
		this.id = dto.id;
		this.nombre = dto.nombre;
		this.apellidos = dto.apellidos;
		this.roles = dto.roles;
	}

	tieneRol(rol: RolNombre): boolean {
		return this.roles.includes(rol);
	}

	getNombreMostrado(): string {
		if (this.nombre || this.apellidos) {
			return `${this.nombre ?? ""} ${this.apellidos ?? ""}`.trim();
		}
		return "Usuario";
	}
}

