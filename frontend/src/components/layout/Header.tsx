import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Perfil: <strong className="text-slate-800">{user?.perfil || 'Operador'}</strong></span>
        </div>
      </div>
    </header>
  );
};
