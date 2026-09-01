import React, { useState } from 'react';
import { Building2, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

interface LoginProps {
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@gestao.com');
  const [senha, setSenha] = useState('Admin@123456');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, senha });
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || err.message || 'Erro ao realizar login. Verifique suas credenciais.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Decorator */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30 mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestão de Clientes & Pedidos</h1>
          <p className="text-sm text-slate-400 mt-1">Acesse sua conta para gerenciar seu negócio</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-mail</label>
            <Input
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Senha</label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 shadow-lg shadow-blue-600/30"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar no Sistema
            </Button>
          </div>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-6 p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">🔑 Credenciais de Demonstração:</p>
          <p>Admin: <code className="text-blue-400">admin@gestao.com</code> | <code className="text-blue-400">Admin@123456</code></p>
          <p>Operador: <code className="text-blue-400">operador@gestao.com</code> | <code className="text-blue-400">Operador@123456</code></p>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          Não possui uma conta?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4"
          >
            Cadastre-se gratuitamente
          </button>
        </div>
      </div>
    </div>
  );
};
