import api from './api';
import type { ApiResponse, PagedResult, PaginationParams } from '../types/common';
import type { Pedido, CreatePedidoRequest, StatusPedido } from '../types/pedido';
import { mockDb } from './mockDb';

const USE_REAL_API = Boolean(import.meta.env.VITE_API_URL);

export const pedidoService = {
  async getAll(params: PaginationParams, status?: StatusPedido, clienteId?: number): Promise<PagedResult<Pedido>> {
    if (!USE_REAL_API) {
      return await mockDb.getPedidos(params.search, status, params.pageNumber, params.pageSize);
    }
    try {
      const queryParams: Record<string, any> = { ...params };
      if (status) queryParams.status = status;
      if (clienteId) queryParams.clienteId = clienteId;

      const response = await api.get<ApiResponse<PagedResult<Pedido>>>('/pedidos', { params: queryParams });
      return response.data.dados;
    } catch {
      return await mockDb.getPedidos(params.search, status, params.pageNumber, params.pageSize);
    }
  },

  async getById(id: number): Promise<Pedido> {
    if (!USE_REAL_API) {
      const res = await mockDb.getPedidos();
      const item = res.items.find(p => p.id === id);
      if (!item) throw new Error('Pedido não encontrado.');
      return item;
    }
    try {
      const response = await api.get<ApiResponse<Pedido>>(`/pedidos/${id}`);
      return response.data.dados;
    } catch {
      const res = await mockDb.getPedidos();
      const item = res.items.find(p => p.id === id);
      if (!item) throw new Error('Pedido não encontrado.');
      return item;
    }
  },

  async create(data: CreatePedidoRequest): Promise<Pedido> {
    if (!USE_REAL_API) {
      return await mockDb.createPedido(data);
    }
    try {
      const response = await api.post<ApiResponse<Pedido>>('/pedidos', data);
      return response.data.dados;
    } catch {
      return await mockDb.createPedido(data);
    }
  },

  async updateStatus(id: number, status: StatusPedido): Promise<Pedido> {
    if (!USE_REAL_API) {
      return await mockDb.updatePedidoStatus(id, status);
    }
    try {
      const response = await api.patch<ApiResponse<Pedido>>(`/pedidos/${id}/status`, { status });
      return response.data.dados;
    } catch {
      return await mockDb.updatePedidoStatus(id, status);
    }
  },

  async cancel(id: number): Promise<void> {
    if (!USE_REAL_API) {
      return await mockDb.cancelPedido(id);
    }
    try {
      await api.delete(`/pedidos/${id}`);
    } catch {
      await mockDb.cancelPedido(id);
    }
  },
};
