import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  CalendarX,
  FileQuestion,
  Compass,
  FolderGit2,
  CheckCircle2,
  Bell,
  BookMarked,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const studentLinks = [
    { to: '/student/dashboard', label: 'My Learning Hub', icon: LayoutDashboard },
    { to: '/student/absences', label: 'Absence & Gaps', icon: CalendarX },
    { to: '/student/recovery-plans', label: 'Recovery Pathways', icon: Compass },
    { to: '/student/assessments', label: 'Diagnostic Quizzes', icon: FileQuestion },
    { to: '/student/content', label: 'Resource Library', icon: BookMarked },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Class Analytics', icon: LayoutDashboard },
    { to: '/teacher/plans', label: 'Plan Approvals', icon: CheckCircle2 },
    { to: '/student/content', label: 'Resource Management', icon: FolderGit2 },
    { to: '/notifications', label: 'Alerts & Messages', icon: Bell },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 bg-cream border-r border-parchment-dark min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-matti-light uppercase tracking-wider">
          {isTeacher ? 'Teacher Portal' : 'Student Space'}
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-terracotta text-white shadow-xs font-semibold'
                    : 'text-matti hover:bg-parchment hover:text-terracotta'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Decorative Bengali cultural motif box */}
      <div className="p-4 rounded-xl bg-parchment border border-parchment-dark text-center">
        <div className="font-bengali text-lg font-bold text-terracotta mb-1">
          জ্ঞানই শক্তি
        </div>
        <p className="text-xs text-matti-light leading-relaxed">
          "Knowledge bridges every disruption."
        </p>
      </div>
    </aside>
  );
};
