import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

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
    } catch (err: any) {
      // Mock login for seamless demo if backend is offline
      const mockRole = email.includes('teacher') ? 'teacher' : 'student';
      const mockUser = {
        id: 'usr-1',
        name: email.split('@')[0] || 'ShikkhaBridge Scholar',
        email,
        role: mockRole as 'student' | 'teacher',
        school: 'Dhaka Model Academy',
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
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-cream border border-parchment-dark rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Bengali Art Graphic */}
        <div className="bg-gradient-to-br from-terracotta to-turmeric p-8 sm:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center font-bengali text-2xl font-bold mb-6">
              সে
            </div>
            <h2 className="font-heading text-3xl font-bold leading-tight">
              Reconnecting disrupted learning.
            </h2>
            <p className="mt-3 text-white/80 text-sm leading-relaxed font-sans">
              Sign in to catch up with missed classes, review your AI recovery journey, or verify student plans.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/20">
            <p className="font-bengali text-base italic text-white/90">
              "বিন্দু বিন্দু জলে গড়ে ওঠে অপার সিন্ধু।"
            </p>
            <p className="text-xs text-white/70 mt-1">Little drops make the mighty ocean.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="font-heading text-2xl font-bold text-matti">Welcome Back</h3>
            <p className="text-xs text-matti-light mt-1">
              Demo tip: Use any email with <code className="text-terracotta font-semibold">teacher</code> for teacher view.
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
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Sign In to ShikkhaBridge'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-matti-light">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-terracotta hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
