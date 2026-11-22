import api, { TOKEN_KEY } from '../../../shared/utils/api';
import { ApiResponse, User } from '../../../shared/types';

type AuthResponse = ApiResponse<{
  token?: string;
  accessToken?: string;
  user: User;
}>;

function persistAuthResponse(response: AuthResponse): ApiResponse<{ token: string; user: User }> {
  const token = response.data?.token ?? response.data?.accessToken;
  if (!token) throw new Error('The server did not return an authentication token');

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('shikkha_token', token);
  localStorage.setItem('shikkha_user', JSON.stringify(response.data.user));

  return { ...response, data: { token, user: response.data.user } };
}

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return persistAuthResponse(res.data);
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher';
    class?: string;
    school: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return persistAuthResponse(res.data);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const res = await api.get('/auth/profile');
    return res.data;
  },
};
