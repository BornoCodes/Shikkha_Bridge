import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { BengaliArtBackground } from '../../../shared/components/ui/BengaliArtBackground';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(email, password);
      toast.success('Welcome back to ShikkhaBridge!');
      const role = res.data?.user?.role;
      if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch {
      // Mock login for demo
      const mockRole = email.includes('teacher') ? 'teacher' : 'student';
      const mockUser = {
        id: 'usr-1',
        name: email.split('@')[0] || 'ShikkhaBridge Scholar',
        email,
        role: mockRole as 'student' | 'teacher',
        school: 'Sylhet Pilot High School',
        class: 'Class 9',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('shikkha_token', 'mock-jwt-token-demo');
      localStorage.setItem('shikkha_user', JSON.stringify(mockUser));
      toast.success(`Signed in as ${mockUser.name} (${mockRole})`);
      navigate(mockRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 selection:bg-terracotta selection:text-white">
      {/* Animated Traditional Bengali Art Background */}
      <BengaliArtBackground />

      <div className="relative z-10 w-full max-w-4xl glass-panel-elevated rounded-3xl shadow-2xl border border-white/80 overflow-hidden grid grid-cols-1 md:grid-cols-2 nakshi-ribbon-top">
        {/* Left Side: Bengali Art Graphic */}
        <div className="bg-gradient-to-br from-terracotta via-[#B04029] to-[#8E3321] p-8 sm:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle Alpona inside Left Banner */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 opacity-20 pointer-events-none">
            <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="100" cy="100" r="70" strokeDasharray="4 6" />
              <circle cx="100" cy="100" r="40" />
            </svg>
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-white/80 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center font-bengali text-2xl font-bold mb-5 ring-2 ring-white/30">
              সে
            </div>
            <h2 className="font-heading text-3xl font-bold leading-tight">
              Reconnecting disrupted learning.
            </h2>
            <p className="mt-3 text-white/85 text-xs sm:text-sm leading-relaxed font-sans">
              Sign in to catch up with missed classes, review your recovery journey, or verify student plans.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/20 mt-8">
            <p className="font-bengali text-sm text-white/90">
              "বিন্দু বিন্দু জলে গড়ে ওঠে অপার সিন্ধু।"
            </p>
            <p className="text-[11px] text-white/70 mt-0.5">Little drops make the mighty ocean.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center glass-panel">
          <div className="mb-6">
            <h3 className="font-heading text-2xl font-bold text-matti">Sign In</h3>
            <p className="text-xs text-matti-light mt-1">
              Enter your registered educational email and password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. anika@student.edu.bd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 shadow-md shadow-terracotta/20"
              disabled={loading}
            >
              {loading ? 'Verifying Credentials...' : 'Sign In to ShikkhaBridge'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-matti-light">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-terracotta hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
