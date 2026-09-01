export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem?: string;
  dados: T;
  erros?: string[];
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  isAscending?: boolean;
}
