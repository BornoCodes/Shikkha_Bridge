import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  FileQuestion,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { BengaliArtBackground } from './BengaliArtBackground';
import { Navbar } from './Navbar';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-matti selection:bg-terracotta selection:text-white relative overflow-hidden flex flex-col">
      {/* Animated Traditional Bengali Art Background */}
      <BengaliArtBackground />

      {/* Top Glass Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        {/* Sleek Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-turmeric/40 text-xs font-semibold text-terracotta mb-6 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-turmeric animate-pulse" />
          <span>Intelligent Learning Recovery & Continuity Platform</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-matti tracking-tight leading-[1.12] max-w-4xl mx-auto"
        >
          Recover learning continuity after{' '}
          <span className="relative inline-block text-terracotta">
            floods or illness
            <span className="absolute left-0 bottom-1.5 w-full h-3 bg-turmeric/25 -z-10 rounded-sm transform -rotate-1" />
          </span>
          .
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-matti-light/90 max-w-2xl mx-auto leading-relaxed font-sans"
        >
          When monsoon floods or disruptions cause missed school days,{' '}
          <strong className="text-matti font-semibold">ShikkhaBridge</strong> maps missed syllabus topics, assesses student grasp with diagnostic checks, and generates teacher-approved recovery paths.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center items-center gap-4"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-terracotta to-[#B04029] hover:from-[#B04029] hover:to-terracotta text-white font-semibold text-base shadow-lg shadow-terracotta/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Start Learning Recovery</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-panel hover:bg-white/80 border border-white/70 text-matti font-semibold text-base transition-all hover:border-terracotta/30"
          >
            <span>Sign In to Portal</span>
          </Link>
        </motion.div>
      </section>

      {/* Interactive Story-Map Stepping Stone Journey (Glassmorphism + Nakshi Art) */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-10 w-full">
        <div className="glass-panel-elevated rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-white/80 nakshi-ribbon-top">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-terracotta uppercase tracking-wider">
              Empathetic Recovery Workflow
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-matti mt-1">
              From Disruption to Confident Catch-Up
            </h2>
            <p className="text-sm text-matti-light/90 mt-2">
              Every missed lesson is treated as a stepping-stone across the bridge of learning.
            </p>
          </div>

          {/* Stepping Stones 4-Phase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/70 flex flex-col justify-between hover:border-terracotta/30 transition-all hover:-translate-y-1 shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-bold text-terracotta uppercase tracking-wider">Phase 1</span>
                  <span className="text-matti-light/40">•</span>
                  <span className="text-[11px] font-bengali text-matti-light">চিহ্নিতকরণ</span>
                </div>
                <h3 className="font-heading font-bold text-matti text-lg mb-1.5">Disruption Logged</h3>
                <p className="text-xs text-matti-light/90 leading-relaxed">
                  Absence recorded with real-world cause (e.g. flood inundation or illness). Automatically maps to scheduled curriculum.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-parchment-dark/40 text-[11px] font-semibold text-terracotta">
                Automated Syllabus Mapping
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/70 flex flex-col justify-between hover:border-terracotta/30 transition-all hover:-translate-y-1 shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-turmeric/15 text-turmeric-dark border border-turmeric/30 flex items-center justify-center mb-4">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-bold text-turmeric-dark uppercase tracking-wider">Phase 2</span>
                  <span className="text-matti-light/40">•</span>
                  <span className="text-[11px] font-bengali text-matti-light">মূল্যায়ন</span>
                </div>
                <h3 className="font-heading font-bold text-matti text-lg mb-1.5">Diagnostic Quiz</h3>
                <p className="text-xs text-matti-light/90 leading-relaxed">
                  Adaptive 5-question micro-assessments measure foundational grasp without overwhelming the student.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-parchment-dark/40 text-[11px] font-semibold text-turmeric-dark">
                Targeted Knowledge Check
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/70 flex flex-col justify-between hover:border-terracotta/30 transition-all hover:-translate-y-1 shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-river/15 text-river border border-river/30 flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-bold text-river uppercase tracking-wider">Phase 3</span>
                  <span className="text-matti-light/40">•</span>
                  <span className="text-[11px] font-bengali text-matti-light">পুনরুদ্ধার পথ</span>
                </div>
                <h3 className="font-heading font-bold text-matti text-lg mb-1.5">Adaptive Roadmap</h3>
                <p className="text-xs text-matti-light/90 leading-relaxed">
                  Sequences prerequisite topics first, allocating realistic daily hours with curated peer summaries.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-parchment-dark/40 text-[11px] font-semibold text-river">
                Personalized Step Sequence
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/70 flex flex-col justify-between hover:border-terracotta/30 transition-all hover:-translate-y-1 shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Phase 4</span>
                  <span className="text-matti-light/40">•</span>
                  <span className="text-[11px] font-bengali text-matti-light">শিক্ষকের অনুমোদন</span>
                </div>
                <h3 className="font-heading font-bold text-matti text-lg mb-1.5">Teacher Sign-Off</h3>
                <p className="text-xs text-matti-light/90 leading-relaxed">
                  Subject teachers inspect gaps, attach personalized hints, and greenlight recovery before exams.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-parchment-dark/40 text-[11px] font-semibold text-emerald-700">
                Direct Teacher Guidance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Pillars with Clean Arranged Layout */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-terracotta uppercase tracking-wider">
            Built For Real Classrooms
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-matti mt-1">
            Core Recovery Capabilities
          </h2>
          <p className="text-sm text-matti-light/90 mt-2">
            Structured tools ensuring every student regains academic momentum after disruptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/70 hover:border-terracotta/40 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bengali text-lg font-bold mb-4">
              ১
            </div>
            <h4 className="font-heading font-bold text-matti text-lg mb-2">Absence & Gap Engine</h4>
            <p className="text-xs text-matti-light/90 leading-relaxed">
              Logs disruption events (monsoons, floods, illness) and calculates knowledge deficit chains against the curriculum.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/70 hover:border-turmeric/40 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-turmeric/15 text-turmeric-dark flex items-center justify-center font-bengali text-lg font-bold mb-4">
              ২
            </div>
            <h4 className="font-heading font-bold text-matti text-lg mb-2">Diagnostic Assessments</h4>
            <p className="text-xs text-matti-light/90 leading-relaxed">
              Calibrated diagnostic quizzes evaluate conceptual gaps and pinpoint prerequisite weaknesses.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/70 hover:border-river/40 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-river/15 text-river flex items-center justify-center font-bengali text-lg font-bold mb-4">
              ৩
            </div>
            <h4 className="font-heading font-bold text-matti text-lg mb-2">Adaptive Catch-Up</h4>
            <p className="text-xs text-matti-light/90 leading-relaxed">
              Sequenced milestones balance student workload and recovery deadlines with interactive progress tracking.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/70 hover:border-lotus/40 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-lotus/15 text-lotus-dark flex items-center justify-center font-bengali text-lg font-bold mb-4">
              ৪
            </div>
            <h4 className="font-heading font-bold text-matti text-lg mb-2">Teacher & Peer Bridge</h4>
            <p className="text-xs text-matti-light/90 leading-relaxed">
              Teacher plan sign-off, peer note sharing, and collaborative recovery resources in one central hub.
            </p>
          </div>
        </div>
      </section>

      {/* Cultural Bengali Heritage Aesthetic Footer */}
      <footer className="relative z-10 border-t border-terracotta/20 glass-panel py-10 px-6 mt-auto nakshi-ribbon-top">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta text-white flex items-center justify-center font-bengali text-lg font-bold">
              সে
            </div>
            <div>
              <div className="font-heading font-bold text-base text-matti">
                ShikkhaBridge • শিক্ষার সেতু
              </div>
              <p className="text-[11px] text-matti-light">
                Education Recovery & Continuity System
              </p>
            </div>
          </div>

          <div className="font-bengali text-sm text-terracotta font-medium italic">
            "মেঘ দেখে কেউ করিসনে ভয়, আড়ালে তার সূর্য হাসে।"
          </div>

          <div className="text-xs text-matti-light/80">
            Empowering students and teachers across Bangladesh
          </div>
        </div>
      </footer>
    </div>
  );
};
