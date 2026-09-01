export interface UsuarioInfo {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

export interface AuthResponse {
  token: string;
  expiraEm: string;
  usuario: UsuarioInfo;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  perfil?: number;
}
