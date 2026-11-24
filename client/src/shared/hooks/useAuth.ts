import { useState, useEffect, useCallback } from 'react';
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

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check saved user in localStorage for fast synchronous render
    const savedToken = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('shikkha_token');
    const savedUserStr = localStorage.getItem('shikkha_user');
    let initialUser: User | null = null;

    if (savedUserStr) {
      try {
        initialUser = JSON.parse(savedUserStr);
      } catch {
        initialUser = null;
      }
    }

    return {
      user: initialUser,
      token: savedToken,
      isAuthenticated: !!savedToken,
      isLoading: false,
    };
  });

  const decodeAndSetUser = useCallback((token: string): User | null => {
    try {
      const decoded = parseJwt(token);
      if (!decoded) return null;
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('shikkha_token');
        localStorage.removeItem('shikkha_user');
        return null;
      }
      const user: User = {
        id: decoded.sub || 'usr-1',
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0],
        role: (decoded.role as User['role']) || 'student',
        tier: undefined,
        createdAt: new Date((decoded.iat || Date.now() / 1000) * 1000).toISOString(),
      };
      return user;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('shikkha_token');
    const savedUser = localStorage.getItem('shikkha_user');

    if (token) {
      let user: User | null = null;
      if (savedUser) {
        try {
          user = JSON.parse(savedUser);
        } catch {
          user = null;
        }
      }
      if (!user) {
        user = decodeAndSetUser(token);
      }

      setAuthState({
        user,
        token,
        isAuthenticated: !!token,
        isLoading: false,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [decodeAndSetUser]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await api.post<AuthPayload>('/auth/login', credentials);
    const token = data.token;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('shikkha_token', token);
    localStorage.setItem('shikkha_user', JSON.stringify(data.user));

    setAuthState({
      user: data.user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
    return data.user;
  }, []);

  const register = useCallback(async (registerData: RegisterData): Promise<User> => {
    const { data } = await api.post<AuthPayload>('/auth/register', registerData);
    const token = data.token;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('shikkha_token', token);
    localStorage.setItem('shikkha_user', JSON.stringify(data.user));

    setAuthState({
      user: data.user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('shikkha_token');
    localStorage.removeItem('shikkha_user');
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

export default useAuth;
