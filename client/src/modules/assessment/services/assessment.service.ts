import api from '../../../shared/utils/api';
import { ApiResponse, Assessment } from '../../../shared/types';

export const assessmentService = {
  async generateAssessment(topicId: string, difficulty = 'medium', questionCount = 5): Promise<ApiResponse<Assessment>> {
    const res = await api.post('/assessments/generate', {
      topicId,
      difficulty,
      questionCount,
    });
    return res.data;
  },

  async submitAssessment(assessmentId: string, answers: { questionId: string; answer: string }[]): Promise<ApiResponse<Assessment>> {
    const res = await api.post('/assessments/submit', {
      assessmentId,
      answers,
    });
    return res.data;
  },

  async getAssessment(id: string): Promise<ApiResponse<Assessment>> {
    const res = await api.get(`/assessments/${id}`);
    return res.data;
  },

  async getStudentAssessments(studentId: string): Promise<ApiResponse<Assessment[]>> {
    const res = await api.get(`/assessments/student/${studentId}`);
    return res.data;
  },
};
