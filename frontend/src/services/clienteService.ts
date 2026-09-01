import api from './api';
import type { ApiResponse, PagedResult, PaginationParams } from '../types/common';
import type { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../types/cliente';
import { mockDb } from './mockDb';

const USE_REAL_API = Boolean(import.meta.env.VITE_API_URL);

export const clienteService = {
  async getAll(params: PaginationParams): Promise<PagedResult<Cliente>> {
    if (!USE_REAL_API) {
      return await mockDb.getClientes(params.search, params.pageNumber, params.pageSize);
    }
    try {
      const response = await api.get<ApiResponse<PagedResult<Cliente>>>('/clientes', { params });
      return response.data.dados;
    } catch {
      return await mockDb.getClientes(params.search, params.pageNumber, params.pageSize);
    }
  },

  async getById(id: number): Promise<Cliente> {
    if (!USE_REAL_API) {
      const res = await mockDb.getClientes();
      const item = res.items.find(c => c.id === id);
      if (!item) throw new Error('Cliente não encontrado.');
      return item;
    }
    try {
      const response = await api.get<ApiResponse<Cliente>>(`/clientes/${id}`);
      return response.data.dados;
    } catch {
      const res = await mockDb.getClientes();
      const item = res.items.find(c => c.id === id);
      if (!item) throw new Error('Cliente não encontrado.');
      return item;
    }
  },

  async create(data: CreateClienteRequest): Promise<Cliente> {
    if (!USE_REAL_API) {
      return await mockDb.createCliente(data);
    }
    try {
      const response = await api.post<ApiResponse<Cliente>>('/clientes', data);
      return response.data.dados;
    } catch {
      return await mockDb.createCliente(data);
    }
  },

  async update(id: number, data: UpdateClienteRequest): Promise<Cliente> {
    if (!USE_REAL_API) {
      return await mockDb.updateCliente(id, data);
    }
    try {
      const response = await api.put<ApiResponse<Cliente>>(`/clientes/${id}`, data);
      return response.data.dados;
    } catch {
      return await mockDb.updateCliente(id, data);
    }
  },

  async delete(id: number): Promise<void> {
    if (!USE_REAL_API) {
      return await mockDb.deleteCliente(id);
    }
    try {
      await api.delete(`/clientes/${id}`);
    } catch {
      await mockDb.deleteCliente(id);
    }
  },
};
