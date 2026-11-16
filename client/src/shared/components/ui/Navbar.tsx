import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Bell, User, LogOut, Menu, X, BookOpen, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-parchment-dark shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="font-bengali text-xl font-bold">সে</span>
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-matti group-hover:text-terracotta transition-colors">
                Shikkha<span className="text-terracotta">Bridge</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider uppercase text-matti-light font-medium">
                শিক্ষার সেতু • Learning Recovery
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                  className="text-sm font-medium text-matti hover:text-terracotta transition-colors"
                >
                  Dashboard
                </Link>

                {user?.role === 'student' && (
                  <>
                    <Link
                      to="/student/recovery-plans"
                      className="text-sm font-medium text-matti hover:text-terracotta transition-colors"
                    >
                      Recovery Paths
                    </Link>
                    <Link
                      to="/student/assessments"
                      className="text-sm font-medium text-matti hover:text-terracotta transition-colors"
                    >
                      Quizzes
                    </Link>
                  </>
                )}

                {user?.role === 'teacher' && (
                  <>
                    <Link
                      to="/teacher/plans"
                      className="text-sm font-medium text-matti hover:text-terracotta transition-colors"
                    >
                      Review Approvals
                    </Link>
                  </>
                )}

                <Link
                  to="/student/content"
                  className="text-sm font-medium text-matti hover:text-terracotta transition-colors"
                >
                  Library
                </Link>

                {/* Notifications Link */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-full hover:bg-parchment text-matti-light hover:text-matti transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-terracotta animate-pulse" />
                </Link>

                {/* User Profile Pill */}
                <div className="flex items-center gap-3 pl-4 border-l border-parchment-dark">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-parchment-dark flex items-center justify-center text-xs font-bold text-terracotta">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-semibold text-matti leading-none">{user?.name}</div>
                      <div className="text-[10px] text-matti-light capitalize">{user?.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-matti-light hover:text-terracotta hover:bg-parchment transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-matti hover:text-terracotta px-3 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-terracotta hover:bg-terracotta-dark px-4 py-2 rounded-xl shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-matti hover:bg-parchment"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-parchment-dark px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-matti hover:bg-parchment"
              >
                Dashboard
              </Link>
              <Link
                to="/student/recovery-plans"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-matti hover:bg-parchment"
              >
                Recovery Plans
              </Link>
              <Link
                to="/student/content"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-matti hover:bg-parchment"
              >
                Content Library
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-matti hover:bg-parchment"
              >
                Notifications
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-terracotta hover:bg-parchment"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-matti hover:bg-parchment"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-terracotta font-semibold hover:bg-parchment"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
