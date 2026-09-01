import type { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../types/cliente';
import type { Produto, CreateProdutoRequest, UpdateProdutoRequest } from '../types/produto';
import type { Pedido, CreatePedidoRequest, StatusPedido } from '../types/pedido';
import type { DashboardMetrics } from '../types/dashboard';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

// Seed Inicial
const SEED_CLIENTES: Cliente[] = [
  {
    id: 1,
    nome: 'TechCorp Soluções Tecnológicas',
    email: 'contato@techcorp.com.br',
    documento: '12.345.678/0001-90',
    telefone: '(11) 98765-4321',
    endereco: 'Av. Paulista, 1000 - Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    totalPedidos: 2,
  },
  {
    id: 2,
    nome: 'Alpha Distribuidora Ltda',
    email: 'compras@alphadistribuidora.com.br',
    documento: '98.765.432/0001-10',
    telefone: '(21) 97654-3210',
    endereco: 'Rua do Ouvidor, 50 - Centro',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cep: '20040-030',
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    totalPedidos: 1,
  },
  {
    id: 3,
    nome: 'Mariana Oliveira Silva',
    email: 'mariana.silva@gmail.com',
    documento: '123.456.789-00',
    telefone: '(31) 99123-4567',
    endereco: 'Rua das Flores, 245 - Savassi',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cep: '30140-000',
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    totalPedidos: 1,
  },
  {
    id: 4,
    nome: 'Lucas Pereira Santos',
    email: 'lucas.santos@outlook.com',
    documento: '321.654.987-11',
    telefone: '(41) 98877-6655',
    endereco: 'Av. Sete de Setembro, 3200 - Batel',
    cidade: 'Curitiba',
    estado: 'PR',
    cep: '80240-000',
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    totalPedidos: 0,
  }
];

const SEED_PRODUTOS: Produto[] = [
  {
    id: 1,
    nome: 'Notebook Dell Inspiron 15',
    descricao: "Processador Intel Core i7 16GB RAM 512GB SSD Tela 15.6' FHD",
    sku: 'NOT-DELL-I15',
    preco: 4599.90,
    estoque: 25,
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: 2,
    nome: "Monitor LG UltraWide 29''",
    descricao: 'Monitor IPS Full HD UltraWide 29WL500 com HDR10',
    sku: 'MON-LG-29UW',
    preco: 1299.00,
    estoque: 15,
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: 3,
    nome: 'Teclado Mecânico RGB Wireless',
    descricao: 'Teclado mecânico switch brown, layout ABNT2 e conectividade Bluetooth',
    sku: 'TEC-MEC-RGB',
    preco: 389.90,
    estoque: 4, // Crítico (< 5)
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    id: 4,
    nome: 'Mouse Ergonômico MX Master 3S',
    descricao: 'Sensor 8K DPI Darkfield, clique silencioso, scroll eletromagnético',
    sku: 'MOU-MXM-3S',
    preco: 549.00,
    estoque: 3, // Crítico (< 5)
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    id: 5,
    nome: 'Headset Gamer Sem Fio 7.1',
    descricao: 'Áudio surround 7.1 espacial, microfone com cancelamento de ruído',
    sku: 'HEA-GAM-71W',
    preco: 499.99,
    estoque: 2, // Crítico (< 5)
    ativo: true,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  }
];

const SEED_PEDIDOS: Pedido[] = [
  {
    id: 1,
    clienteId: 1,
    clienteNome: 'TechCorp Soluções Tecnológicas',
    clienteEmail: 'contato@techcorp.com.br',
    clienteDocumento: '12.345.678/0001-90',
    dataPedido: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    status: 'Concluido',
    statusDescricao: 'Concluído',
    valorTotal: 11697.80,
    desconto: 100.00,
    observacoes: 'Entrega prioritária no departamento de TI',
    itens: [
      { id: 1, produtoId: 1, produtoNome: 'Notebook Dell Inspiron 15', produtoSku: 'NOT-DELL-I15', quantidade: 2, precoUnitario: 4599.90, subtotal: 9199.80 },
      { id: 2, produtoId: 2, produtoNome: "Monitor LG UltraWide 29''", produtoSku: 'MON-LG-29UW', quantidade: 2, precoUnitario: 1299.00, subtotal: 2598.00 }
    ]
  },
  {
    id: 2,
    clienteId: 2,
    clienteNome: 'Alpha Distribuidora Ltda',
    clienteEmail: 'compras@alphadistribuidora.com.br',
    clienteDocumento: '98.765.432/0001-10',
    dataPedido: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'Enviado',
    statusDescricao: 'Enviado',
    valorTotal: 888.90,
    desconto: 50.00,
    observacoes: 'Faturamento para 30 dias',
    itens: [
      { id: 3, produtoId: 3, produtoNome: 'Teclado Mecânico RGB Wireless', produtoSku: 'TEC-MEC-RGB', quantidade: 1, precoUnitario: 389.90, subtotal: 389.90 },
      { id: 4, produtoId: 4, produtoNome: 'Mouse Ergonômico MX Master 3S', produtoSku: 'MOU-MXM-3S', quantidade: 1, precoUnitario: 549.00, subtotal: 549.00 }
    ]
  },
  {
    id: 3,
    clienteId: 3,
    clienteNome: 'Mariana Oliveira Silva',
    clienteEmail: 'mariana.silva@gmail.com',
    clienteDocumento: '123.456.789-00',
    dataPedido: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: 'Pendente',
    statusDescricao: 'Pendente',
    valorTotal: 999.98,
    desconto: 0,
    observacoes: 'Aguardando confirmação de pagamento PIX',
    itens: [
      { id: 5, produtoId: 5, produtoNome: 'Headset Gamer Sem Fio 7.1', produtoSku: 'HEA-GAM-71W', quantidade: 2, precoUnitario: 499.99, subtotal: 999.98 }
    ]
  }
];

class MockDatabase {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`gestao_mock_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`gestao_mock_${key}`, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  }

  private init() {
    if (!localStorage.getItem('gestao_mock_initialized')) {
      this.setStorage('clientes', SEED_CLIENTES);
      this.setStorage('produtos', SEED_PRODUTOS);
      this.setStorage('pedidos', SEED_PEDIDOS);
      localStorage.setItem('gestao_mock_initialized', 'true');
    }
  }

  constructor() {
    this.init();
  }

  // AUTH
  async login(creds: LoginRequest): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 200));
    return {
      token: 'demo-jwt-token-guest',
      expiraEm: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      usuario: {
        id: 1,
        nome: creds.email.split('@')[0] || 'Usuário Demo',
        email: creds.email,
        perfil: 'Administrador',
      },
    };
  }

  async register(req: RegisterRequest): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 200));
    return {
      token: 'demo-jwt-token-guest',
      expiraEm: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      usuario: {
        id: 99,
        nome: req.nome,
        email: req.email,
        perfil: 'Administrador',
      },
    };
  }

  // CLIENTES
  async getClientes(search?: string, page = 1, pageSize = 10) {
    this.init();
    let list: Cliente[] = this.getStorage('clientes', SEED_CLIENTES);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c => c.nome.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.documento.includes(s));
    }
    const totalCount = list.length;
    const items = list.slice((page - 1) * pageSize, page * pageSize);
    return {
      items,
      pageNumber: page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / pageSize),
    };
  }

  async createCliente(data: CreateClienteRequest): Promise<Cliente> {
    const list: Cliente[] = this.getStorage('clientes', SEED_CLIENTES);
    const newId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
    const novo: Cliente = {
      ...data,
      id: newId,
      criadoEm: new Date().toISOString(),
      totalPedidos: 0,
      endereco: data.endereco || '',
      cidade: data.cidade || '',
      estado: data.estado || '',
      cep: data.cep || '',
    };
    list.unshift(novo);
    this.setStorage('clientes', list);
    return novo;
  }

  async updateCliente(id: number, data: UpdateClienteRequest): Promise<Cliente> {
    const list: Cliente[] = this.getStorage('clientes', SEED_CLIENTES);
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Cliente não encontrado.');
    list[idx] = { ...list[idx], ...data };
    this.setStorage('clientes', list);
    return list[idx];
  }

  async deleteCliente(id: number): Promise<void> {
    const list: Cliente[] = this.getStorage('clientes', SEED_CLIENTES);
    const pedidos: Pedido[] = this.getStorage('pedidos', SEED_PEDIDOS);
    if (pedidos.some(p => p.clienteId === id)) {
      throw new Error('Não é possível excluir um cliente com pedidos vinculados.');
    }
    const filtered = list.filter(c => c.id !== id);
    this.setStorage('clientes', filtered);
  }

  // PRODUTOS
  async getProdutos(search?: string, page = 1, pageSize = 10) {
    this.init();
    let list: Produto[] = this.getStorage('produtos', SEED_PRODUTOS);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => p.nome.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
    }
    const totalCount = list.length;
    const items = list.slice((page - 1) * pageSize, page * pageSize);
    return {
      items,
      pageNumber: page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / pageSize),
    };
  }

  async createProduto(data: CreateProdutoRequest): Promise<Produto> {
    const list: Produto[] = this.getStorage('produtos', SEED_PRODUTOS);
    const newId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const novo: Produto = {
      ...data,
      id: newId,
      criadoEm: new Date().toISOString(),
      descricao: data.descricao || '',
    };
    list.unshift(novo);
    this.setStorage('produtos', list);
    return novo;
  }

  async updateProduto(id: number, data: UpdateProdutoRequest): Promise<Produto> {
    const list: Produto[] = this.getStorage('produtos', SEED_PRODUTOS);
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Produto não encontrado.');
    list[idx] = { ...list[idx], ...data };
    this.setStorage('produtos', list);
    return list[idx];
  }

  async deleteProduto(id: number): Promise<void> {
    const list: Produto[] = this.getStorage('produtos', SEED_PRODUTOS);
    this.setStorage('produtos', list.filter(p => p.id !== id));
  }

  // PEDIDOS
  async getPedidos(search?: string, status?: StatusPedido, page = 1, pageSize = 10) {
    this.init();
    let list: Pedido[] = this.getStorage('pedidos', SEED_PEDIDOS);
    if (status) {
      list = list.filter(p => p.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => p.clienteNome.toLowerCase().includes(s) || p.clienteDocumento.includes(s));
    }
    const totalCount = list.length;
    const items = list.slice((page - 1) * pageSize, page * pageSize);
    return {
      items,
      pageNumber: page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / pageSize),
    };
  }

  async createPedido(data: CreatePedidoRequest): Promise<Pedido> {
    const clientes: Cliente[] = this.getStorage('clientes', SEED_CLIENTES);
    const produtos: Produto[] = this.getStorage('produtos', SEED_PRODUTOS);
    const pedidos: Pedido[] = this.getStorage('pedidos', SEED_PEDIDOS);

    const cliente = clientes.find(c => c.id === data.clienteId);
    if (!cliente) throw new Error('Cliente não encontrado.');

    // Verificar estoque e montar itens
    let subtotal = 0;
    const itens = data.itens.map((item, idx) => {
      const prod = produtos.find(p => p.id === item.produtoId);
      if (!prod) throw new Error('Produto não encontrado.');
      if (prod.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${prod.nome}. Disponível: ${prod.estoque}.`);
      }
      // Deduz estoque
      prod.estoque -= item.quantidade;
      const itemSubtotal = prod.preco * item.quantidade;
      subtotal += itemSubtotal;
      return {
        id: idx + 1,
        produtoId: prod.id,
        produtoNome: prod.nome,
        produtoSku: prod.sku,
        quantidade: item.quantidade,
        precoUnitario: prod.preco,
        subtotal: itemSubtotal,
      };
    });

    const valorTotal = Math.max(0, subtotal - (data.desconto || 0));
    const newId = pedidos.length ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;

    const novoPedido: Pedido = {
      id: newId,
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      clienteEmail: cliente.email,
      clienteDocumento: cliente.documento,
      dataPedido: new Date().toISOString(),
      status: 'Pendente',
      statusDescricao: 'Pendente',
      valorTotal,
      desconto: data.desconto || 0,
      observacoes: data.observacoes,
      itens,
    };

    cliente.totalPedidos = (cliente.totalPedidos || 0) + 1;

    pedidos.unshift(novoPedido);
    this.setStorage('pedidos', pedidos);
    this.setStorage('produtos', produtos);
    this.setStorage('clientes', clientes);

    return novoPedido;
  }

  async updatePedidoStatus(id: number, status: StatusPedido): Promise<Pedido> {
    const pedidos: Pedido[] = this.getStorage('pedidos', SEED_PEDIDOS);
    const produtos: Produto[] = this.getStorage('produtos', SEED_PRODUTOS);
    const idx = pedidos.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Pedido não encontrado.');

    const pedido = pedidos[idx];
    if (pedido.status === 'Cancelado') throw new Error('Pedido já cancelado.');

    // Se cancelar, estorna estoque
    if (status === 'Cancelado') {
      for (const item of pedido.itens) {
        const prod = produtos.find(p => p.id === item.produtoId);
        if (prod) prod.estoque += item.quantidade;
      }
      this.setStorage('produtos', produtos);
    }

    pedido.status = status;
    pedido.statusDescricao = status;
    this.setStorage('pedidos', pedidos);
    return pedido;
  }

  async cancelPedido(id: number): Promise<void> {
    await this.updatePedidoStatus(id, 'Cancelado');
  }

  // DASHBOARD
  async getMetrics(): Promise<DashboardMetrics> {
    this.init();
    const clientes: Cliente[] = this.getStorage('clientes', SEED_CLIENTES);
    const produtos: Produto[] = this.getStorage('produtos', SEED_PRODUTOS);
    const pedidos: Pedido[] = this.getStorage('pedidos', SEED_PEDIDOS);

    const pedidosValidos = pedidos.filter(p => p.status !== 'Cancelado');
    const totalFaturamento = pedidosValidos.reduce((acc, p) => acc + p.valorTotal, 0);

    return {
      totalFaturamento,
      faturamentoMesAtual: totalFaturamento * 0.45,
      totalPedidos: pedidos.length,
      pedidosMesAtual: pedidos.length,
      totalClientes: clientes.length,
      clientesAtivos: clientes.filter(c => c.ativo).length,
      produtosCadastrados: produtos.length,
      produtosEstoqueCritico: produtos.filter(p => p.estoque < 5).length,
      historicoVendas: [
        { mes: 'Mar/26', total: 4200, quantidadePedidos: 3 },
        { mes: 'Abr/26', total: 5800, quantidadePedidos: 4 },
        { mes: 'Mai/26', total: 7200, quantidadePedidos: 5 },
        { mes: 'Jun/26', total: 9100, quantidadePedidos: 6 },
        { mes: 'Jul/26', total: 11400, quantidadePedidos: 7 },
        { mes: 'Ago/26', total: totalFaturamento || 13586.68, quantidadePedidos: pedidos.length },
      ],
      pedidosPorStatus: [
        { status: 'Pendente', quantidade: pedidos.filter(p => p.status === 'Pendente').length, valorTotal: pedidos.filter(p => p.status === 'Pendente').reduce((a, b) => a + b.valorTotal, 0) },
        { status: 'Processando', quantidade: pedidos.filter(p => p.status === 'Processando').length, valorTotal: pedidos.filter(p => p.status === 'Processando').reduce((a, b) => a + b.valorTotal, 0) },
        { status: 'Enviado', quantidade: pedidos.filter(p => p.status === 'Enviado').length, valorTotal: pedidos.filter(p => p.status === 'Enviado').reduce((a, b) => a + b.valorTotal, 0) },
        { status: 'Concluido', quantidade: pedidos.filter(p => p.status === 'Concluido').length, valorTotal: pedidos.filter(p => p.status === 'Concluido').reduce((a, b) => a + b.valorTotal, 0) },
        { status: 'Cancelado', quantidade: pedidos.filter(p => p.status === 'Cancelado').length, valorTotal: pedidos.filter(p => p.status === 'Cancelado').reduce((a, b) => a + b.valorTotal, 0) },
      ],
      topClientes: clientes.slice(0, 5).map(c => ({
        clienteId: c.id,
        nome: c.nome,
        email: c.email,
        quantidadePedidos: c.totalPedidos || 1,
        totalGasto: (c.totalPedidos || 1) * 3500,
      })),
      ultimosPedidos: pedidos.slice(0, 5),
    };
  }
}

export const mockDb = new MockDatabase();
