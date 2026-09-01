import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  LogOut,
  Building2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onToggle,
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'clientes', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { id: 'produtos', label: 'Produtos', icon: <Package className="w-5 h-5" /> },
    { id: 'pedidos', label: 'Pedidos', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Backdrop para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-slate-900 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-slate-800',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 bg-slate-950/40">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white uppercase">Gestão Pro</h1>
            <p className="text-[10px] text-blue-400 font-medium tracking-wider">CLIENTES & PEDIDOS</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Menu Principal
          </p>
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={clsx(
                  'w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                )}
              >
                <div className={clsx(isActive ? 'text-white' : 'text-slate-400')}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-800/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30 flex-shrink-0">
                {user?.nome ? user.nome.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.nome || 'Usuário'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sair do Sistema"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
