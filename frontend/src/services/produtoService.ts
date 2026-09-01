import api from './api';
import type { ApiResponse, PagedResult, PaginationParams } from '../types/common';
import type { Produto, CreateProdutoRequest, UpdateProdutoRequest } from '../types/produto';
import { mockDb } from './mockDb';

const USE_REAL_API = Boolean(import.meta.env.VITE_API_URL);

export const produtoService = {
  async getAll(params: PaginationParams): Promise<PagedResult<Produto>> {
    if (!USE_REAL_API) {
      return await mockDb.getProdutos(params.search, params.pageNumber, params.pageSize);
    }
    try {
      const response = await api.get<ApiResponse<PagedResult<Produto>>>('/produtos', { params });
      return response.data.dados;
    } catch {
      return await mockDb.getProdutos(params.search, params.pageNumber, params.pageSize);
    }
  },

  async getEstoqueCritico(limite = 5): Promise<Produto[]> {
    if (!USE_REAL_API) {
      const res = await mockDb.getProdutos('', 1, 100);
      return res.items.filter(p => p.estoque < limite);
    }
    try {
      const response = await api.get<ApiResponse<Produto[]>>(`/produtos/estoque-critico?limite=${limite}`);
      return response.data.dados;
    } catch {
      const res = await mockDb.getProdutos('', 1, 100);
      return res.items.filter(p => p.estoque < limite);
    }
  },

  async getById(id: number): Promise<Produto> {
    if (!USE_REAL_API) {
      const res = await mockDb.getProdutos('', 1, 100);
      const item = res.items.find(p => p.id === id);
      if (!item) throw new Error('Produto não encontrado.');
      return item;
    }
    try {
      const response = await api.get<ApiResponse<Produto>>(`/produtos/${id}`);
      return response.data.dados;
    } catch {
      const res = await mockDb.getProdutos('', 1, 100);
      const item = res.items.find(p => p.id === id);
      if (!item) throw new Error('Produto não encontrado.');
      return item;
    }
  },

  async create(data: CreateProdutoRequest): Promise<Produto> {
    if (!USE_REAL_API) {
      return await mockDb.createProduto(data);
    }
    try {
      const response = await api.post<ApiResponse<Produto>>('/produtos', data);
      return response.data.dados;
    } catch {
      return await mockDb.createProduto(data);
    }
  },

  async update(id: number, data: UpdateProdutoRequest): Promise<Produto> {
    if (!USE_REAL_API) {
      return await mockDb.updateProduto(id, data);
    }
    try {
      const response = await api.put<ApiResponse<Produto>>(`/produtos/${id}`, data);
      return response.data.dados;
    } catch {
      return await mockDb.updateProduto(id, data);
    }
  },

  async delete(id: number): Promise<void> {
    if (!USE_REAL_API) {
      return await mockDb.deleteProduto(id);
    }
    try {
      await api.delete(`/produtos/${id}`);
    } catch {
      await mockDb.deleteProduto(id);
    }
  },
};
