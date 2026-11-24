import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './modules/landing/pages/LandingPage';
import { AppShell } from './shared/components/layout/AppShell';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { RegisterPage } from './modules/auth/pages/RegisterPage';
import { HomePage } from './modules/home/pages/HomePage';
import { ProfilePage } from './modules/profile/pages/ProfilePage';

/**
 * Routes. Teammates: add your feature's page inside the <AppShell> block below
 * (one <Route> line) and register it in src/shared/features.ts.
 */
export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Signed-in space: top bar, page transitions and the Chibi guide */}
      <Route element={<AppShell />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* ---- feature routes go here ---- */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
