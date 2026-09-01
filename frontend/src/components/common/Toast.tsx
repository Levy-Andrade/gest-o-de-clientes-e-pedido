import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const styles = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/20',
    error: 'bg-rose-600 text-white shadow-rose-500/20',
    info: 'bg-blue-600 text-white shadow-blue-500/20',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={clsx(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/10 transition-all duration-300 transform translate-y-0',
        styles[type]
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium pr-2">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-md transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
