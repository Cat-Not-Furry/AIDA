"use client";

// tailwind classes used inline, module file no longer needed
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white/90 backdrop-blur-md px-8 py-5 shadow-md dark:bg-gray-900/90 dark:shadow-lg">
      <h1 className="font-bold text-lg text-primary dark:text-info">
        AIDA – Orientación Educativa
      </h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar"
          className="hidden md:block bg-gray-100/60 rounded-2xl px-5 py-3 text-sm outline-none dark:bg-gray-800/60 dark:text-white placeholder:text-secondary"
        />
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          aria-label="Cambiar tema"
        >
          {theme === "light" ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.828-2.829a1 1 0 00-1.414 1.414l2.828 2.829a1 1 0 001.414-1.414zM2.05 5.464a1 1 0 00-1.414 1.414l2.828 2.829a1 1 0 101.414-1.414L2.05 5.464zm9.9 9.9a1 1 0 00-1.414 1.414l2.828 2.829a1 1 0 101.414-1.414l-2.828-2.829zM2.05 14.536a1 1 0 101.414 1.414l2.828-2.829a1 1 0 00-1.414-1.414L2.05 14.536zM15.5 1a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1zM4.5 19a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM19 10.5a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM2 10.5a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
        {user && (
          <button
            onClick={() => {
              signOut();
              // redirect handled by middleware or manually
              window.location.href = "/login";
            }}
            className="ml-2 text-sm text-red-500 hover:underline"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
}
