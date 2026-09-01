import api from './api';
import type { ApiResponse } from '../types/common';
import type { DashboardMetrics } from '../types/dashboard';
import { mockDb } from './mockDb';

const USE_REAL_API = Boolean(import.meta.env.VITE_API_URL);

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    if (!USE_REAL_API) {
      return await mockDb.getMetrics();
    }
    try {
      const response = await api.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics');
      return response.data.dados;
    } catch {
      return await mockDb.getMetrics();
    }
  },
};
