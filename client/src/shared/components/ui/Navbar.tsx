import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { KanthaBand } from '../../art/KanthaBorder';
import { useAvatar } from '../../avatar/avatarConfig';
import { BengaliAvatar } from '../../avatar/BengaliAvatar';
import { demoUnread } from '../../data/studyData';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from './Logo';

interface Item { to: string; label: string; bn: string }

/** Five places a student needs. Everything else is one click from Today or the guide. */
const STUDENT_NAV: Item[] = [
  { to: '/student/dashboard', label: 'Today', bn: 'আজ' },
  { to: '/student/recovery-plans', label: 'Catch-up', bn: 'পরিকল্পনা' },
  { to: '/student/assessments', label: 'Quizzes', bn: 'কুইজ' },
  { to: '/student/content', label: 'Library', bn: 'পাঠাগার' },
  { to: '/university/notes', label: 'Notes', bn: 'নোট' },
];
const TEACHER_NAV: Item[] = [
  { to: '/teacher/dashboard', label: 'Class', bn: 'শ্রেণি' },
  { to: '/teacher/plans', label: 'Approvals', bn: 'অনুমোদন' },
  { to: '/student/content', label: 'Library', bn: 'পাঠাগার' },
];

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const teacher = user?.role === 'teacher' || user?.role === 'admin';
  const items = teacher ? TEACHER_NAV : STUDENT_NAV;
  const [avatar] = useAvatar(user?.id);

  return (
    <header className="sticky top-0 z-40 bg-[#FBF3E6]/95">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-x-6 gap-y-1 pt-3 pb-1">
        <Logo to={teacher ? '/teacher/dashboard' : '/student/dashboard'} />

        <nav aria-label="Main" className="order-3 md:order-none w-full md:w-auto md:flex-1 overflow-x-auto -mx-1 px-1">
          <ul className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
            {items.map((it) => (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  title={it.bn}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-[15px] rounded-lg transition-colors no-underline ${
                      isActive ? 'text-[#C84B31] stitch-underline font-medium' : 'text-[#6B5344] hover:text-[#2D1B0E]'
                    }`
                  }
                >
                  {it.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto md:ml-0 flex items-center gap-2">
          <Link to="/notifications" className="relative p-2 rounded-full text-[#6B5344] hover:text-[#C84B31]" aria-label={`Notifications, ${demoUnread} new`}>
            <Bell size={20} />
            {demoUnread > 0 && (
              <span className="absolute top-0.5 right-0 min-w-[16px] h-4 px-1 rounded-full bg-[#C84B31] text-white text-[10px] leading-4 text-center">{demoUnread}</span>
            )}
          </Link>
          <Link to="/profile" aria-label="My profile" title="My profile" className="rounded-full ring-2 ring-[#EAD5BC] hover:ring-[#C84B31] transition-shadow">
            <BengaliAvatar config={avatar} size={40} round title="Your character" />
          </Link>
        </div>
      </div>
      <KanthaBand />
    </header>
  );
};
