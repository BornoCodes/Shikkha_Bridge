import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../../../shared/components/ui/Button';
import { Badge } from '../../../../shared/components/ui/Badge';
import { toast } from 'react-hot-toast';
import {
  Check,
  X,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Clock,
  BookOpen,
  Calendar,
} from 'lucide-react';

export const PlanApprovalPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacherNotes, setTeacherNotes] = useState(
    'Great sequence proposed by AI. Please emphasize Chapter 3 factorization exercises before physics kinetics.'
  );

  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const student = {
    name: 'Tanvir Hossain',
    class: 'Class 9-A',
    disruptionReason: 'Severe Typhoid (6 School Days Missed)',
    datesMissed: 'Nov 02 to Nov 08, 2026',
    school: 'Sylhet Model High School',
  };

  const planSteps = [
    {
      order: 1,
      topic: 'Algebraic Polynomials & Factorization',
      subject: 'Mathematics',
      hours: 2.5,
      reasoning: 'Essential foundation for upcoming term midterms.',
      content: 'Video Tutorial + Handwritten notes by Farhan',
    },
    {
      order: 2,
      topic: 'Newtonian Laws of Motion & Friction',
      subject: 'Physics',
      hours: 3.0,
      reasoning: 'Core concepts missed during class demonstration.',
      content: 'Lab Simulation + Chapter 4 summary',
    },
    {
      order: 3,
      topic: 'Acids, Bases & pH Indicators',
      subject: 'Chemistry',
      hours: 2.0,
      reasoning: 'Prerequisite for chemical reactions unit.',
      content: 'Practice questions + Chemistry cheat-sheet',
    },
  ];

  const handleApprove = () => {
    setStatus('approved');
    toast.success(`Catch-Up Plan for ${student.name} Approved! Student notified.`);
    setTimeout(() => navigate('/teacher/dashboard'), 1500);
  };

  const handleReject = () => {
    setStatus('rejected');
    toast.error(`Plan returned to student with teacher guidance notes.`);
    setTimeout(() => navigate('/teacher/dashboard'), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/teacher/dashboard"
        className="text-xs font-semibold text-matti-light hover:text-terracotta inline-flex items-center gap-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Teacher Dashboard</span>
      </Link>

      {/* Student Disruption Info Header */}
      <div className="bg-cream border border-parchment-dark rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="turmeric" size="sm">
              PENDING TEACHER REVIEW
            </Badge>
            <span className="text-xs text-matti-light">{student.class}</span>
          </div>

          <h1 className="font-heading text-3xl font-bold text-matti">
            Review Catch-Up Plan: {student.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-matti-light">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-terracotta" />
              <span>{student.disruptionReason}</span>
            </div>
            <span>•</span>
            <span>{student.datesMissed}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button onClick={handleReject} variant="outline" size="sm" className="border-rose-300 text-rose-700 hover:bg-rose-50">
            <X className="w-4 h-4 mr-1" />
            Request Modification
          </Button>

          <Button onClick={handleApprove} variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Check className="w-4 h-4 mr-1" />
            Approve & Greenlight
          </Button>
        </div>
      </div>

      {/* AI Generated Sequence */}
      <div className="bg-cream border border-parchment-dark rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-xl text-matti flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-turmeric" />
            <span>AI Sequenced Catch-Up Milestones</span>
          </h3>
          <span className="text-xs text-matti-light">Total: 7.5 Hours</span>
        </div>

        <div className="space-y-4 mt-4">
          {planSteps.map((step) => (
            <div
              key={step.order}
              className="p-5 rounded-2xl bg-parchment/60 border border-parchment-dark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center font-heading font-bold text-base shrink-0">
                  {step.order}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-terracotta uppercase">
                      {step.subject}
                    </span>
                    <span className="text-xs text-matti-light">• {step.hours} hrs</span>
                  </div>
                  <h4 className="font-heading font-bold text-matti text-lg mt-0.5">
                    {step.topic}
                  </h4>
                  <p className="text-xs text-matti-light mt-1">
                    "{step.reasoning}"
                  </p>
                  <div className="text-[11px] text-matti mt-2 font-medium">
                    Recommended Resources: {step.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Guidance Notes Input */}
      <div className="bg-cream border border-parchment-dark rounded-3xl p-6 sm:p-8 shadow-xs">
        <h3 className="font-heading font-bold text-lg text-matti mb-2 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-terracotta" />
          <span>Teacher's Guidance Notes & Hints for Student</span>
        </h3>
        <p className="text-xs text-matti-light mb-4">
          These personal hints will be visibly highlighted on the student's learning story map.
        </p>

        <textarea
          rows={3}
          value={teacherNotes}
          onChange={(e) => setTeacherNotes(e.target.value)}
          className="w-full p-4 rounded-2xl border border-parchment-dark bg-parchment/40 text-sm text-matti focus:outline-none focus:ring-2 focus:ring-terracotta/40 leading-relaxed"
          placeholder="Add personalized encouraging comments or study instructions..."
        />
      </div>
    </div>
  );
};
