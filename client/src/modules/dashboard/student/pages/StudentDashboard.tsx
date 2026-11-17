import React from 'react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../components/StatsCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { ProgressBar } from '../../../../shared/components/ui/ProgressBar';
import { Button } from '../../../../shared/components/ui/Button';
import { Badge } from '../../../../shared/components/ui/Badge';
import {
  Compass,
  FileQuestion,
  CalendarX,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../../shared/hooks/useAuth';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Glassmorphic Bengali Art Aesthetic */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/70 glass-panel-elevated p-8 sm:p-10 nakshi-ribbon-bottom">
        {/* Subtle decorative Alpona corner SVG */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 opacity-15 pointer-events-none">
          <svg viewBox="0 0 200 200" fill="none" stroke="#C84B31" strokeWidth="2">
            <circle cx="100" cy="100" r="80" strokeDasharray="4 6" />
            <circle cx="100" cy="100" r="50" stroke="#E8A317" />
            <circle cx="100" cy="100" r="20" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-turmeric/40 text-xs font-semibold text-terracotta mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-turmeric" />
            <span>Welcome, {user?.name || 'Student'}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-matti leading-tight">
            Restoring your learning momentum.
          </h1>

          <p className="mt-2 text-matti-light text-sm font-sans leading-relaxed">
            "মেঘ দেখে কেউ করিসনে ভয়, আড়ালে তার সূর্য হাসে।"
            <span className="block text-xs text-terracotta/90 font-medium mt-1">
              Do not fear the storm; your recovery pathway is actively closing knowledge gaps.
            </span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3.5">
            <Link to="/student/recovery-plans">
              <Button variant="primary" size="sm" className="shadow-md shadow-terracotta/20">
                <span>Continue Catch-Up Path</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/student/absences">
              <Button variant="outline" size="sm" className="glass-panel border-terracotta/30 text-matti hover:bg-white/70">
                Log New Disruption
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Identified Gaps"
          value="3 Topics"
          subtext="2 High severity"
          icon={CalendarX}
          variant="terracotta"
        />
        <StatsCard
          label="Active Roadmap"
          value="60%"
          subtext="3 of 5 milestones reached"
          icon={Compass}
          variant="turmeric"
        />
        <StatsCard
          label="Quizzes Mastered"
          value="4 Quizzes"
          subtext="Avg. 82% diagnostic score"
          icon={FileQuestion}
          variant="river"
        />
        <StatsCard
          label="Recovery Streak"
          value="5 Days"
          subtext="Continuous momentum"
          icon={Flame}
          variant="lotus"
        />
      </div>

      {/* Active Recovery Plan Card & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Plan Highlight */}
        <div className="lg:col-span-2 glass-panel-elevated border border-white/80 rounded-3xl p-7 sm:p-9 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="success" size="sm">
                APPROVED BY FACULTY
              </Badge>
              <span className="text-xs text-matti-light font-medium">Target Completion: Nov 25</span>
            </div>

            <h3 className="font-heading text-2xl font-bold text-matti mb-1">
              Monsoon Catch-Up Pathway
            </h3>
            <p className="text-xs text-matti-light mb-6">
              Sequenced remedial learning bridging 4 school days missed in Sylhet.
            </p>

            <ProgressBar
              progress={60}
              label="Overall Pathway Progress"
              color="terracotta"
              height="lg"
            />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-2xl border border-white/70 shadow-xs">
                <span className="text-[11px] font-bold text-terracotta uppercase tracking-wider">Current Focus:</span>
                <p className="font-heading font-bold text-sm text-matti mt-1">
                  Periodic Trends & Valency
                </p>
                <p className="text-xs text-matti-light mt-0.5">Est. 2 hours remaining</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/70 shadow-xs">
                <span className="text-[11px] font-bold text-turmeric-dark uppercase tracking-wider">Upcoming Milestone:</span>
                <p className="font-heading font-bold text-sm text-matti mt-1">
                  Photosynthesis Reaction Cycles
                </p>
                <p className="text-xs text-matti-light mt-0.5">Peer notes available in library</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-parchment-dark/50 flex justify-end">
            <Link to="/student/recovery-plans/plan-nov-2026">
              <Button variant="primary" size="md" className="shadow-md shadow-terracotta/20">
                <span>Enter Interactive Journey</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Activity Feed */}
        <ActivityFeed
          items={[
            {
              id: 'a1',
              title: 'Mastered Newtonian Laws milestone',
              timestamp: '2 hours ago',
              type: 'milestone',
            },
            {
              id: 'a2',
              title: 'Completed Physics diagnostic quiz (80%)',
              timestamp: 'Yesterday',
              type: 'quiz',
            },
            {
              id: 'a3',
              title: 'Faculty approved your Catch-Up plan',
              timestamp: '2 days ago',
              type: 'plan',
            },
            {
              id: 'a4',
              title: 'Recorded 3 days absence due to flood',
              timestamp: '4 days ago',
              type: 'absence',
            },
          ]}
        />
      </div>
    </div>
  );
};
