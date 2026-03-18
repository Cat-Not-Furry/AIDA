import { getSupabaseClient } from "@/lib/services/SupabaseClientFactory";
import { Documento, DocumentoDTO } from "@/lib/models/Documento";

export class DocumentoService {
	static async listarPorExpediente(expedienteId: string): Promise<Documento[]> {
		const client = getSupabaseClient();
		const { data, error } = await client
			.from("documentos")
			.select("*")
			.eq("id_expediente", expedienteId)
			.order("created_at", { ascending: false });

		if (error) {
			throw error;
		}

		return (data as DocumentoDTO[]).map((row) => new Documento(row));
	}
}

