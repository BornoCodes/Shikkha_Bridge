import api from '../../../shared/utils/api';
import { ApiResponse, Absence } from '../../../shared/types';

export const absenceService = {
  async recordAbsence(data: {
    studentId: string;
    date: string;
    reason: string;
    notes?: string;
    topicIds?: string[];
  }): Promise<ApiResponse<Absence>> {
    const res = await api.post('/absences', data);
    return res.data;
  },

  async getStudentAbsences(studentId: string): Promise<ApiResponse<Absence[]>> {
    const res = await api.get(`/absences/student/${studentId}`);
    return res.data;
  },

  async getLearningGaps(studentId: string): Promise<ApiResponse<any[]>> {
    const res = await api.get(`/absences/gaps/${studentId}`);
    return res.data;
  },

  async deleteAbsence(id: string): Promise<ApiResponse<void>> {
    const res = await api.delete(`/absences/${id}`);
    return res.data;
  },
};
