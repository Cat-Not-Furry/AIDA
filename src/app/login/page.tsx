"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    }
  }

  // redirect if already logged in
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button className="btn-primary py-3 rounded-full mt-2">
          {isRegister ? "Registrarme" : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-secondary">
        {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-primary font-medium hover:underline"
        >
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </button>
      </p>
    </div>
  );
}
