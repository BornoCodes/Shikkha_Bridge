import api from '../../../shared/utils/api';
import { ApiResponse, Content } from '../../../shared/types';

export const contentService = {
  async getContent(filters?: { subject?: string; type?: string; search?: string }): Promise<ApiResponse<Content[]>> {
    const res = await api.get('/content', { params: filters });
    return res.data;
  },

  async getContentByTopic(topicId: string): Promise<ApiResponse<Content[]>> {
    const res = await api.get(`/content/topic/${topicId}`);
    return res.data;
  },

  async uploadContent(data: {
    topicId: string;
    title: string;
    description: string;
    type: 'video' | 'note' | 'exercise' | 'article';
    url: string;
  }): Promise<ApiResponse<Content>> {
    const res = await api.post('/content', data);
    return res.data;
  },
};
