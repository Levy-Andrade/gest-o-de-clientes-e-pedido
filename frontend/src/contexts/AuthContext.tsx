import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UsuarioInfo, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UsuarioInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UsuarioInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('gestao_token');
      const storedUser = localStorage.getItem('gestao_usuario');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Erro ao recuperar sessão:', err);
      localStorage.removeItem('gestao_token');
      localStorage.removeItem('gestao_usuario');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setUser(data.usuario);
    localStorage.setItem('gestao_token', data.token);
    localStorage.setItem('gestao_usuario', JSON.stringify(data.usuario));
  };

  const register = async (registerData: RegisterRequest) => {
    const data = await authService.register(registerData);
    setToken(data.token);
    setUser(data.usuario);
    localStorage.setItem('gestao_token', data.token);
    localStorage.setItem('gestao_usuario', JSON.stringify(data.usuario));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gestao_token');
    localStorage.removeItem('gestao_usuario');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
