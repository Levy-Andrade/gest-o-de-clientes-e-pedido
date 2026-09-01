import React from 'react';
import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  label = 'Carregando informações...',
}) => {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={clsx(
          'animate-spin rounded-full border-solid border-blue-600 border-t-transparent',
          sizeMap[size],
          className
        )}
      />
      {label && <p className="text-sm font-medium text-slate-500 animate-pulse">{label}</p>}
    </div>
  );
};
