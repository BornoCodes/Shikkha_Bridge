// ===== User & Auth =====
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  class?: string;
  school?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  class?: string;
  school?: string;
}

// ===== Academic Structure =====
export interface Subject {
  id: string;
  name: string;
  nameBn?: string;
  class: string;
  description?: string;
  topicCount?: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  nameBn?: string;
  description?: string;
  order: number;
  prerequisiteIds?: string[];
}

// ===== Absence Tracking =====
export type AbsenceReason =
  | 'illness'
  | 'family'
  | 'transport'
  | 'weather'
  | 'other';

export interface Absence {
  id: string;
  studentId: string;
  date: string;
  reason: AbsenceReason;
  verified: boolean;
  verifiedBy?: string;
  missedTopics: string[];
  notes?: string;
}

// ===== Assessment =====
export type QuestionType = 'mcq' | 'short_answer' | 'true_false' | 'fill_blank';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface AssessmentQuestion {
  id: string;
  topicId: string;
  text: string;
  textBn?: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  difficulty: DifficultyLevel;
  points: number;
  explanation?: string;
}

export interface Assessment {
  id: string;
  studentId: string;
  title: string;
  questions: AssessmentQuestion[];
  topicIds: string[];
  totalPoints: number;
  passingScore: number;
  timeLimit?: number;
  createdAt: string;
  completedAt?: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  gapTopicIds: string[];
  completedAt: string;
}

// ===== Recovery Plan =====
export type PlanStatus = 'draft' | 'pending' | 'approved' | 'active' | 'completed' | 'archived';

export interface RecoveryPlanItem {
  id: string;
  topicId: string;
  contentId?: string;
  order: number;
  estimatedHours: number;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface RecoveryPlan {
  id: string;
  studentId: string;
  teacherId: string;
  title: string;
  description?: string;
  status: PlanStatus;
  items: RecoveryPlanItem[];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

// ===== Content =====
export type ContentType = 'video' | 'pdf' | 'article' | 'quiz' | 'interactive' | 'image';

export interface Content {
  id: string;
  topicId: string;
  title: string;
  titleBn?: string;
  type: ContentType;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  uploadedBy: string;
  durationMinutes?: number;
  createdAt: string;
}

// ===== Notifications =====
export type NotificationType =
  | 'plan_assigned'
  | 'plan_approved'
  | 'plan_completed'
  | 'assessment_ready'
  | 'assessment_result'
  | 'absence_recorded'
  | 'content_added'
  | 'general';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ===== API =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== UI Helpers =====
export interface NavItem {
  label: string;
  labelBn?: string;
  href: string;
  icon?: string;
  badge?: number;
}

export interface SelectOption {
  value: string;
  label: string;
}
