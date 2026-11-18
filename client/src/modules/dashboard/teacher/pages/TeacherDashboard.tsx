import React from 'react';
import { StudentHealthCard } from '../components/StudentHealthCard';
import { StatsCard } from '../../student/components/StatsCard';
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const students = [
    {
      id: 's1',
      name: 'Anika Rahman',
      studentClass: 'Class 9-A',
      disruptionReason: 'Sylhet Flash Flood (4 Days)',
      gapCount: 3,
      planStatus: 'approved' as const,
      recoveryProgress: 60,
    },
    {
      id: 's2',
      name: 'Tanvir Hossain',
      studentClass: 'Class 9-A',
      disruptionReason: 'Severe Typhoid (6 Days)',
      gapCount: 4,
      planStatus: 'pending' as const,
      recoveryProgress: 20,
    },
    {
      id: 's3',
      name: 'Nusrat Jahan',
      studentClass: 'Class 9-B',
      disruptionReason: 'Sunamganj Road Inundation',
      gapCount: 2,
      planStatus: 'pending' as const,
      recoveryProgress: 10,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-matti">
          Teacher Command Center & Class Recovery
        </h1>
        <p className="text-sm text-matti-light mt-1">
          Monitor students affected by weather or illness disruptions and greenlight personalized recovery pathways.
        </p>
      </div>

      {/* Class Level Recovery Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Students"
          value="42"
          subtext="Class 9 Section A & B"
          icon={Users}
          variant="river"
        />
        <StatsCard
          label="Students with Disruptions"
          value="7"
          subtext="16% of cohort affected"
          icon={AlertTriangle}
          variant="terracotta"
        />
        <StatsCard
          label="Pending Plan Approvals"
          value="2"
          subtext="Requires teacher review"
          icon={Clock}
          variant="turmeric"
        />
        <StatsCard
          label="Successfully Recovered"
          value="5"
          subtext="Gaps closed this month"
          icon={CheckCircle}
          variant="lotus"
        />
      </div>

      {/* Student List Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading text-xl font-bold text-matti">
            Disrupted Students Roster
          </h2>
          <span className="text-xs text-matti-light">
            Showing students with detected knowledge gaps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentHealthCard key={student.id} {...student} />
          ))}
        </div>
      </div>
    </div>
  );
};
