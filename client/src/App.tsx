import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './shared/components/ui/LandingPage';
import { Layout } from './shared/components/ui/Layout';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { RegisterPage } from './modules/auth/pages/RegisterPage';
import { AbsenceTracker } from './modules/absence/pages/AbsenceTracker';
import { AssessmentListPage } from './modules/assessment/pages/AssessmentListPage';
import { AssessmentPage } from './modules/assessment/pages/AssessmentPage';
import { RecoveryPlanListPage } from './modules/recovery/pages/RecoveryPlanListPage';
import { RecoveryPlanPage } from './modules/recovery/pages/RecoveryPlanPage';
import { ContentLibraryPage } from './modules/content/pages/ContentLibraryPage';
import { UniversityNoteExchangePage } from './modules/content/pages/UniversityNoteExchangePage';
import { StudentDashboard } from './modules/dashboard/student/pages/StudentDashboard';
import { TeacherDashboard } from './modules/dashboard/teacher/pages/TeacherDashboard';
import { PlanApprovalPage } from './modules/dashboard/teacher/pages/PlanApprovalPage';
import { PathPage } from './modules/path/pages/PathPage';
import { ProfilePage } from './modules/profile/pages/ProfilePage';
import { NotificationsPage } from './modules/notifications/pages/NotificationsPage';
import { RecoveryPlanCreatePage } from './modules/recovery/pages/RecoveryPlanCreatePage';
import { VideoLessonsPage } from './modules/video-learning/pages/VideoLessonsPage';
import { VideoLessonPage } from './modules/video-learning/pages/VideoLessonPage';
import { TeacherVideoLessonsPage } from './modules/video-learning/pages/TeacherVideoLessonsPage';
export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<Layout />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/path" element={<PathPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/student/absences" element={<AbsenceTracker />} />
        <Route path="/student/assessments" element={<AssessmentListPage />} />
        <Route path="/student/assessments/:id" element={<AssessmentPage />} />
        <Route path="/student/recovery-plans" element={<RecoveryPlanListPage />} />
        <Route path="/student/recovery-plans/new" element={<RecoveryPlanCreatePage />} />
        <Route path="/student/recovery-plans/:id" element={<RecoveryPlanPage />} />
        <Route path="/student/content" element={<ContentLibraryPage />} />

        <Route path="/student/videos" element={<VideoLessonsPage />} />
        <Route path="/student/videos/:lessonId" element={<VideoLessonPage />} />

        <Route path="/university/notes" element={<UniversityNoteExchangePage />} />

        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/videos" element={<TeacherVideoLessonsPage />} />
        <Route path="/teacher/plans" element={<TeacherDashboard />} />
        <Route path="/teacher/plans/:id" element={<PlanApprovalPage />} />

        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
