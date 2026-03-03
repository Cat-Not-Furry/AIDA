import "../globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Login | AIDA",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="bg-[#EFF6FF] dark:bg-gray-950 transition-colors flex items-center justify-center min-h-screen w-full">
        {children}
      </div>
    </ThemeProvider>
  );
}
