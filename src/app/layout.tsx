"use client";

import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-[#F7F9FC] text-gray-800 dark:bg-gray-950 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            {!isSupabaseConfigured && (
              <div className="bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 px-4 py-2 text-sm">
                Supabase no está configurado. Define{" "}
                <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en <code>.env.local</code>.
              </div>
            )}
            {/* hide nav/sidebar on login routes */}
            {pathname.startsWith("/login") ? (
              <main className="p-6 w-full">{children}</main>
            ) : (
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex flex-col flex-1">
                  <Navbar />
                  <main className="p-6">{children}</main>
                </div>
              </div>
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
