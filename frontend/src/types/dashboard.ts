import type { Pedido } from './pedido';

export interface VendasPorMes {
  mes: string;
  total: number;
  quantidadePedidos: number;
}

export interface StatusContagem {
  status: string;
  quantidade: number;
  valorTotal: number;
}

export interface TopCliente {
  clienteId: number;
  nome: string;
  email: string;
  quantidadePedidos: number;
  totalGasto: number;
}

export interface DashboardMetrics {
  totalFaturamento: number;
  faturamentoMesAtual: number;
  totalPedidos: number;
  pedidosMesAtual: number;
  totalClientes: number;
  clientesAtivos: number;
  produtosCadastrados: number;
  produtosEstoqueCritico: number;
  historicoVendas: VendasPorMes[];
  pedidosPorStatus: StatusContagem[];
  topClientes: TopCliente[];
  ultimosPedidos: Pedido[];
}
