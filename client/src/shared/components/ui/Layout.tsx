import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Guide, GuideProvider } from '../../guide';
import { Navbar } from './Navbar';
import { PageTransition } from './PageTransition';

/**
 * The signed-in app: a slim top bar, the page (with its transition) and the
 * Chibi guide wandering along the bottom. Signed-out visitors go to log in.
 */
export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return (
    <GuideProvider>
      <div className="min-h-screen flex flex-col has-guide">
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-7">
          <PageTransition />
        </main>
      </div>
      <Guide />
    </GuideProvider>
  );
};
