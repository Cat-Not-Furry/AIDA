import { getSupabaseClient } from "@/lib/services/SupabaseClientFactory";
import { Plantilla, PlantillaDTO } from "@/lib/models/Plantilla";

export class PlantillaService {
	static async listarActivas(): Promise<Plantilla[]> {
		const client = getSupabaseClient();
		const { data, error } = await client
			.from("plantillas")
			.select("*")
			.eq("activa", true)
			.order("created_at", { ascending: false });

		if (error) {
			throw error;
		}

		return (data as PlantillaDTO[]).map((row) => new Plantilla(row));
	}
}

