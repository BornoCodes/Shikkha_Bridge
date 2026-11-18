import api from '../../../shared/utils/api';
import { ApiResponse, User } from '../../../shared/types';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.data?.token) {
      localStorage.setItem('shikkha_token', res.data.data.token);
      localStorage.setItem('shikkha_user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher';
    class?: string;
    school: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    const res = await api.post('/auth/register', data);
    if (res.data?.data?.token) {
      localStorage.setItem('shikkha_token', res.data.data.token);
      localStorage.setItem('shikkha_user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const res = await api.get('/auth/profile');
    return res.data;
  },
};
