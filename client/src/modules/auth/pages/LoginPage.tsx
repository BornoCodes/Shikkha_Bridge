import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { Button } from '../../../shared/components/form/Button';
import { Input } from '../../../shared/components/form/Input';
import { Logo } from '../../../shared/components/layout/Logo';
import { KanthaBorder } from '../../../shared/bengali-art/KanthaBorder';
import { AlponaRosette } from '../../../shared/bengali-art/Motifs';

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
      await authService.login(email, password);
      toast.success('Welcome back!');
      navigate('/home');
    } catch {
      toast.error('Sign-in failed. Check your email and password, then try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-6">
        <Logo to="/" />
      </div>

      <div className="paper relative w-full max-w-md rounded-2xl p-8 sm:p-10">
        <AlponaRosette size={56} className="mx-auto -mt-2 mb-2 opacity-80" />
        <h1 className="font-heading text-[30px] text-center text-[#2D1B0E]">Welcome back</h1>
        <p className="text-center text-[#6B5344] mt-1">স্বাগতম</p>
        <KanthaBorder variant="stitch" className="my-5" opacity={0.7} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="anika@student.edu.bd"
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
          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B5344]">
          New here?{' '}
          <Link to="/register" className="font-medium text-[#C84B31] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
