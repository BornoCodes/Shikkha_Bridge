import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { BengaliArtBackground } from '../../../shared/components/ui/BengaliArtBackground';
import { GraduationCap, Users, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [studentClass, setStudentClass] = useState('Class 9');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !school) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        name,
        email,
        password,
        role,
        school,
        class: role === 'student' ? studentClass : undefined,
      });
      toast.success('Registration successful! Welcome to ShikkhaBridge.');
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch {
      // Mock registration for demo
      const mockUser = {
        id: 'usr-new',
        name,
        email,
        role,
        school,
        class: studentClass,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('shikkha_token', 'mock-token-demo');
      localStorage.setItem('shikkha_user', JSON.stringify(mockUser));
      toast.success('Account created! Welcome to ShikkhaBridge.');
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 selection:bg-terracotta selection:text-white">
      {/* Animated Traditional Bengali Art Background */}
      <BengaliArtBackground />

      <div className="relative z-10 w-full max-w-2xl glass-panel-elevated rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/80 nakshi-ribbon-top">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-matti-light hover:text-terracotta transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <div className="w-9 h-9 rounded-xl bg-terracotta text-white flex items-center justify-center font-bengali text-lg font-bold">
            সে
          </div>
        </div>

        <div className="text-center mb-7">
          <h2 className="font-heading text-3xl font-bold text-matti">Create Your Account</h2>
          <p className="text-xs text-matti-light mt-1">
            Choose your learning role and build your catch-up pathway.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              role === 'student'
                ? 'border-terracotta bg-terracotta/10 shadow-xs'
                : 'border-white/70 glass-panel hover:border-terracotta/40'
            }`}
          >
            <GraduationCap className={`w-7 h-7 ${role === 'student' ? 'text-terracotta' : 'text-matti-light'}`} />
            <div className="text-center">
              <div className="font-heading font-bold text-sm text-matti">Student</div>
              <div className="text-[11px] text-matti-light">Recover missed syllabus</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              role === 'teacher'
                ? 'border-terracotta bg-terracotta/10 shadow-xs'
                : 'border-white/70 glass-panel hover:border-terracotta/40'
            }`}
          >
            <Users className={`w-7 h-7 ${role === 'teacher' ? 'text-terracotta' : 'text-matti-light'}`} />
            <div className="text-center">
              <div className="font-heading font-bold text-sm text-matti">Faculty / Teacher</div>
              <div className="text-[11px] text-matti-light">Review & approve recovery</div>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rafiqul Islam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. rafiq@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="School / Institution"
              placeholder="e.g. Sunamganj Govt High School"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />

            {role === 'student' && (
              <div>
                <label className="block text-xs font-semibold text-matti mb-1.5">Grade / Class</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-parchment-dark bg-white/80 text-matti text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                >
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9 (SSC)</option>
                  <option value="Class 10">Class 10 (SSC)</option>
                  <option value="Class 11">Class 11 (HSC)</option>
                  <option value="Class 12">Class 12 (HSC)</option>
                </select>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 shadow-md shadow-terracotta/20"
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-matti-light">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-terracotta hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
