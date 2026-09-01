import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText
} from 'lucide-react';
import { clienteService } from '../services/clienteService';
import type { Cliente, CreateClienteRequest } from '../types/cliente';
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

export const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<CreateClienteRequest>({
    nome: '',
    email: '',
    documento: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
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
  const loadClientes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clienteService.getAll({
        pageNumber: currentPage,
        pageSize: 8,
        search: debouncedSearch,
      });
      setClientes(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.mensagem || 'Falha ao carregar lista de clientes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, [currentPage, debouncedSearch]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingCliente(null);
    setFormData({
      nome: '',
      email: '',
      documento: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      ativo: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      documento: cliente.documento,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      ativo: cliente.ativo,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (editingCliente) {
        await clienteService.update(editingCliente.id, formData);
        showToast('Cliente atualizado com sucesso!', 'success');
      } else {
        await clienteService.create(formData);
        showToast('Cliente cadastrado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      loadClientes();
    } catch (err: any) {
      setFormError(err.response?.data?.mensagem || 'Erro ao salvar cliente. Verifique os dados digitados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) {
      return;
    }

    try {
      await clienteService.delete(id);
      showToast('Cliente excluído com sucesso!', 'success');
      loadClientes();
    } catch (err: any) {
      showToast(err.response?.data?.mensagem || 'Não foi possível excluir o cliente.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gestão de Clientes</h2>
          <p className="text-xs text-slate-500">Cadastre, edite e gerencie o histórico de clientes da empresa</p>
        </div>

        <Button
          onClick={handleOpenCreate}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm shadow-blue-500/20"
        >
          Novo Cliente
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Buscar por nome, email, documento ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <Spinner size="lg" label="Carregando clientes..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadClientes} />
      ) : clientes.length === 0 ? (
        <EmptyState
          title={search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          description={search ? 'Não encontramos nenhum resultado para sua busca.' : 'Comece cadastrando o primeiro cliente para criar pedidos.'}
          icon={<Users className="w-8 h-8" />}
          actionText={search ? undefined : 'Cadastrar Cliente'}
          onAction={search ? undefined : handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Documento</th>
                  <th className="py-3.5 px-4">Contato</th>
                  <th className="py-3.5 px-4">Localização</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Pedidos</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {clientes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.nome}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {c.documento}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {c.telefone || '-'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {c.cidade ? `${c.cidade}/${c.estado}` : '-'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={c.ativo ? 'success' : 'danger'}>
                        {c.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                        {c.totalPedidos}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.nome)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
        maxWidth="xl"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nome Completo / Razão Social"
                required
                placeholder="Ex: Empresa Silva Ltda"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="E-mail"
                type="email"
                required
                placeholder="cliente@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="CPF ou CNPJ"
                required
                placeholder="000.000.000-00"
                value={formData.documento}
                onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="Telefone / WhatsApp"
                required
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="CEP"
                placeholder="00000-000"
                value={formData.cep || ''}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Endereço"
                placeholder="Rua, Número, Bairro"
                value={formData.endereco || ''}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="Cidade"
                placeholder="São Paulo"
                value={formData.cidade || ''}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="Estado (UF)"
                placeholder="SP"
                maxLength={2}
                value={formData.estado || ''}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="cliente-ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="cliente-ativo" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Cliente Ativo (Pode realizar novos pedidos)
              </label>
            </div>
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
              {editingCliente ? 'Salvar Alterações' : 'Cadastrar Cliente'}
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
