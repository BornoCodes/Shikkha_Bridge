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
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const studentLinks = [
    { to: '/student/dashboard', label: 'My Learning Hub & Path', icon: LayoutDashboard },
    { to: '/university/notes', label: 'Peer Notes & Tutors', icon: GraduationCap },
    { to: '/student/absences', label: 'Disruption & Gaps', icon: CalendarX },
    { to: '/student/recovery-plans', label: 'Recovery Pathways', icon: Compass },
    { to: '/student/assessments', label: 'Diagnostic Quizzes', icon: FileQuestion },
    { to: '/student/content', label: 'Resource Library', icon: BookMarked },
    { to: '/notifications', label: 'Alerts & Messages', icon: Bell },
  ];

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Class Overview', icon: LayoutDashboard },
    { to: '/teacher/plans', label: 'Plan Approvals', icon: CheckCircle2 },
    { to: '/university/notes', label: 'Student Tutor Reviews', icon: GraduationCap },
    { to: '/student/content', label: 'Resource Management', icon: FolderGit2 },
    { to: '/notifications', label: 'Alerts & Notices', icon: Bell },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <aside className="w-68 glass-sidebar min-h-[calc(100vh-4.5rem)] p-5 flex flex-col justify-between hidden md:flex border-r border-terracotta/15 relative z-10">
      <div className="space-y-2">
        <div className="flex items-center justify-between px-3.5 py-1 mb-2">
          <span className="text-[11px] font-bold text-terracotta uppercase tracking-wider">
            {isTeacher ? 'Faculty Portal' : 'Student Workspace'}
          </span>
          <span className="w-2 h-2 rounded-full bg-turmeric animate-ping" />
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                  isActive
                    ? 'bg-gradient-to-r from-terracotta to-[#B04029] text-white shadow-md shadow-terracotta/25'
                    : 'text-matti/80 hover:bg-white/60 hover:text-terracotta'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-turmeric" />
                  )}
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-terracotta'}`} />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Traditional Art Aesthetic Footer Card */}
      <div className="relative p-5 rounded-2xl glass-panel-elevated border border-turmeric/30 text-center overflow-hidden nakshi-ribbon-top shadow-xs">
        <div className="flex justify-center mb-2">
          <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta">
            <Sparkles className="w-4 h-4 text-turmeric" />
          </div>
        </div>
        <div className="font-bengali text-base font-bold text-terracotta mb-1">
          জ্ঞানই সেতু
        </div>
        <p className="text-[11px] text-matti-light/90 leading-relaxed font-sans">
          "Knowledge bridges every disruption."
        </p>
      </div>
    </aside>
  );
};
