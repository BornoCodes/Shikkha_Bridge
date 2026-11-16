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
  HeartHandshake,
  BookOpen,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream text-matti selection:bg-terracotta selection:text-white relative overflow-hidden">
      {/* Nakshi-Kantha styled top border stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-terracotta via-turmeric to-terracotta" />

      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-md transform rotate-1 hover:rotate-0 transition-transform">
            <span className="font-bengali text-2xl font-bold">সে</span>
          </div>
          <div>
            <span className="font-heading text-2xl font-bold tracking-tight text-matti">
              Shikkha<span className="text-terracotta">Bridge</span>
            </span>
            <p className="text-xs text-matti-light tracking-wide font-bengali">
              শিক্ষার সেতু • Learning Recovery System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-matti hover:text-terracotta transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold text-white bg-terracotta hover:bg-terracotta-dark px-5 py-2.5 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-parchment border border-parchment-dark text-xs font-medium text-terracotta mb-6"
        >
          <Sparkles className="w-4 h-4 text-turmeric" />
          <span>CSE470 Capstone • Bridging Learning Gaps from Disruptions</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-matti tracking-tight leading-tight max-w-4xl mx-auto"
        >
          No student left behind after <span className="text-terracotta underline decoration-turmeric/60 underline-offset-8">floods or illness</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-matti-light max-w-2xl mx-auto leading-relaxed font-sans"
        >
          When monsoon floods or sudden illness cause missed school days,{' '}
          <strong className="text-matti font-semibold">ShikkhaBridge</strong> maps missed syllabus topics, tests student grasp, and generates teacher-approved personalized catch-up journeys.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-terracotta text-white font-semibold text-base shadow-md hover:bg-terracotta-dark transition-all transform hover:-translate-y-0.5"
          >
            <span>Start Recovery Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-parchment hover:bg-parchment-dark border border-parchment-dark text-matti font-semibold text-base transition-colors"
          >
            Explore Teacher Dashboard
          </Link>
        </motion.div>
      </section>

      {/* Whimsical Story-Map Preview Showcase */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-parchment/60 border-2 border-dashed border-terracotta/25 rounded-3xl p-8 sm:p-12 relative shadow-inner">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-matti">
              The Bengali Art-Inspired Learning Path
            </h2>
            <p className="text-sm text-matti-light mt-1">
              Missed lessons aren't stressful lists — they're visual stepping-stones across a river of learning.
            </p>
          </div>

          {/* Stepping Stones Interactive Path Illustration */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-cream rounded-2xl p-6 border border-parchment-dark shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider mb-1">Step 1</span>
              <h3 className="font-heading font-bold text-matti mb-1">Disruption Logged</h3>
              <p className="text-xs text-matti-light">
                7 days missed due to Sylhet flash floods. 4 syllabus topics automatically flagged.
              </p>
            </div>

            <div className="bg-cream rounded-2xl p-6 border border-parchment-dark shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <FileQuestion className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-turmeric uppercase tracking-wider mb-1">Step 2</span>
              <h3 className="font-heading font-bold text-matti mb-1">Diagnostic Quiz</h3>
              <p className="text-xs text-matti-light">
                AI generates a 5-question micro-quiz to pinpoint exact conceptual weak spots.
              </p>
            </div>

            <div className="bg-cream rounded-2xl p-6 border border-parchment-dark shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-river flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-river uppercase tracking-wider mb-1">Step 3</span>
              <h3 className="font-heading font-bold text-matti mb-1">Adaptive Roadmap</h3>
              <p className="text-xs text-matti-light">
                Gemini AI sequences bite-sized remedial lessons with peer notes and video summaries.
              </p>
            </div>

            <div className="bg-cream rounded-2xl p-6 border border-parchment-dark shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Step 4</span>
              <h3 className="font-heading font-bold text-matti mb-1">Teacher Approved</h3>
              <p className="text-xs text-matti-light">
                Class teacher reviews the student's plan, adds personalized hints, and greenlights recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Pillars for Team Presentation */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-matti">
            Engineered for Real Classroom Recovery
          </h2>
          <p className="text-sm text-matti-light mt-2 max-w-xl mx-auto">
            Modular architecture designed for rapid deployment, collaborative Git workflows, and independent feature scaling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-cream border border-parchment-dark p-6 rounded-2xl hover:border-terracotta/40 transition-colors">
            <div className="text-terracotta font-bengali text-2xl font-bold mb-2">১</div>
            <h4 className="font-heading font-bold text-matti text-lg mb-2">Absence & Gap Engine</h4>
            <p className="text-xs text-matti-light leading-relaxed">
              Logs specific disruption causes (floods, health emergencies) and computes knowledge deficit graphs.
            </p>
          </div>

          <div className="bg-cream border border-parchment-dark p-6 rounded-2xl hover:border-turmeric/40 transition-colors">
            <div className="text-turmeric font-bengali text-2xl font-bold mb-2">২</div>
            <h4 className="font-heading font-bold text-matti text-lg mb-2">Diagnostic AI Quizzes</h4>
            <p className="text-xs text-matti-light leading-relaxed">
              Calibrated multiple-choice diagnostic checks generated via FastAPI and Gemini LLM.
            </p>
          </div>

          <div className="bg-cream border border-parchment-dark p-6 rounded-2xl hover:border-river/40 transition-colors">
            <div className="text-river font-bengali text-2xl font-bold mb-2">৩</div>
            <h4 className="font-heading font-bold text-matti text-lg mb-2">Adaptive Catch-Up</h4>
            <p className="text-xs text-matti-light leading-relaxed">
              Sequenced remedial steps balancing student capacity and curriculum deadlines with visual progress.
            </p>
          </div>

          <div className="bg-cream border border-parchment-dark p-6 rounded-2xl hover:border-lotus/40 transition-colors">
            <div className="text-lotus font-bengali text-2xl font-bold mb-2">৪</div>
            <h4 className="font-heading font-bold text-matti text-lg mb-2">Teacher & Peer Bridge</h4>
            <p className="text-xs text-matti-light leading-relaxed">
              Teacher sign-off controls, student-to-student peer note sharing, and contextual recovery messaging.
            </p>
          </div>
        </div>
      </section>

      {/* Bengali Art Alpona Cultural Footer */}
      <footer className="border-t border-parchment-dark bg-parchment py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="font-heading font-bold text-lg text-matti">
              ShikkhaBridge (শিক্ষার সেতু)
            </div>
            <p className="text-xs text-matti-light mt-1">
              CSE470 Educational Technology Project • Learning Recovery System
            </p>
          </div>
          <div className="font-bengali text-sm text-terracotta font-semibold">
            বিপদে মোরে রক্ষা করো এ নহে মোর প্রার্থনা, বিপদে আমি না যেন করি ভয়।
          </div>
          <div className="text-xs text-matti-light">
            Built with React, NestJS, FastAPI, MySQL & Tailwind
          </div>
        </div>
      </footer>
    </div>
  );
};
