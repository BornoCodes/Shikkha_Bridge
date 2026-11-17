import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Bell, LogOut, Menu, X, Sparkles, Compass, BookOpen, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 glass-nav nakshi-ribbon-bottom transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-terracotta to-[#9E331A] text-white flex items-center justify-center shadow-md shadow-terracotta/25 group-hover:scale-105 transition-all duration-300 ring-2 ring-turmeric/40">
              <span className="font-bengali text-2xl font-bold leading-none select-none">সে</span>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-turmeric border-2 border-cream" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-2xl font-bold tracking-tight text-matti group-hover:text-terracotta transition-colors">
                  Shikkha<span className="text-terracotta">Bridge</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-terracotta/10 text-terracotta border border-terracotta/20">
                  Recovery
                </span>
              </div>
              <p className="text-[11px] font-bengali text-matti-light/80 tracking-wide">
                শিক্ষার সেতু • Learning Recovery System
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                  className="text-sm font-semibold text-matti/80 hover:text-terracotta transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4 text-turmeric" />
                  <span>Dashboard</span>
                </Link>

                {user?.role === 'student' && (
                  <>
                    <Link
                      to="/student/recovery-plans"
                      className="text-sm font-semibold text-matti/80 hover:text-terracotta transition-colors flex items-center gap-1.5"
                    >
                      <Compass className="w-4 h-4 text-river" />
                      <span>Recovery Paths</span>
                    </Link>
                    <Link
                      to="/student/assessments"
                      className="text-sm font-semibold text-matti/80 hover:text-terracotta transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-lotus" />
                      <span>Quizzes</span>
                    </Link>
                  </>
                )}

                {user?.role === 'teacher' && (
                  <>
                    <Link
                      to="/teacher/plans"
                      className="text-sm font-semibold text-matti/80 hover:text-terracotta transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-turmeric" />
                      <span>Plan Approvals</span>
                    </Link>
                  </>
                )}

                <Link
                  to="/student/content"
                  className="text-sm font-semibold text-matti/80 hover:text-terracotta transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-matti-light" />
                  <span>Library</span>
                </Link>

                {/* Notifications Link */}
                <Link
                  to="/notifications"
                  className="relative p-2.5 rounded-xl glass-panel hover:bg-parchment text-matti/80 hover:text-terracotta transition-all shadow-xs"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta animate-pulse ring-2 ring-white" />
                </Link>

                {/* User Profile Pill */}
                <div className="flex items-center gap-3 pl-4 border-l border-terracotta/20">
                  <div className="flex items-center gap-2.5 glass-panel px-3 py-1.5 rounded-xl border border-white/60">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-terracotta to-turmeric text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-bold text-matti leading-none">{user?.name}</div>
                      <div className="text-[10px] text-terracotta font-medium capitalize mt-0.5">{user?.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 rounded-xl text-matti-light hover:text-terracotta glass-panel hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-matti/90 hover:text-terracotta px-4 py-2 rounded-xl transition-all hover:bg-white/50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-terracotta to-[#B04029] hover:from-[#B04029] hover:to-terracotta px-5 py-2.5 rounded-xl shadow-md shadow-terracotta/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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
              className="p-2.5 rounded-xl glass-panel text-matti hover:bg-parchment"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-terracotta/20 px-4 pt-3 pb-5 space-y-2.5">
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-matti hover:bg-terracotta/10 hover:text-terracotta"
              >
                Dashboard
              </Link>
              <Link
                to="/student/recovery-plans"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-matti hover:bg-terracotta/10 hover:text-terracotta"
              >
                Recovery Pathways
              </Link>
              <Link
                to="/student/content"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-matti hover:bg-terracotta/10 hover:text-terracotta"
              >
                Content Library
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-matti hover:bg-terracotta/10 hover:text-terracotta"
              >
                Notifications
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-terracotta hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-matti hover:bg-white/60"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-terracotta hover:bg-terracotta-dark"
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
