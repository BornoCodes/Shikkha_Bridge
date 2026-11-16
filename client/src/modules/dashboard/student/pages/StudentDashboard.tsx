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
} from 'lucide-react';
import { useAuth } from '../../../../shared/hooks/useAuth';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Bengali Proverb */}
      <div className="bg-gradient-to-r from-terracotta via-terracotta-dark to-matti text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-turmeric" />
            <span>Welcome back, {user?.name || 'Student'}!</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-bold leading-tight">
            You're bridging your learning gaps.
          </h1>

          <p className="mt-2 text-white/80 text-sm font-sans leading-relaxed">
            "মেঘ দেখে কেউ করিসনে ভয়, আড়ালে তার সূর্য হাসে।"
            <span className="block text-xs text-white/60 mt-0.5">
              Do not fear the dark clouds; behind them smiles the radiant sun.
            </span>
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/student/recovery-plans">
              <Button variant="secondary" size="sm">
                <span>Continue Catch-Up Path</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/student/absences">
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Log Absence
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Detected Gaps"
          value="3 Topics"
          subtext="2 High priority"
          icon={CalendarX}
          variant="terracotta"
        />
        <StatsCard
          label="Active Recovery Path"
          value="60%"
          subtext="3 of 5 steps completed"
          icon={Compass}
          variant="turmeric"
        />
        <StatsCard
          label="Quizzes Taken"
          value="4 Quizzes"
          subtext="Avg. 82% diagnostic score"
          icon={FileQuestion}
          variant="river"
        />
        <StatsCard
          label="Learning Streak"
          value="5 Days"
          subtext="Keep the momentum going!"
          icon={Flame}
          variant="lotus"
        />
      </div>

      {/* Active Recovery Plan Card & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Plan Highlight */}
        <div className="lg:col-span-2 bg-cream border border-parchment-dark rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="success" size="sm">
                APPROVED BY FARUK SIR
              </Badge>
              <span className="text-xs text-matti-light">Due by Nov 25</span>
            </div>

            <h3 className="font-heading text-2xl font-bold text-matti mb-2">
              Monsoon Flood Catch-Up Pathway
            </h3>
            <p className="text-xs text-matti-light mb-6">
              Sequenced remedial roadmap bridging 4 school days missed in Sylhet.
            </p>

            <ProgressBar
              progress={60}
              label="Overall Recovery Progress"
              color="terracotta"
              height="lg"
            />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-parchment p-4 rounded-2xl border border-parchment-dark">
                <span className="text-xs font-bold text-terracotta uppercase">Current Step:</span>
                <p className="font-heading font-bold text-sm text-matti mt-1">
                  Periodic Trends & Valency
                </p>
                <p className="text-xs text-matti-light mt-0.5">Est. 2 hours remaining</p>
              </div>

              <div className="bg-parchment p-4 rounded-2xl border border-parchment-dark">
                <span className="text-xs font-bold text-turmeric uppercase">Next Step:</span>
                <p className="font-heading font-bold text-sm text-matti mt-1">
                  Photosynthesis Reaction Cycles
                </p>
                <p className="text-xs text-matti-light mt-0.5">Peer summary available</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-parchment-dark flex justify-end">
            <Link to="/student/recovery-plans/plan-nov-2026">
              <Button variant="primary" size="md">
                <span>Open Full Interactive Pathway</span>
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
              title: 'Faruk Sir approved your Catch-Up plan',
              timestamp: '2 days ago',
              type: 'plan',
            },
            {
              id: 'a4',
              title: 'Logged 3 days absence due to flood',
              timestamp: '4 days ago',
              type: 'absence',
            },
          ]}
        />
      </div>
    </div>
  );
};
