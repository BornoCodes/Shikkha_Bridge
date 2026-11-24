import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './modules/landing/pages/LandingPage';
import { AppShell } from './shared/components/layout/AppShell';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { RegisterPage } from './modules/auth/pages/RegisterPage';
import { HomePage } from './modules/home/pages/HomePage';
import { ProfilePage } from './modules/profile/pages/ProfilePage';
import { VideoLessonsPage } from './modules/video-learning/pages/VideoLessonsPage';
import { VideoLessonPage } from './modules/video-learning/pages/VideoLessonPage';
import { TeacherVideoLessonsPage } from './modules/video-learning/pages/TeacherVideoLessonsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AppShell />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/student/videos" element={<VideoLessonsPage />} />
        <Route path="/student/videos/:lessonId" element={<VideoLessonPage />} />
        <Route path="/teacher/videos" element={<TeacherVideoLessonsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;