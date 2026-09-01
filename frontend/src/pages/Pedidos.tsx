import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye, 
  CheckCircle, 
  Truck, 
  Clock, 
  XCircle, 
  Package, 
  Minus 
} from 'lucide-react';
import { pedidoService } from '../services/pedidoService';
import { clienteService } from '../services/clienteService';
import { produtoService } from '../services/produtoService';
import type { Pedido, StatusPedido, CreatePedidoRequest } from '../types/pedido';
import type { Cliente } from '../types/cliente';
import type { Produto } from '../types/produto';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { Toast } from '../components/common/Toast';
import type { ToastType } from '../components/common/Toast';

export const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusPedido | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aux Data for Order Creation
  const [clientesList, setClientesList] = useState<Cliente[]>([]);
  const [produtosList, setProdutosList] = useState<Produto[]>([]);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number>(0);
  const [selectedProdutoId, setSelectedProdutoId] = useState<number>(0);
  const [itemQuantidade, setItemQuantidade] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<{ produtoId: number; produtoNome: string; sku: string; preco: number; quantidade: number; maxEstoque: number }[]>([]);
  const [desconto, setDesconto] = useState<number>(0);
  const [observacoes, setObservacoes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Details Modal State
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Load Pedidos
  const loadPedidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await pedidoService.getAll(
        {
          pageNumber: currentPage,
          pageSize: 8,
          search: debouncedSearch,
        },
        statusFilter
      );
      setPedidos(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Falha ao carregar lista de pedidos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [currentPage, debouncedSearch, statusFilter]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getStatusBadgeVariant = (status: StatusPedido) => {
    switch (status) {
      case 'Concluido': return 'success';
      case 'Enviado': return 'info';
      case 'Processando': return 'purple';
      case 'Pendente': return 'warning';
      case 'Cancelado': return 'danger';
      default: return 'default';
    }
  };

  // Open Create Modal and fetch active clients/products
  const handleOpenCreateModal = async () => {
    setCreateError(null);
    setSelectedClienteId(0);
    setSelectedProdutoId(0);
    setItemQuantidade(1);
    setOrderItems([]);
    setDesconto(0);
    setObservacoes('');

    try {
      const [clientesRes, produtosRes] = await Promise.all([
        clienteService.getAll({ pageNumber: 1, pageSize: 50 }),
        produtoService.getAll({ pageNumber: 1, pageSize: 50 }),
      ]);
      setClientesList(clientesRes.items.filter(c => c.ativo));
      setProdutosList(produtosRes.items.filter(p => p.ativo && p.estoque > 0));
      setIsCreateModalOpen(true);
    } catch (err) {
      showToast('Erro ao carregar dados de apoio para novo pedido.', 'error');
    }
  };

  const handleAddItemToOrder = () => {
    if (!selectedProdutoId) return;

    const prod = produtosList.find(p => p.id === selectedProdutoId);
    if (!prod) return;

    if (itemQuantidade <= 0) {
      setCreateError('A quantidade deve ser de no mínimo 1 unidade.');
      return;
    }

    if (itemQuantidade > prod.estoque) {
      setCreateError(`Estoque insuficiente para ${prod.nome}. Disponível: ${prod.estoque}.`);
      return;
    }

    const existingIndex = orderItems.findIndex(i => i.produtoId === selectedProdutoId);
    if (existingIndex >= 0) {
      const novaQtd = orderItems[existingIndex].quantidade + itemQuantidade;
      if (novaQtd > prod.estoque) {
        setCreateError(`A quantidade total (${novaQtd}) excede o estoque disponível (${prod.estoque}).`);
        return;
      }
      const updated = [...orderItems];
      updated[existingIndex].quantidade = novaQtd;
      setOrderItems(updated);
    } else {
      setOrderItems([
        ...orderItems,
        {
          produtoId: prod.id,
          produtoNome: prod.nome,
          sku: prod.sku,
          preco: prod.preco,
          quantidade: itemQuantidade,
          maxEstoque: prod.estoque,
        },
      ]);
    }

    setCreateError(null);
    setSelectedProdutoId(0);
    setItemQuantidade(1);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, idx) => idx !== index));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  const calculateTotal = () => {
    const total = calculateSubtotal() - (desconto || 0);
    return total > 0 ? total : 0;
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClienteId) {
      setCreateError('Selecione um cliente para vincular ao pedido.');
      return;
    }

    if (orderItems.length === 0) {
      setCreateError('Adicione pelo menos um produto ao pedido.');
      return;
    }

    setIsSubmitting(true);
    setCreateError(null);

    const payload: CreatePedidoRequest = {
      clienteId: selectedClienteId,
      desconto: desconto || 0,
      observacoes: observacoes.trim() || undefined,
      itens: orderItems.map(i => ({
        produtoId: i.produtoId,
        quantidade: i.quantidade,
      })),
    };

    try {
      await pedidoService.create(payload);
      showToast('Pedido realizado com sucesso!', 'success');
      setIsCreateModalOpen(false);
      loadPedidos();
    } catch (err: any) {
      setCreateError(err.response?.data?.mensagem || 'Erro ao criar pedido. Verifique os dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (pedidoId: number, newStatus: StatusPedido) => {
    try {
      await pedidoService.updateStatus(pedidoId, newStatus);
      showToast(`Status atualizado para "${newStatus}" com sucesso!`, 'success');
      loadPedidos();
      if (selectedPedido && selectedPedido.id === pedidoId) {
        setSelectedPedido({ ...selectedPedido, status: newStatus, statusDescricao: newStatus });
      }
    } catch (err: any) {
      showToast(err.response?.data?.mensagem || 'Não foi possível alterar o status.', 'error');
    }
  };

  const handleCancelOrder = async (pedidoId: number) => {
    if (!window.confirm('Tem certeza que deseja cancelar este pedido? Os itens serão devolvidos ao estoque.')) {
      return;
    }

    try {
      await pedidoService.cancel(pedidoId);
      showToast('Pedido cancelado e itens estornados ao estoque!', 'success');
      loadPedidos();
      setIsDetailsModalOpen(false);
    } catch (err: any) {
      showToast(err.response?.data?.mensagem || 'Erro ao cancelar o pedido.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gestão de Pedidos de Venda</h2>
          <p className="text-xs text-slate-500">Crie, acompanhe o fluxo de status e visualize itens faturados</p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm shadow-blue-500/20"
        >
          Novo Pedido
        </Button>
      </div>

      {/* Filter and Status Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Buscar por cliente, documento ou observação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => { setStatusFilter(undefined); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              statusFilter === undefined
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>
          {(['Pendente', 'Processando', 'Enviado', 'Concluido', 'Cancelado'] as StatusPedido[]).map((st) => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <Spinner size="lg" label="Carregando pedidos de venda..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadPedidos} />
      ) : pedidos.length === 0 ? (
        <EmptyState
          title={search || statusFilter ? 'Nenhum pedido encontrado com esses filtros' : 'Nenhum pedido cadastrado'}
          description={search || statusFilter ? 'Tente limpar a busca ou selecionar outro status.' : 'Gere uma nova venda para movimentar o faturamento e o estoque.'}
          icon={<ShoppingCart className="w-8 h-8" />}
          actionText={search || statusFilter ? undefined : 'Criar Primeiro Pedido'}
          onAction={search || statusFilter ? undefined : handleOpenCreateModal}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Pedido</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Itens</th>
                  <th className="py-3.5 px-4">Valor Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pedidos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-blue-600">
                      #PED-{p.id.toString().padStart(4, '0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.clienteNome}</div>
                      <div className="text-xs text-slate-500 font-mono">{p.clienteDocumento}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(p.dataPedido).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                        {p.itens.length} {p.itens.length === 1 ? 'item' : 'itens'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatCurrency(p.valorTotal)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={getStatusBadgeVariant(p.status)}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPedido(p);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                          title="Visualizar Detalhes"
                        >
                          <Eye className="w-4 h-4" /> Detalhes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={8}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal: Novo Pedido */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Novo Pedido de Venda"
        maxWidth="2xl"
      >
        {createError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {createError}
          </div>
        )}

        <form onSubmit={handleCreateOrder} className="space-y-5">
          {/* Passo 1: Selecionar Cliente */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Cliente Responsável <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedClienteId}
              onChange={(e) => setSelectedClienteId(parseInt(e.target.value) || 0)}
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="0">Selecione um cliente ativo...</option>
              {clientesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.documento})
                </option>
              ))}
            </select>
          </div>

          {/* Passo 2: Adicionar Itens */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-600" /> Adicionar Produtos ao Pedido
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-7">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Produto</label>
                <select
                  value={selectedProdutoId}
                  onChange={(e) => setSelectedProdutoId(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="0">Selecione um produto...</option>
                  {produtosList.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nome} — {formatCurrency(prod.preco)} (Estoque: {prod.estoque})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Quantidade</label>
                <Input
                  type="number"
                  min="1"
                  value={itemQuantidade}
                  onChange={(e) => setItemQuantidade(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAddItemToOrder}
                  disabled={!selectedProdutoId}
                  className="w-full py-2"
                >
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Tabela de Itens Selecionados */}
            {orderItems.length > 0 && (
              <div className="mt-3 bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2">Qtd</th>
                      <th className="p-2">Preço Un.</th>
                      <th className="p-2">Subtotal</th>
                      <th className="p-2 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-medium text-slate-800">
                          {item.produtoNome} <span className="text-slate-400 font-mono">({item.sku})</span>
                        </td>
                        <td className="p-2 font-bold text-slate-900">{item.quantidade} un.</td>
                        <td className="p-2 text-slate-600">{formatCurrency(item.preco)}</td>
                        <td className="p-2 font-bold text-slate-900">{formatCurrency(item.preco * item.quantidade)}</td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Passo 3: Desconto e Observações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Desconto Geral (R$)"
                type="number"
                step="0.01"
                min="0"
                value={desconto || ''}
                placeholder="0.00"
                onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Observações da Venda</label>
              <Input
                placeholder="Ex: Entrega prioritária, faturar para 30 dias"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-700 font-medium">Subtotal dos Itens:</span>
              <p className="text-sm font-semibold text-blue-900">{formatCurrency(calculateSubtotal())}</p>
            </div>
            {desconto > 0 && (
              <div>
                <span className="text-xs text-rose-600 font-medium">Desconto Aplicado:</span>
                <p className="text-sm font-semibold text-rose-700">- {formatCurrency(desconto)}</p>
              </div>
            )}
            <div>
              <span className="text-xs text-blue-800 font-bold uppercase tracking-wider">Total a Pagar:</span>
              <p className="text-xl font-black text-blue-900">{formatCurrency(calculateTotal())}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={orderItems.length === 0 || !selectedClienteId}
            >
              Concluir e Faturar Pedido
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Detalhes do Pedido */}
      {selectedPedido && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`Detalhes do Pedido #PED-${selectedPedido.id.toString().padStart(4, '0')}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Status & Quick Actions */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Status Atual</span>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(selectedPedido.status)} size="md">
                    {selectedPedido.status}
                  </Badge>
                </div>
              </div>

              {/* Botões de Transição de Status */}
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedPedido.status === 'Pendente' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStatusChange(selectedPedido.id, 'Processando')}
                    leftIcon={<Clock className="w-3.5 h-3.5" />}
                  >
                    Processar
                  </Button>
                )}

                {selectedPedido.status === 'Processando' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStatusChange(selectedPedido.id, 'Enviado')}
                    leftIcon={<Truck className="w-3.5 h-3.5" />}
                  >
                    Enviar Pedido
                  </Button>
                )}

                {selectedPedido.status === 'Enviado' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleStatusChange(selectedPedido.id, 'Concluido')}
                    leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                  >
                    Concluir Venda
                  </Button>
                )}

                {selectedPedido.status !== 'Cancelado' && selectedPedido.status !== 'Concluido' && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleCancelOrder(selectedPedido.id)}
                    leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    Cancelar Pedido
                  </Button>
                )}
              </div>
            </div>

            {/* Informações do Cliente & Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1">Cliente Vinculado</span>
                <p className="font-bold text-slate-900 text-sm">{selectedPedido.clienteNome}</p>
                <p className="text-slate-500 font-mono mt-0.5">{selectedPedido.clienteDocumento}</p>
                <p className="text-slate-500">{selectedPedido.clienteEmail}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1">Data & Observações</span>
                <p className="text-slate-700">Realizado em: <strong>{new Date(selectedPedido.dataPedido).toLocaleString('pt-BR')}</strong></p>
                <p className="text-slate-600 mt-1 italic">{selectedPedido.observacoes || 'Sem observações registradas.'}</p>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Itens Comprados ({selectedPedido.itens.length})
              </h4>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Produto</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5">Qtd</th>
                      <th className="p-2.5">Preço Unit.</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPedido.itens.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-bold text-slate-800">{item.produtoNome}</td>
                        <td className="p-2.5 font-mono text-slate-500">{item.produtoSku}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{item.quantidade} un.</td>
                        <td className="p-2.5 text-slate-600">{formatCurrency(item.precoUnitario)}</td>
                        <td className="p-2.5 font-extrabold text-slate-900 text-right">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumo do Total */}
            <div className="border-t border-slate-200 pt-4 flex flex-col items-end gap-1 text-sm">
              {selectedPedido.desconto > 0 && (
                <div className="flex justify-between w-48 text-rose-600 text-xs font-medium">
                  <span>Desconto:</span>
                  <span>- {formatCurrency(selectedPedido.desconto)}</span>
                </div>
              )}
              <div className="flex justify-between w-48 text-base font-extrabold text-slate-900">
                <span>Total Final:</span>
                <span>{formatCurrency(selectedPedido.valorTotal)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsDetailsModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
