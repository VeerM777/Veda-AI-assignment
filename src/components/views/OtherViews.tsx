'use client';

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Folder,
  ShieldCheck,
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface OtherViewProps {
  tab: NavTab;
  onGoToExams: () => void;
}

export const OtherViews: React.FC<OtherViewProps> = ({ tab, onGoToExams }) => {
  if (tab === 'home') {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-8 animate-fadeIn">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold border border-orange-500/30">
              Welcome back, Teacher! 👋
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              VedaAI Evaluation Dashboard
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Extract questions, map handwritten student answer sheets, and generate instant AI grading feedback.
            </p>
          </div>

          <button
            onClick={onGoToExams}
            className="z-10 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <Sparkles size={18} />
            <span>Start Exam Mapping</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={<FileText size={22} className="text-blue-600" />}
            title="Total Exams Graded"
            value="142"
            subtitle="+18 this week"
            bg="bg-blue-50/50 border-blue-100"
          />
          <StatCard
            icon={<TrendingUp size={22} className="text-emerald-600" />}
            title="Average Class Accuracy"
            value="84.4%"
            subtitle="Class 10 Biology Test"
            bg="bg-emerald-50/50 border-emerald-100"
          />
          <StatCard
            icon={<Clock size={22} className="text-orange-600" />}
            title="Grading Time Saved"
            value="18.5 hrs"
            subtitle="Automated mapping"
            bg="bg-orange-50/50 border-orange-100"
          />
        </div>

        {/* Recent Evaluation Cards */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900">
              Recent Exam Mappings
            </h3>
            <button
              onClick={onGoToExams}
              className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
            >
              Open Exams Workspace →
            </button>
          </div>

          <div className="space-y-3">
            <RecentExamItem
              title="Class 10 Maths Unit Test"
              subtitle="student_1_answer_sheet.pdf • 14 Questions • 38/45 Marks"
              date="Today"
              score="84.4%"
              onClick={onGoToExams}
            />
            <RecentExamItem
              title="Class 10 Physics Midterm"
              subtitle="student_2_physics_sheet.pdf • 10 Questions • 28/30 Marks"
              date="Yesterday"
              score="93.3%"
              onClick={onGoToExams}
            />
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'classroom') {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Classrooms</h1>
            <p className="text-xs text-gray-500">Managed classes at Delhi Public School</p>
          </div>
          <button
            onClick={onGoToExams}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            + Create Exam
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ClassCard
            title="Class 10 - Biology"
            students={38}
            exams={12}
            color="bg-emerald-50 border-emerald-200"
            onClick={onGoToExams}
          />
          <ClassCard
            title="Class 10 - Mathematics"
            students={42}
            exams={15}
            color="bg-blue-50 border-blue-200"
            onClick={onGoToExams}
          />
          <ClassCard
            title="Class 9 - General Science"
            students={35}
            exams={8}
            color="bg-purple-50 border-purple-200"
            onClick={onGoToExams}
          />
        </div>
      </div>
    );
  }

  if (tab === 'assignments' || tab === 'library') {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {tab === 'assignments' ? 'Assignments' : 'My Question Library'}
            </h1>
            <p className="text-xs text-gray-500">
              {tab === 'assignments'
                ? 'Active student answer sheet submissions'
                : 'Saved question papers and evaluation rubrics'}
            </p>
          </div>
          <button
            onClick={onGoToExams}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Launch Mapping Tool
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Folder size={32} />
          </div>
          <h3 className="font-extrabold text-lg text-gray-900">
            Figma Test Repository Ready
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Upload custom question papers or launch the pre-loaded Class 10 Biology test mapping tool directly.
          </p>
          <button
            onClick={onGoToExams}
            className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Open Exams & Mapping
          </button>
        </div>
      </div>
    );
  }

  // Settings View
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>

      <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-6">
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-1">School Profile</h3>
          <p className="text-xs text-gray-500">Delhi Public School Bokaro Steel City</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span>AI Model Engine</span>
          </h3>
          <p className="text-xs text-gray-500">
            Google Gemini 2.0 Flash Vision configured via <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">.env</code> file.
          </p>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, bg }) => (
  <div className={`rounded-3xl p-5 border ${bg} bg-white shadow-2xs`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold text-gray-500">{title}</span>
      {icon}
    </div>
    <div className="text-2xl font-extrabold text-gray-900">{value}</div>
    <span className="text-[11px] font-medium text-gray-400 mt-1 block">{subtitle}</span>
  </div>
);

interface RecentExamItemProps {
  title: string;
  subtitle: string;
  date: string;
  score: string;
  onClick: () => void;
}

const RecentExamItem: React.FC<RecentExamItemProps> = ({
  title,
  subtitle,
  date,
  score,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="p-4 rounded-2xl bg-gray-50 hover:bg-orange-50/50 border border-gray-100 hover:border-orange-200 transition-all flex items-center justify-between cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
        📋
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="font-extrabold text-sm text-emerald-600 block">{score}</span>
      <span className="text-[11px] text-gray-400">{date}</span>
    </div>
  </div>
);

interface ClassCardProps {
  title: string;
  students: number;
  exams: number;
  color: string;
  onClick: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ title, students, exams, color, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-3xl border ${color} bg-white shadow-2xs cursor-pointer hover:scale-102 transition-transform space-y-4`}
  >
    <div className="flex items-center justify-between">
      <h3 className="font-extrabold text-base text-gray-900">{title}</h3>
      <Users size={20} className="text-gray-400" />
    </div>
    <div className="text-xs text-gray-500 space-y-1">
      <p>• {students} Students enrolled</p>
      <p>• {exams} Mapped Exams</p>
    </div>
    <button className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors">
      Open Classroom Exams
    </button>
  </div>
);
