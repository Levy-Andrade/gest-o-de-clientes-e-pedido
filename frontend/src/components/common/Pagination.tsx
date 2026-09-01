import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-100 text-sm text-slate-600">
      <div>
        Exibindo <span className="font-medium text-slate-900">{startRecord}</span> a{' '}
        <span className="font-medium text-slate-900">{endRecord}</span> de{' '}
        <span className="font-medium text-slate-900">{totalCount}</span> registros
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <span className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Próxima página"
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
