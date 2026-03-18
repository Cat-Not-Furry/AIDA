import { getSupabaseClient } from "@/lib/services/SupabaseClientFactory";

export interface AuditoriaEntrada {
	id_usuario: string | null;
	accion: string;
	entidad: string;
	entidad_id?: string;
	detalle?: Record<string, unknown>;
}

export class AuditoriaService {
	static async registrarAccion(entrada: AuditoriaEntrada): Promise<void> {
		const client = getSupabaseClient();

		const payload = {
			id_usuario: entrada.id_usuario ?? null,
			accion: entrada.accion,
			entidad: entrada.entidad,
			entidad_id: entrada.entidad_id ?? null,
			detalle: entrada.detalle ?? null
		};

		const { error } = await client.from("auditoria").insert(payload);

		if (error) {
			// No interrumpir el flujo principal por error de auditoría
			console.error("Error registrando auditoría", error);
		}
	}
}

