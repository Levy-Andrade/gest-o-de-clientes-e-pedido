export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  sku: string;
  preco: number;
  estoque: number;
  ativo: boolean;
  criadoEm: string;
}

export interface CreateProdutoRequest {
  nome: string;
  descricao?: string;
  sku: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}

export interface UpdateProdutoRequest extends CreateProdutoRequest {}
