import { getSupabaseClient } from "@/lib/services/SupabaseClientFactory";
import { Expediente, ExpedienteDTO } from "@/lib/models/Expediente";

export class ExpedienteService {
	static async buscarPorMatricula(matricula: string): Promise<Expediente | null> {
		const client = getSupabaseClient();
		const { data, error } = await client
			.from("expedientes")
			.select("*")
			.eq("matricula", matricula)
			.single();

		if (error && error.code !== "PGRST116") {
			throw error;
		}

		if (!data) {
			return null;
		}

		return new Expediente(data as ExpedienteDTO);
	}

	static async listarPorOrientador(
		orientadorId: string,
		limit = 20
	): Promise<Expediente[]> {
		const client = getSupabaseClient();
		const { data, error } = await client
			.from("expedientes")
			.select("*")
			.eq("id_orientador", orientadorId)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			throw error;
		}

		return (data as ExpedienteDTO[]).map((row) => new Expediente(row));
	}
}

