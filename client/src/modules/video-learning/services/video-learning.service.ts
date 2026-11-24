
import api from '../../../shared/utils/api';
import { ApiResponse, Assessment } from '../../../shared/types';

export interface VideoLesson {
  id: string;
  topicId: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  published: boolean;
  createdAt: string;
  topic?: {
    id: string;
    name?: string;
    title?: string;
    subject?: string | {
      id: string;
      name: string;
      classLevel: string;
    };
  };
  segments?: VideoSegment[];
}

export interface VideoSegment {
  id: string;
  lessonId: string;
  title: string;
  videoUrl?: string | null;
  startTime: number;
  endTime: number;
  segmentOrder: number;
  passingScore: number;
  learningContent?: string | null;
}

export interface VideoSegmentProgress {
  segmentId: string;
  title: string;
  segmentOrder: number;
  passingScore: number;
  unlocked: boolean;
  completed: boolean;
  quizScore: number | null;
}

export interface VideoQuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  completed: boolean;
  completedAt?: string;
  correctCount: number;
  videoProgress?: {
    score: number;
    passingScore: number;
    passed: boolean;
    nextSegmentUnlocked: boolean;
    nextSegmentId: string | null;
  };
}

export interface VideoTopic {
  id: string;
  name: string;
  weekNumber: number;
  description?: string | null;
  subject?: {
    id: string;
    name: string;
    classLevel: string;
  };
}

export interface CreateVideoLessonDto {
  topicId: string;
  title: string;
  description?: string;
  videoUrl: string;
}

export interface CreateVideoSegmentDto {
  title: string;
  startTime: number;
  endTime: number;
  segmentOrder: number;
  passingScore: number;
  learningContent: string;
}

export const videoLearningService = {
  // STUDENT METHODS

  async getPublishedLessons(): Promise<ApiResponse<VideoLesson[]>> {
    const res = await api.get('/video-learning/lessons');
    return res.data;
  },

  async getLesson(lessonId: string): Promise<ApiResponse<VideoLesson>> {
    const res = await api.get(`/video-learning/lessons/${lessonId}`);
    return res.data;
  },

  async getLessonProgress(
    lessonId: string,
  ): Promise<ApiResponse<VideoSegmentProgress[]>> {
    const res = await api.get(
      `/video-learning/lessons/${lessonId}/progress`,
    );
    return res.data;
  },

  async startSegment(
    segmentId: string,
  ): Promise<ApiResponse<unknown>> {
    const res = await api.post(
      `/video-learning/segments/${segmentId}/start`,
    );
    return res.data;
  },

  async generateSegmentQuiz(
    topicId: string,
    videoSegmentId: string,
    difficulty = 'medium',
    questionCount = 5,
  ): Promise<ApiResponse<Assessment>> {
    const res = await api.post('/assessments/generate', {
      topicId,
      videoSegmentId,
      difficulty,
      questionCount,
    });
    return res.data;
  },

  async submitSegmentQuiz(
    assessmentId: string,
    answers: { questionId: string; answer: string }[],
  ): Promise<ApiResponse<VideoQuizResult>> {
    const res = await api.post('/assessments/submit', {
      assessmentId,
      answers,
    });
    return res.data;
  },

  // TEACHER METHODS

  async getTopics(): Promise<ApiResponse<VideoTopic[]>> {
    const res = await api.get('/content/topics');
    return res.data;
  },

  async getTeacherLessons(): Promise<ApiResponse<VideoLesson[]>> {
    const res = await api.get('/video-learning/teacher/lessons');
    return res.data;
  },

  async createLesson(
    data: CreateVideoLessonDto,
  ): Promise<ApiResponse<VideoLesson>> {
    const res = await api.post('/video-learning/teacher/lessons', data);
    return res.data;
  },

  async createSegment(
    lessonId: string,
    data: CreateVideoSegmentDto,
  ): Promise<ApiResponse<VideoSegment>> {
    const res = await api.post(
      `/video-learning/teacher/lessons/${lessonId}/segments`,
      data,
    );
    return res.data;
  },

  async publishLesson(
    lessonId: string,
  ): Promise<ApiResponse<VideoLesson>> {
    const res = await api.patch(
      `/video-learning/teacher/lessons/${lessonId}/publish`,
    );
    return res.data;
  },

  async updateSegmentContent(
    segmentId: string,
    learningContent: string,
  ): Promise<ApiResponse<VideoSegment>> {
    const res = await api.patch(
      `/video-learning/teacher/segments/${segmentId}/content`,
      { learningContent },
    );
    return res.data;
  },
};
