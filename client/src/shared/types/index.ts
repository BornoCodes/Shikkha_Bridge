// ===== User & Auth =====
export type UserRole = 'student' | 'teacher' | 'student_tutor' | 'admin';
export type EducationTier = 'kids' | 'school' | 'college' | 'university';

export type MascotSpecies = 'cat' | 'tiger' | 'owl' | 'bunny';
export type MascotAccessory = 'glasses' | 'cap' | 'flower' | 'scarf' | 'none';

export interface ChibiMascotConfig {
  name: string;
  species: MascotSpecies;
  color: string;
  accessory: MascotAccessory;
  level: number;
  happiness: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier?: EducationTier;
  class?: string;
  school?: string;
  university?: string;
  department?: string;
  avatar?: string;
  mascot?: ChibiMascotConfig;
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
  tier?: EducationTier;
  class?: string;
  school?: string;
  university?: string;
  department?: string;
  mascot?: ChibiMascotConfig;
}

// ===== Academic Structure =====
export interface Subject {
  id: string;
  name: string;
  nameBn?: string;
  code?: string; // e.g. CSE220, PHY101
  tier?: EducationTier;
  class?: string;
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

// ===== Unified Linear Learning Path =====
export type CheckpointType = 'video' | 'quiz' | 'summary' | 'assignment';

export interface PathCheckpoint {
  id: string;
  order: number;
  type: CheckpointType;
  title: string;
  titleBn?: string;
  duration?: string; // e.g. "14 mins", "5 questions", "Quick Read"
  status: 'locked' | 'current' | 'completed';
  points: number;
  videoUrl?: string;
  videoDuration?: string;
  summaryContent?: string;
  keyTakeaways?: string[];
  quizQuestions?: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
  assignmentDetails?: {
    title: string;
    prompt: string;
    dueDate: string;
    submissionFormat: string;
  };
  tutorTip?: string;
}

// ===== Peer Note Requests & Tutor System (Strict Rules) =====
export interface NoteRequest {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  courseCode?: string;
  tier?: EducationTier;
  topicName: string;
  description: string;
  status: 'open' | 'fulfilled';
  fulfilledCount: number;
  createdAt: string;
}

export interface SharedNote {
  id: string;
  requestId: string;
  title: string;
  subject: string;
  courseCode?: string;
  tier?: EducationTier;
  uploaderId: string;
  uploaderName: string;
  uploaderRole: 'student' | 'student_tutor';
  url: string;
  rating: number; // e.g. 4.9
  starCount: number; // total stars
  daysRemaining: number; // 30-day countdown timer: deleted if < 5 stars
  isWarningPurge?: boolean;
  createdAt: string;
}

export interface StudentTutor {
  id: string;
  name: string;
  university: string;
  major: string;
  year: string;
  subjects: string[];
  rating: number;
  sessionCount: number;
  avatar: string;
  bio: string;
  availableStatus: 'online' | 'busy' | 'offline';
}

// ===== Absence Tracking =====
export type AbsenceReason =
  | 'flood'
  | 'illness'
  | 'family'
  | 'cyclone'
  | 'transport'
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
export type PlanStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'archived';

export interface RecoveryPlanTopic {
  id: string;
  name: string;
  subject?: string;
}

export interface RecoveryPlanContent {
  id: string;
  title: string;
  type?: string;
  url?: string;
}

export interface RecoveryPlanItem {
  id: string;
  topicId: string | null;
  contentId?: string | null;
  topic?: RecoveryPlanTopic | null;
  content?: RecoveryPlanContent | null;
  order: number;
  estimatedHours: number;
  completed: boolean;
  completedAt?: string | null;
  notes?: string;
}

export interface RecoveryPlanStep {
  topic_id?: string;
  topic_name?: string;
  content_id?: string;
  content_title?: string;
  estimated_hours?: number;
  description?: string;
}

export interface RecoveryPlanAIData {
  title?: string;
  summary?: string;
  total_estimated_hours?: number;
  steps?: RecoveryPlanStep[];
}

export interface RecoveryPlan {
  id: string;
  studentId: string;
  teacherId?: string | null;
  title?: string;
  description?: string;
  status: PlanStatus;
  totalHours: number;
  aiGeneratedPlan?: RecoveryPlanAIData | null;
  teacherNotes?: string | null;
  items: RecoveryPlanItem[];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

// ===== Content =====
export type ContentType = 'video' | 'pdf' | 'article' | 'quiz' | 'interactive' | 'image' | 'note' | 'exercise';

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
  | 'note_purged'
  | 'tutor_request'
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
