export interface Cliente {
  id: number;
  nome: string;
  email: string;
  documento: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  criadoEm: string;
  totalPedidos: number;
}

export interface CreateClienteRequest {
  nome: string;
  email: string;
  documento: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  ativo: boolean;
}

export interface UpdateClienteRequest extends CreateClienteRequest {}
