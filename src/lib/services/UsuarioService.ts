import { getSupabaseClient } from "@/lib/services/SupabaseClientFactory";
import { Usuario, UsuarioDTO, RolNombre } from "@/lib/models/Usuario";

export class UsuarioService {
	static async obtenerPerfilActual(): Promise<Usuario | null> {
		const client = getSupabaseClient();

		const {
			data: { user }
		} = await client.auth.getUser();

		if (!user) {
			return null;
		}

		const { data: perfil, error } = await client
			.from("usuarios")
			.select("id, nombre, apellidos")
			.eq("id", user.id)
			.single();

		if (error && error.code !== "PGRST116") {
			throw error;
		}

		const { data: rolesRaw } = await client
			.from("usuarios_roles")
			.select("roles(nombre)")
			.eq("usuario_id", user.id);

		const roles: RolNombre[] =
			(rolesRaw || [])
				.map((r: any) => r.roles?.nombre)
				.filter(Boolean) ?? [];

		const dto: UsuarioDTO = {
			id: user.id,
			nombre: perfil?.nombre ?? null,
			apellidos: perfil?.apellidos ?? null,
			roles
		};

		return new Usuario(dto);
	}
}

