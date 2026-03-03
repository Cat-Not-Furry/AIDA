"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { Suspense } from "react";
import Navbar from "./layout/navbar";
import Sidebar from "./layout/sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

function NavbarWrapper() {
  return <Navbar />;
}

function SidebarWrapper() {
  return <Sidebar />;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Suspense fallback={<div className="w-64 bg-white dark:bg-gray-900" />}>
          <SidebarWrapper />
        </Suspense>
        <div className="flex flex-col flex-1">
          <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-900" />}>
            <NavbarWrapper />
          </Suspense>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
