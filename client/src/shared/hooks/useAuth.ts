import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api, { TOKEN_KEY } from '../utils/api';
import type { User, AuthPayload, LoginCredentials, RegisterData } from '../types';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  exp: number;
  iat: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const decodeAndSetUser = useCallback((token: string): User | null => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      const user: User = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role as User['role'],
        createdAt: new Date(decoded.iat * 1000).toISOString(),
      };
      return user;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const user = decodeAndSetUser(token);
      setAuthState({
        user,
        token: user ? token : null,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [decodeAndSetUser]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await api.post<AuthPayload>('/auth/login', credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    const user = data.user;
    setAuthState({
      user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
    return user;
  }, []);

  const register = useCallback(async (registerData: RegisterData): Promise<User> => {
    const { data } = await api.post<AuthPayload>('/auth/register', registerData);
    localStorage.setItem(TOKEN_KEY, data.token);
    const user = data.user;
    setAuthState({
      user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const { data } = await api.get<{ data: User }>('/auth/me');
      setAuthState((prev) => ({ ...prev, user: data.data }));
      return data.data;
    } catch {
      return authState.user;
    }
  }, [authState.user]);

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout,
    getCurrentUser,
  };
}
