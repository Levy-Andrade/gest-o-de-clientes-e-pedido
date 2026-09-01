import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/Clientes';
import { Produtos } from './pages/Produtos';
import { Pedidos } from './pages/Pedidos';
import { Spinner } from './components/common/Spinner';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'clientes' | 'produtos' | 'pedidos'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="xl" label="Inicializando ambiente seguro..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <Login onNavigateToRegister={() => setAuthView('register')} />;
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Painel de Indicadores (Dashboard)';
      case 'clientes': return 'Gerenciamento de Clientes';
      case 'produtos': return 'Catálogo e Estoque de Produtos';
      case 'pedidos': return 'Gestão de Vendas & Pedidos';
      default: return 'Sistema de Gestão';
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page as any)}
      pageTitle={getPageTitle()}
    >
      {currentPage === 'dashboard' && <Dashboard onNavigateToPedidos={() => setCurrentPage('pedidos')} />}
      {currentPage === 'clientes' && <Clientes />}
      {currentPage === 'produtos' && <Produtos />}
      {currentPage === 'pedidos' && <Pedidos />}
    </Layout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
