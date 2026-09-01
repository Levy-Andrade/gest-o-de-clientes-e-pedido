import api from './api';
import type { ApiResponse } from '../types/common';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { mockDb } from './mockDb';

const USE_REAL_API = Boolean(import.meta.env.VITE_API_URL);

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (!USE_REAL_API) {
      return await mockDb.login(credentials);
    }
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data.dados;
    } catch (err) {
      console.warn('Backend indisponível, utilizando modo demonstração local:', err);
      return await mockDb.login(credentials);
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (!USE_REAL_API) {
      return await mockDb.register(data);
    }
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return response.data.dados;
    } catch (err) {
      console.warn('Backend indisponível, utilizando modo demonstração local:', err);
      return await mockDb.register(data);
    }
  },
};
