import api from '../../../shared/utils/api';
import { ApiResponse, Notification } from '../../../shared/types';

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const res = await api.get('/notifications');
    return res.data;
  },

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<ApiResponse<{ success: boolean }>> {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },
};
