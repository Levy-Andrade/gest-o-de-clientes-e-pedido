export type StatusPedido = 'Pendente' | 'Processando' | 'Enviado' | 'Concluido' | 'Cancelado';

export interface PedidoItem {
  id: number;
  produtoId: number;
  produtoNome: string;
  produtoSku: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  clienteDocumento: string;
  dataPedido: string;
  status: StatusPedido;
  statusDescricao: string;
  valorTotal: number;
  desconto: number;
  observacoes?: string;
  itens: PedidoItem[];
}

export interface CreatePedidoItemRequest {
  produtoId: number;
  quantidade: number;
}

export interface CreatePedidoRequest {
  clienteId: number;
  desconto: number;
  observacoes?: string;
  itens: CreatePedidoItemRequest[];
}

export interface UpdatePedidoStatusRequest {
  status: StatusPedido;
}
