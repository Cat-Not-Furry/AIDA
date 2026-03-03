import { ReactNode } from "react";
// style handled via Tailwind classes directly

interface CardProps {
  title: string;
  subtitle?: string;
  action?: string;
  icon?: ReactNode;
  onAction?: () => void;
}

export default function Card({ title, subtitle, action, icon, onAction }: CardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-4 dark:bg-gray-800 dark:shadow-xl border border-gray-200">
      {icon && <div className="mb-4 text-primary w-12 h-12">{icon}</div>}
      <h3 className="text-xl font-bold text-primary dark:text-info">{title}</h3>
      {subtitle && <p className="text-sm text-secondary dark:text-muted">{subtitle}</p>}
      {action && (
        <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium bg-primary text-white hover:bg-primary-hover rounded-full px-4 py-2 hover:opacity-90" onClick={onAction}>
          {action} →
        </button>
      )}
    </div>
  );
}
