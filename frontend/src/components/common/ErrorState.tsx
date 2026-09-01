import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Erro ao carregar dados',
  message = 'Ocorreu um problema ao comunicar-se com a API. Verifique sua conexão ou tente novamente.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-50/50 rounded-xl border border-rose-200">
      <div className="p-3 bg-rose-100 text-rose-600 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />}>
          Tentar Novamente
        </Button>
      )}
    </div>
  );
};
