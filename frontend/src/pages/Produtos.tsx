import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Tag, 
  Layers
} from 'lucide-react';
import { produtoService } from '../services/produtoService';
import type { Produto, CreateProdutoRequest } from '../types/produto';
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

export const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState<CreateProdutoRequest>({
    nome: '',
    descricao: '',
    sku: '',
    preco: 0,
    estoque: 0,
    ativo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Load Data
  const loadProdutos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await produtoService.getAll({
        pageNumber: currentPage,
        pageSize: 8,
        search: debouncedSearch,
      });
      setProdutos(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Falha ao carregar catálogo de produtos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProdutos();
  }, [currentPage, debouncedSearch]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleOpenCreate = () => {
    setEditingProduto(null);
    setFormData({
      nome: '',
      descricao: '',
      sku: '',
      preco: 0,
      estoque: 0,
      ativo: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      sku: produto.sku,
      preco: produto.preco,
      estoque: produto.estoque,
      ativo: produto.ativo,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (editingProduto) {
        await produtoService.update(editingProduto.id, formData);
        showToast('Produto atualizado com sucesso!', 'success');
      } else {
        await produtoService.create(formData);
        showToast('Produto cadastrado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      loadProdutos();
    } catch (err: any) {
      setFormError(err.response?.data?.mensagem || 'Erro ao salvar produto. Verifique os dados digitados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o produto "${nome}" do catálogo?`)) {
      return;
    }

    try {
      await produtoService.delete(id);
      showToast('Produto excluído com sucesso!', 'success');
      loadProdutos();
    } catch (err: any) {
      showToast(err.response?.data?.mensagem || 'Não foi possível excluir o produto.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Catálogo de Produtos</h2>
          <p className="text-xs text-slate-500">Controle o inventário, estoque disponível e precificação dos itens</p>
        </div>

        <Button
          onClick={handleOpenCreate}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm shadow-blue-500/20"
        >
          Novo Produto
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Buscar por nome, SKU ou descrição do produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <Spinner size="lg" label="Carregando catálogo de produtos..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadProdutos} />
      ) : produtos.length === 0 ? (
        <EmptyState
          title={search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          description={search ? 'Não encontramos nenhum produto com os termos buscados.' : 'Adicione seu primeiro produto para começar a gerar vendas.'}
          icon={<Package className="w-8 h-8" />}
          actionText={search ? undefined : 'Cadastrar Produto'}
          onAction={search ? undefined : handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Produto</th>
                  <th className="py-3.5 px-4">Código (SKU)</th>
                  <th className="py-3.5 px-4">Preço Unitário</th>
                  <th className="py-3.5 px-4">Estoque</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {produtos.map((p) => {
                  const isCritico = p.estoque < 5;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{p.nome}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-sm">
                          {p.descricao || 'Sem descrição cadastrada'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {p.sku}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatCurrency(p.preco)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-extrabold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              isCritico
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            <Layers className="w-3 h-3" />
                            {p.estoque} un.
                          </span>
                          {isCritico && (
                            <span title="Estoque crítico (< 5 unidades)">
                              <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={p.ativo ? 'success' : 'danger'}>
                          {p.ativo ? 'Disponível' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.nome)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduto ? 'Editar Produto' : 'Novo Produto'}
        maxWidth="lg"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Nome do Produto"
              required
              placeholder="Ex: Monitor Gamer 27 144Hz"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>

          <div>
            <Input
              label="Código / SKU"
              required
              placeholder="Ex: MON-GAM-27"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Preço de Venda (R$)"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={formData.preco || ''}
                onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Input
                label="Quantidade em Estoque"
                type="number"
                min="0"
                required
                placeholder="0"
                value={formData.estoque !== undefined ? formData.estoque : ''}
                onChange={(e) => setFormData({ ...formData, estoque: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Descrição Detalhada</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
              placeholder="Descreva especificações técnicas, garantias ou modelo..."
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="produto-ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="produto-ativo" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Produto Ativo e Disponível para Venda
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              {editingProduto ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </Button>
          </div>
        </form>
      </Modal>

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
