"use client";

import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
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
