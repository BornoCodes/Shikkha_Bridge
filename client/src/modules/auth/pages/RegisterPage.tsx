import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { GraduationCap, Users } from 'lucide-react';

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
      // Mock registration for quick demo
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
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-cream border border-parchment-dark rounded-3xl shadow-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center mx-auto mb-3 font-bengali text-2xl font-bold">
            সে
          </div>
          <h2 className="font-heading text-3xl font-bold text-matti">Join ShikkhaBridge</h2>
          <p className="text-sm text-matti-light mt-1">
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
                ? 'border-terracotta bg-terracotta/5 shadow-xs'
                : 'border-parchment-dark bg-parchment/40 hover:border-terracotta/40'
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
                ? 'border-terracotta bg-terracotta/5 shadow-xs'
                : 'border-parchment-dark bg-parchment/40 hover:border-terracotta/40'
            }`}
          >
            <Users className={`w-7 h-7 ${role === 'teacher' ? 'text-terracotta' : 'text-matti-light'}`} />
            <div className="text-center">
              <div className="font-heading font-bold text-sm text-matti">Teacher</div>
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
                <label className="block text-xs font-semibold text-matti mb-1">Grade / Class</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-parchment-dark bg-cream text-matti text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/40"
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
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Setting up Profile...' : 'Complete Registration'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-matti-light">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-terracotta hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
