import { AlertTriangle, Info, XCircle } from 'lucide-react';

export function WarningBanner({ message, type = 'warning' }: { message: string, type?: 'warning'|'error'|'info' }) {
  const styles = {
    warning: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30',
    error: 'bg-red-500/15 text-red-600 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-600 border-blue-500/30'
  };

  const Icon = type === 'error' ? XCircle : type === 'info' ? Info : AlertTriangle;

  return (
    <div className={`p-4 rounded-md border flex items-start gap-3 mt-4 ${styles[type]}`}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="text-sm font-medium leading-relaxed">{message}</div>
    </div>
  );
}
