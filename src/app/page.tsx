"use client";

import { useEffect, useState } from "react";
import { UserCircleIcon, DocumentDuplicateIcon, DocumentTextIcon, ClockIcon } from "@heroicons/react/24/outline";
import Card from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const displayName = user?.email || "Usuario";

  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-8">
        <section className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl p-8 shadow-xl">
          <div className="h-8 w-64 rounded bg-white/40" />
          <div className="mt-3 h-5 w-48 rounded bg-white/30" />
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div className="h-40 rounded-3xl bg-white dark:bg-gray-900" />
          <div className="h-40 rounded-3xl bg-white dark:bg-gray-900" />
          <div className="h-40 rounded-3xl bg-white dark:bg-gray-900" />
          <div className="h-40 rounded-3xl bg-white dark:bg-gray-900" />
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero / Bienvenida */}
      <section className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
        <div>
          <h2 className="text-3xl font-extrabold text-primary">
            Bienvenid@,
          </h2>
          <h2 className="text-3xl font-extrabold text-primary">
            {displayName}
          </h2>
          <p className="text-secondary mt-2">¿Qué deseas hacer hoy?</p>
        </div>

        <div className="hidden md:block">
          <Image
            src="/images/char1.png"
            alt="AIDA Assistant"
            width={208}
            height={208}
            className="w-52 h-auto"
          />
        </div>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <Card
          icon={<UserCircleIcon />}
          title="Alumnos"
          subtitle="267 becarios"
          action="Consultar historial"
          onAction={() => router.push("/alumnos")}
        />
        <Card
          icon={<DocumentDuplicateIcon />}
          title="Plantillas"
          subtitle="8 plantillas disponibles"
          action="Ver y compartir"
          onAction={() => router.push("/plantillas")}
        />
        <Card
          icon={<DocumentTextIcon />}
          title="Documentos"
          subtitle="124 documentos"
          action="Gestionar archivo"
          onAction={() => router.push("/documentos")}
        />
        <Card
          icon={<ClockIcon />}
          title="Historial"
          subtitle="Actividad reciente"
          action="Ver actividad"
          onAction={() => router.push("/historial")}
        />
      </section>
    </div>
  );
}
