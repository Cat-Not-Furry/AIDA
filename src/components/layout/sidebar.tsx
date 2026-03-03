import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// removed module import; using tailwind classes directly
import { useAuth } from "@/context/AuthContext";

import {
  HomeIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  ClockIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Dashboard", href: "/", icon: <HomeIcon className="w-5 h-5" /> },
  { name: "Alumnos", href: "/alumnos", icon: <UserGroupIcon className="w-5 h-5" /> },
  { name: "Plantillas", href: "/plantillas", icon: <DocumentDuplicateIcon className="w-5 h-5" /> },
  { name: "Documentos", href: "/documentos", icon: <DocumentTextIcon className="w-5 h-5" /> },
  { name: "Historial", href: "/historial", icon: <ClockIcon className="w-5 h-5" /> },
  { name: "Ajustes", href: "/ajustes", icon: <Cog6ToothIcon className="w-5 h-5" /> },
];

function UserInfo() {
  const { user } = useAuth();
  return (
    <>
      <p className="font-semibold dark:text-white">{user?.email || "Usuario"}</p>
      <span className="text-xs text-muted">Orientadora</span>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white/95 backdrop-blur-md rounded-r-4xl shadow-lg p-8 dark:bg-gray-900/90 dark:shadow-xl">
      <div className="mb-10 flex items-center gap-3">
        <Image src="/images/logo1.png" alt="AIDA" width={40} height={40} />
        <span className="font-bold text-primary dark:text-info text-xl tracking-wide">A.I.D.A.</span>
      </div>

      <nav className="flex flex-col gap-3 text-base">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-colors ${active ? 'bg-primary/20 text-primary dark:bg-info/20 dark:text-info' : ''}`}
          >
            {item.icon && <span className="text-gray-500">{item.icon}</span>}
            {item.name}
          </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
        {/* show user info from auth context */}
        <UserInfo />
      </div>
    </aside>
  );
}
