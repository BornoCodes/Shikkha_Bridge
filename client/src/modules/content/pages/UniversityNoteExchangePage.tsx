import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Badge } from '../../../shared/components/ui/Badge';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Star,
  Clock,
  AlertTriangle,
  Upload,
  Plus,
  Users,
  Search,
  ExternalLink,
  GraduationCap,
  MessageCircle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { NoteRequest, SharedNote, StudentTutor } from '../../../shared/types';

export const UniversityNoteExchangePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'requests' | 'tutors'>('notes');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<NoteRequest | null>(null);

  // Form states for requesting notes
  const [reqCourseCode, setReqCourseCode] = useState('CSE220');
  const [reqSubject, setReqSubject] = useState('Data Structures & Algorithms');
  const [reqTopic, setReqTopic] = useState('');
  const [reqDesc, setReqDesc] = useState('');

  // Form states for uploading note to fulfill request
  const [noteTitle, setNoteTitle] = useState('');
  const [noteUrl, setNoteUrl] = useState('');

  // Sample Note Requests (Strict Rule: Only requested topics can receive uploads)
  const [requests, setRequests] = useState<NoteRequest[]>([
    {
      id: 'req-1',
      studentId: 'st-101',
      studentName: 'Farhan Kabir',
      courseCode: 'CSE220',
      subject: 'Data Structures & Algorithms',
      tier: 'university',
      topicName: 'Binary Search Trees & AVL Balance Rotations',
      description: 'Missed lectures during week 6 due to Sylhet flood disruptions. Need handwritten diagrams of left-right rotations.',
      status: 'open',
      fulfilledCount: 1,
      createdAt: '3 days ago',
    },
    {
      id: 'req-2',
      studentId: 'st-102',
      studentName: 'Tasnim Ahmed',
      courseCode: 'MAT110',
      subject: 'Differential & Integral Calculus',
      tier: 'university',
      topicName: 'Partial Fractions & Integration by Parts',
      description: 'Need step-by-step solved sample questions for upcoming midterms.',
      status: 'open',
      fulfilledCount: 0,
      createdAt: 'Yesterday',
    },
    {
      id: 'req-3',
      studentId: 'st-103',
      studentName: 'Sadia Jahan',
      courseCode: 'EEE201',
      subject: 'Circuit Analysis',
      tier: 'university',
      topicName: 'Thevenin and Norton Equivalent Circuits',
      description: 'Looking for laboratory experiment calculations sheet.',
      status: 'fulfilled',
      fulfilledCount: 2,
      createdAt: '5 days ago',
    },
  ]);

  // Sample Uploaded Shared Notes with 30-Day and >5 Star Purge System
  const [notes, setNotes] = useState<SharedNote[]>([
    {
      id: 'note-1',
      requestId: 'req-1',
      title: 'AVL Tree Rotations Complete Illustrated Cheatsheet',
      courseCode: 'CSE220',
      subject: 'Data Structures',
      tier: 'university',
      uploaderId: 'tutor-1',
      uploaderName: 'Tanvir Hasan',
      uploaderRole: 'student_tutor',
      url: 'https://example.com/avl-notes',
      rating: 5.0,
      starCount: 8,
      daysRemaining: 24,
      createdAt: '6 days ago',
    },
    {
      id: 'note-2',
      requestId: 'req-3',
      title: 'Thevenin Circuit Solved Theorems & Exam Proofs',
      courseCode: 'EEE201',
      subject: 'Circuit Analysis',
      tier: 'university',
      uploaderId: 'st-4',
      uploaderName: 'Anika Rahman',
      uploaderRole: 'student',
      url: 'https://example.com/thevenin-notes',
      rating: 4.8,
      starCount: 6,
      daysRemaining: 18,
      createdAt: '12 days ago',
    },
    {
      id: 'note-3',
      requestId: 'req-2',
      title: 'Calculus Integration Shortcuts & Substitution Sheet',
      courseCode: 'MAT110',
      subject: 'Calculus',
      tier: 'university',
      uploaderId: 'st-5',
      uploaderName: 'Rafiqul Islam',
      uploaderRole: 'student',
      url: 'https://example.com/calculus-notes',
      rating: 3.5,
      starCount: 3,
      daysRemaining: 5,
      isWarningPurge: true,
      createdAt: '25 days ago',
    },
  ]);

  // Student Tutors Directory
  const [tutors, setTutors] = useState<StudentTutor[]>([
    {
      id: 'tut-1',
      name: 'Tanvir Hasan',
      university: 'Shahjalal University of Science and Technology (SUST)',
      major: 'Computer Science & Engineering',
      year: 'Senior (4th Year)',
      subjects: ['Data Structures (CSE220)', 'Algorithms (CSE221)', 'Discrete Math'],
      rating: 4.9,
      sessionCount: 28,
      avatar: 'T',
      bio: 'Peer tutor specialized in helping students recover missed programming and mathematical concepts after floods in the Sylhet division.',
      availableStatus: 'online',
    },
    {
      id: 'tut-2',
      name: 'Nusrat Jahan',
      university: 'BUET',
      major: 'Electrical & Electronic Engineering',
      year: '3rd Year',
      subjects: ['Circuit Analysis', 'Signals & Systems', 'Electromagnetics'],
      rating: 4.8,
      sessionCount: 19,
      avatar: 'N',
      bio: 'Passionate about breaking down circuit theorems into clear visual intuition. Happy to pair with students returning from medical absences.',
      availableStatus: 'online',
    },
  ]);

  // Star Rating Handler
  const handleGiveStar = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          const newStars = n.starCount + 1;
          toast.success(`You gave a star! Total stars: ${newStars}`);
          return {
            ...n,
            starCount: newStars,
            isWarningPurge: newStars < 5 && n.daysRemaining <= 7,
          };
        }
        return n;
      })
    );
  };

  // Submit Note Request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTopic.trim()) {
      toast.error('Please enter the topic name');
      return;
    }
    const newReq: NoteRequest = {
      id: `req-${Date.now()}`,
      studentId: 'curr-student',
      studentName: 'Me (Disrupted Student)',
      courseCode: reqCourseCode,
      subject: reqSubject,
      tier: 'university',
      topicName: reqTopic,
      description: reqDesc,
      status: 'open',
      fulfilledCount: 0,
      createdAt: 'Just now',
    };
    setRequests([newReq, ...requests]);
    toast.success('Topic note request posted! Student Tutors and peers can now upload.');
    setRequestModalOpen(false);
    setReqTopic('');
    setReqDesc('');
  };

  // Fulfill Request with Note Upload
  const handleFulfillUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteUrl.trim()) {
      toast.error('Please fill in title and material link');
      return;
    }
    const newNote: SharedNote = {
      id: `note-${Date.now()}`,
      requestId: selectedRequest?.id || 'req-custom',
      title: noteTitle,
      courseCode: selectedRequest?.courseCode || 'GEN101',
      subject: selectedRequest?.subject || 'University Studies',
      tier: 'university',
      uploaderId: 'curr-uploader',
      uploaderName: 'Me (Student Tutor)',
      uploaderRole: 'student_tutor',
      url: noteUrl,
      rating: 5.0,
      starCount: 1, // Starts with 1 star, has 30 days to reach > 5 stars
      daysRemaining: 30,
      createdAt: 'Just now',
    };
    setNotes([newNote, ...notes]);

    // Update request count
    if (selectedRequest) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id
            ? { ...r, fulfilledCount: r.fulfilledCount + 1, status: 'fulfilled' }
            : r
        )
      );
    }

    toast.success('Notes uploaded! 30-day grace period started: Needs > 5 stars to stay permanently.');
    setUploadModalOpen(false);
    setNoteTitle('');
    setNoteUrl('');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel-elevated p-8 rounded-3xl border border-white/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 nakshi-ribbon-bottom">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[11px] font-bold text-terracotta mb-2 border border-terracotta/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>University & Higher Education Hub</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-matti">
            Peer Note Exchange & Student Tutors
          </h1>
          <p className="text-xs sm:text-sm text-matti-light mt-1">
            Request-driven study resources with strict quality verification (30-day purge rule) & 1-on-1 Student Tutors.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setRequestModalOpen(true)}
            variant="primary"
            size="md"
            className="shadow-md shadow-terracotta/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Request Notes for a Topic
          </Button>
        </div>
      </div>

      {/* Strict Quality Policy Alert Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-turmeric/40 flex items-start gap-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-matti">
          <strong className="text-terracotta font-bold">ShikkhaBridge Quality Governance Rule:</strong>{' '}
          To eliminate clutter, notes can only be uploaded in response to open student requests. Uploaded notes receive a{' '}
          <span className="font-bold underline decoration-turmeric">30-day trial period</span>; if a note does not earn more than{' '}
          <strong>5 stars</strong> from peer scholars within 30 days, it is automatically purged.
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-parchment-dark/60 gap-4">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-3 text-sm font-bold transition-all relative ${
            activeTab === 'notes'
              ? 'text-terracotta'
              : 'text-matti-light hover:text-matti'
          }`}
        >
          <span>Community Notes ({notes.length})</span>
          {activeTab === 'notes' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-3 text-sm font-bold transition-all relative ${
            activeTab === 'requests'
              ? 'text-terracotta'
              : 'text-matti-light hover:text-matti'
          }`}
        >
          <span>Requested Topics ({requests.length})</span>
          {activeTab === 'requests' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('tutors')}
          className={`pb-3 px-3 text-sm font-bold transition-all relative ${
            activeTab === 'tutors'
              ? 'text-terracotta'
              : 'text-matti-light hover:text-matti'
          }`}
        >
          <span>Student Tutors Directory ({tutors.length})</span>
          {activeTab === 'tutors' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: Shared Notes with Star Rating & Purge Timer */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => {
            const isPermanent = note.starCount > 5;
            return (
              <div
                key={note.id}
                className={`glass-panel-elevated p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 ${
                  note.isWarningPurge
                    ? 'border-rose-400/50 bg-rose-50/15'
                    : 'border-white/80 hover:border-terracotta/40'
                }`}
              >
                <div>
                  {/* Top Bar with Course Code & Star Count */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-terracotta/10 text-terracotta font-mono font-bold text-xs border border-terracotta/20">
                      {note.courseCode}
                    </span>

                    <button
                      onClick={() => handleGiveStar(note.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-turmeric/15 text-turmeric-dark text-xs font-bold border border-turmeric/30 hover:scale-105 active:scale-95 transition-transform"
                      title="Click to give this note a star!"
                    >
                      <Star className="w-3.5 h-3.5 fill-turmeric text-turmeric" />
                      <span>{note.starCount} Stars</span>
                    </button>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-matti mb-1 leading-snug">
                    {note.title}
                  </h3>
                  <p className="text-xs text-matti-light mb-4">{note.subject}</p>

                  <div className="text-[11px] text-matti-light glass-panel p-2.5 rounded-xl border border-white/70 mb-4 flex items-center justify-between">
                    <span>By {note.uploaderName}</span>
                    <span className="capitalize font-semibold text-terracotta">
                      {note.uploaderRole.replace('_', ' ')}
                    </span>
                  </div>

                  {/* 30-Day Expiry / Purge Rule Status */}
                  <div className="p-2.5 rounded-xl text-xs mb-4">
                    {isPermanent ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <span>✓ Verified Permanent (Earned &gt; 5 Stars)</span>
                      </div>
                    ) : note.isWarningPurge ? (
                      <div className="flex items-center gap-1.5 text-rose-700 font-bold bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-300 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Purge Warning: {note.daysRemaining} days left to get &gt;5 stars!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-turmeric-dark" />
                        <span>Trial: {note.daysRemaining} days left ({5 - note.starCount} stars needed)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-parchment-dark/50 flex items-center justify-between">
                  <button
                    onClick={() => handleGiveStar(note.id)}
                    className="text-xs font-bold text-turmeric-dark hover:underline flex items-center gap-1"
                  >
                    <span>⭐ Rate +1 Star</span>
                  </button>

                  <a
                    href={note.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-terracotta hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open Material</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Open Topic Requests (Upload permitted ONLY for requests) */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-matti-light">
              Students post requests for missed concepts; tutors and peers can upload specifically for them.
            </p>
            <Button onClick={() => setRequestModalOpen(true)} variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Post New Request
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-terracotta/10 text-terracotta font-mono font-bold text-xs border border-terracotta/20">
                      {req.courseCode}
                    </span>
                    <Badge
                      variant={req.status === 'open' ? 'turmeric' : 'success'}
                      size="sm"
                    >
                      {req.status === 'open' ? 'AWAITING NOTES' : 'FULFILLED ✓'}
                    </Badge>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-matti mb-1">
                    {req.topicName}
                  </h3>
                  <p className="text-xs text-matti-light mb-3">{req.subject}</p>

                  <p className="text-xs text-matti/90 leading-relaxed glass-panel p-3 rounded-xl border border-white/80 mb-4">
                    "{req.description}"
                  </p>

                  <div className="text-[11px] text-matti-light">
                    Requested by <strong>{req.studentName}</strong> • {req.createdAt}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-parchment-dark/50 flex items-center justify-between">
                  <span className="text-xs text-matti-light">
                    {req.fulfilledCount} Submissions
                  </span>

                  <Button
                    onClick={() => {
                      setSelectedRequest(req);
                      setNoteTitle(`Solved Notes: ${req.topicName}`);
                      setUploadModalOpen(true);
                    }}
                    variant="primary"
                    size="sm"
                    className="shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    <span>Upload Notes for this Topic</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Student Tutors Directory */}
      {activeTab === 'tutors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutors.map((tut) => (
            <div
              key={tut.id}
              className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-terracotta to-turmeric text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                    {tut.avatar}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-lg text-matti">
                        {tut.name}
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-xs text-matti font-medium">{tut.university}</p>
                    <p className="text-[11px] text-matti-light">
                      {tut.major} • {tut.year}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-matti-light leading-relaxed mb-4 glass-panel p-3 rounded-xl border border-white/70">
                  "{tut.bio}"
                </p>

                <div className="mb-4">
                  <span className="text-[11px] font-bold text-terracotta uppercase tracking-wider block mb-1.5">
                    Peer Mentorship Areas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tut.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-parchment text-[11px] font-semibold text-matti border border-parchment-dark"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-parchment-dark/50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-bold text-turmeric-dark">
                  <Star className="w-3.5 h-3.5 fill-turmeric text-turmeric" />
                  <span>{tut.rating} rating ({tut.sessionCount} sessions)</span>
                </div>

                <Button
                  onClick={() => toast.success(`Recovery study session request sent to ${tut.name}!`)}
                  variant="primary"
                  size="sm"
                  className="shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1" />
                  <span>Request Catch-Up Session</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Request Notes for a Disrupted Topic */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Request Notes for a Disrupted Topic"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Course Code"
              placeholder="e.g. CSE220"
              value={reqCourseCode}
              onChange={(e) => setReqCourseCode(e.target.value)}
              required
            />
            <Input
              label="Course Subject"
              placeholder="e.g. Algorithms"
              value={reqSubject}
              onChange={(e) => setReqSubject(e.target.value)}
              required
            />
          </div>

          <Input
            label="Specific Topic Name"
            placeholder="e.g. Recurrence Trees & Substitution Method"
            value={reqTopic}
            onChange={(e) => setReqTopic(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold text-matti mb-1">
              What do you specifically need help with?
            </label>
            <textarea
              rows={3}
              value={reqDesc}
              onChange={(e) => setReqDesc(e.target.value)}
              placeholder="e.g. Missed class on Nov 10 due to flood road closure, need handwritten solved examples..."
              className="w-full p-3 rounded-xl border border-parchment-dark bg-white/80 text-xs text-matti focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full shadow-md shadow-terracotta/20">
            Publish Request to Student Tutors & Peers
          </Button>
        </form>
      </Modal>

      {/* Modal 2: Upload Notes to Fulfill Request (Strict Rule Enforcement) */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={`Fulfill Request: ${selectedRequest?.topicName || 'Topic'}`}
      >
        <form onSubmit={handleFulfillUpload} className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            Uploading notes for request by <strong>{selectedRequest?.studentName}</strong> ({selectedRequest?.courseCode}). Note will undergo the 30-day trial rule (needs &gt; 5 stars).
          </div>

          <Input
            label="Note / Cheatsheet Title"
            placeholder="e.g. Illustrated Guide to AVL Balance"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />

          <Input
            label="File or Cloud Document URL"
            placeholder="e.g. https://drive.google.com/file/... or link"
            value={noteUrl}
            onChange={(e) => setNoteUrl(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="md" className="w-full shadow-md shadow-terracotta/20">
            Submit Notes & Start 30-Day Star Trial
          </Button>
        </form>
      </Modal>
    </div>
  );
};
