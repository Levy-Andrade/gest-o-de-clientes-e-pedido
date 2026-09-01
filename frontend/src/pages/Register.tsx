import React, { useState } from 'react';
import { Building2, Mail, Lock, User, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

interface RegisterProps {
  onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (senha !== confirmarSenha) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      await register({ nome, email, senha });
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || 'Erro ao realizar cadastro. Tente novamente.';
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
        <button
          onClick={onNavigateToLogin}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o Login
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30 mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Criar Nova Conta</h1>
          <p className="text-sm text-slate-400 mt-1">Preencha seus dados para acessar o sistema</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nome Completo</label>
            <Input
              type="text"
              required
              placeholder="Ex: Carlos Eduardo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />
          </div>

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
              placeholder="No mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirmar Senha</label>
            <Input
              type="password"
              required
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 shadow-lg shadow-blue-600/30"
              isLoading={isLoading}
            >
              Criar Conta e Acessar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
