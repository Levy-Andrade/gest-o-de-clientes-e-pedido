import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardMetrics } from '../types/dashboard';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import { Badge } from '../components/common/Badge';

interface DashboardProps {
  onNavigateToPedidos: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToPedidos }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Falha ao carregar indicadores do dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading) {
    return <Spinner size="xl" label="Carregando painel de métricas e vendas..." />;
  }

  if (error || !metrics) {
    return <ErrorState message={error || undefined} onRetry={fetchMetrics} />;
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Concluido': return 'success';
      case 'Enviado': return 'info';
      case 'Processando': return 'purple';
      case 'Pendente': return 'warning';
      case 'Cancelado': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold text-blue-100 mb-2 backdrop-blur-xs">
            <TrendingUp className="w-3.5 h-3.5" /> Métricas em Tempo Real
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Visão Geral de Desempenho</h2>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Acompanhe o faturamento, volume de pedidos, produtos com estoque crítico e os clientes mais ativos da sua operação.
          </p>
        </div>

        <button
          onClick={onNavigateToPedidos}
          className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-sm self-start md:self-auto"
        >
          Ver Todos os Pedidos <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Faturamento Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Faturamento Total</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(metrics.totalFaturamento)}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span className="font-bold">{formatCurrency(metrics.faturamentoMesAtual)}</span> este mês
            </p>
          </div>
        </div>

        {/* Card 2: Total Pedidos */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total de Pedidos</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{metrics.totalPedidos}</h3>
            <p className="text-xs text-blue-600 font-medium mt-1">
              <span className="font-bold">{metrics.pedidosMesAtual}</span> novos no mês vigente
            </p>
          </div>
        </div>

        {/* Card 3: Clientes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Clientes Ativos</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{metrics.clientesAtivos} <span className="text-sm font-normal text-slate-400">/ {metrics.totalClientes}</span></h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {metrics.totalClientes > 0 ? `${Math.round((metrics.clientesAtivos / metrics.totalClientes) * 100)}% de taxa ativa` : 'Nenhum cliente'}
            </p>
          </div>
        </div>

        {/* Card 4: Estoque Crítico */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estoque Crítico</span>
            <div className={`p-2.5 rounded-xl ${metrics.produtosEstoqueCritico > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-black ${metrics.produtosEstoqueCritico > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {metrics.produtosEstoqueCritico}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Produtos com menos de 5 unidades
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Vendas dos Últimos Meses + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Histórico de Vendas Mensal */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-900">Histórico de Faturamento (Últimos 6 Meses)</h4>
              <p className="text-xs text-slate-500">Evolução de vendas faturadas</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>

          <div className="space-y-4">
            {metrics.historicoVendas.map((item, idx) => {
              const maxVal = Math.max(...metrics.historicoVendas.map(h => h.total), 1);
              const percentage = Math.round((item.total / maxVal) * 100);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 font-semibold">{item.mes}</span>
                    <span className="text-slate-900 font-bold">{formatCurrency(item.total)} <span className="text-slate-400 font-normal">({item.quantidadePedidos} pedidos)</span></span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuição por Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Status dos Pedidos</h4>
            <p className="text-xs text-slate-500 mb-6">Distribuição geral da carteira</p>

            <div className="space-y-3">
              {metrics.pedidosPorStatus.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                    <span className="text-xs font-bold text-slate-700">{item.quantidade} un.</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">{formatCurrency(item.valorTotal)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
            <span>Volume Total Gerenciado</span>
            <span className="font-bold text-slate-900">{metrics.totalPedidos} Pedidos</span>
          </div>
        </div>
      </div>

      {/* Row 3: Top Clientes & Últimos Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clientes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Top Clientes por Faturamento</h4>
              <p className="text-xs text-slate-500">Clientes com maior volume de compras</p>
            </div>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>

          {metrics.topClientes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Nenhum dado registrado.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {metrics.topClientes.map((c, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{c.nome}</p>
                      <p className="text-xs text-slate-400">{c.email} • {c.quantidadePedidos} compras</p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{formatCurrency(c.totalGasto)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimos Pedidos */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Últimos Pedidos Realizados</h4>
              <p className="text-xs text-slate-500">Movimentações mais recentes</p>
            </div>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>

          {metrics.ultimosPedidos.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Nenhum pedido realizado.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {metrics.ultimosPedidos.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600">#PED-{p.id}</span>
                      <Badge variant={getStatusBadgeVariant(p.status)} size="sm">{p.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{p.clienteNome} • {new Date(p.dataPedido).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(p.valorTotal)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
