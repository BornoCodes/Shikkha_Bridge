import api from '../../../shared/utils/api';
import { ApiResponse, RecoveryPlan, RecoveryPlanItem } from '../../../shared/types';

export const recoveryService = {
  async generatePlan(): Promise<ApiResponse<RecoveryPlan>> {
    const res = await api.post('/recovery/generate');
    return res.data;
  },

  async getStudentPlans(studentId: string): Promise<ApiResponse<RecoveryPlan[]>> {
    const res = await api.get(`/recovery/student/${studentId}`);
    return res.data;
  },

  async getPlanById(id: string): Promise<ApiResponse<RecoveryPlan>> {
    const res = await api.get(`/recovery/${id}`);
    return res.data;
  },

  async updateItemProgress(itemId: string, completed: boolean): Promise<ApiResponse<RecoveryPlanItem>> {
    const res = await api.patch('/recovery/progress', { itemId, completed });
    return res.data;
  },

  async approvePlan(planId: string, status: string, teacherNotes?: string): Promise<ApiResponse<RecoveryPlan>> {
    const res = await api.patch(`/recovery/${planId}/approve`, { status, teacherNotes });
    return res.data;
  },
};
