import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Logo } from '../../../shared/components/ui/Logo';
import { KanthaBorder } from '../../../shared/art/KanthaBorder';
import { GraduationCap, Users } from 'lucide-react';
import { DEFAULT_FEMALE_AVATAR, DEFAULT_MALE_AVATAR } from '../../../shared/avatar/avatarConfig';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [gender, setGender] = useState<'male' | 'female'>('female');
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
    // Persist gender and initialize avatar
    try {
      localStorage.setItem('shikkha_gender_pref', gender);
      const chosenAvatar = gender === 'male' ? DEFAULT_MALE_AVATAR : DEFAULT_FEMALE_AVATAR;
      localStorage.setItem('shikkha_avatar_guest', JSON.stringify({ ...chosenAvatar, nickname: name.split(' ')[0] || '' }));
    } catch {
      // ignore
    }
    try {
      const res = await authService.register({
        name,
        email,
        password,
        role,
        school,
        class: role === 'student' ? studentClass : undefined,
      });
      const registeredUser = res.data?.user;
      if (registeredUser?.id) {
        const chosenAvatar = gender === 'male' ? DEFAULT_MALE_AVATAR : DEFAULT_FEMALE_AVATAR;
        localStorage.setItem(`shikkha_avatar_${registeredUser.id}`, JSON.stringify({ ...chosenAvatar, nickname: name.split(' ')[0] || '' }));
      }
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
        gender,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('shikkha_token', 'mock-token-demo');
      localStorage.setItem('shikkha_user', JSON.stringify(mockUser));
      const chosenAvatar = gender === 'male' ? DEFAULT_MALE_AVATAR : DEFAULT_FEMALE_AVATAR;
      localStorage.setItem(`shikkha_avatar_${mockUser.id}`, JSON.stringify({ ...chosenAvatar, nickname: name.split(' ')[0] || '' }));
      toast.success('Account created! Welcome to ShikkhaBridge.');
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const roleBtn = (r: 'student' | 'teacher', Icon: typeof Users, title: string, sub: string) => (
    <button
      type="button"
      onClick={() => setRole(r)}
      aria-pressed={role === r}
      className={`paper rounded-xl p-4 flex flex-col items-center gap-1.5 transition-colors ${
        role === r ? '!bg-[#C84B31]/10 !outline-[#C84B31]' : 'hover:!outline-[#C84B31]/60'
      }`}
    >
      <Icon className={`w-6 h-6 ${role === r ? 'text-[#C84B31]' : 'text-[#6B5344]'}`} />
      <span className="font-heading text-[17px] text-[#2D1B0E]">{title}</span>
      <span className="text-xs text-[#6B5344]">{sub}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-6">
        <Logo to="/" />
      </div>

      <div className="paper w-full max-w-lg rounded-2xl p-8 sm:p-10">
        <h1 className="font-heading text-[30px] text-center text-[#2D1B0E]">Create your account</h1>
        <p className="text-center text-[#6B5344] mt-1">নতুন অ্যাকাউন্ট</p>
        <KanthaBorder variant="stitch" className="my-5" opacity={0.7} />

        <div className="grid grid-cols-2 gap-3 mb-5">
          {roleBtn('student', GraduationCap, 'Student', 'I want to catch up')}
          {roleBtn('teacher', Users, 'Teacher', 'I approve plans')}
        </div>

        {/* Character Gender Selection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-[#2D1B0E] mb-1.5">Avatar / চরিত্র নির্বাচন</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                gender === 'female'
                  ? 'bg-[#C84B31]/10 border-[#C84B31] text-[#C84B31] font-semibold'
                  : 'bg-white/70 border-[#EAD5BC] text-[#6B5344] hover:border-[#C84B31]/60'
              }`}
            >
              <span className="text-xl">👩</span> Female / কন্যা
            </button>
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                gender === 'male'
                  ? 'bg-[#C84B31]/10 border-[#C84B31] text-[#C84B31] font-semibold'
                  : 'bg-white/70 border-[#EAD5BC] text-[#6B5344] hover:border-[#C84B31]/60'
              }`}
            >
              <span className="text-xl">👨</span> Male / ছেলে
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" placeholder="Rafiqul Islam" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" placeholder="rafiq@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="School" placeholder="Sunamganj Govt High School" value={school} onChange={(e) => setSchool(e.target.value)} required />

          {role === 'student' && (
            <div>
              <label htmlFor="reg-class" className="block text-xs font-semibold text-[#2D1B0E] mb-1.5">Class</label>
              <select
                id="reg-class"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EAD5BC] bg-white/80 text-[#2D1B0E] text-sm focus:outline-none focus:ring-2 focus:ring-[#C84B31]/30"
              >
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9 (SSC)</option>
                <option value="Class 10">Class 10 (SSC)</option>
                <option value="Class 11">Class 11 (HSC)</option>
                <option value="Class 12">Class 12 (HSC)</option>
              </select>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B5344]">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#C84B31] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
