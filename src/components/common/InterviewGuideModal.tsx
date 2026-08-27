'use client';

import React from 'react';
import { X, BookOpen, CheckCircle, Cpu, FileCheck, Layers } from 'lucide-react';

interface InterviewGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterviewGuideModal: React.FC<InterviewGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900">
                2nd Round Interview Preparation Guide
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                How to explain your project architecture to the interviewers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-sm text-gray-700">
          {/* Section 1: Architecture & Stack */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Cpu size={16} className="text-orange-500" />
              <span>1. Full-Stack Architecture (Next.js 14+ TypeScript)</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Built as a unified full-stack web application. The frontend uses React with Tailwind CSS for pixel-perfect reproduction of the Figma designs. The backend uses Next.js App Router serverless API routes (<code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800">/api/extract</code>) to securely call Google Gemini 2.0 Flash.
            </p>
          </div>

          {/* Section 2: AI Vision Model */}
          <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/60">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Layers size={16} className="text-orange-600" />
              <span>2. Why Google Gemini 2.0 Flash Vision over Pure OCR?</span>
            </h4>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
              <li>
                <strong>Handwriting & Diagrams:</strong> Standard OCR (like Tesseract) fails on messy student handwriting and diagrams. Gemini 2.0 Flash is natively multimodal and understands complex handwritten layouts visually.
              </li>
              <li>
                <strong>Structured JSON Output:</strong> Using Gemini’s <code className="bg-orange-100 px-1 py-0.5 rounded text-orange-900 font-mono">responseSchema</code>, the model returns strict JSON with question text, scores, AI feedback, and spatial bounding boxes.
              </li>
            </ul>
          </div>

          {/* Section 3: Evaluated Edge Cases */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <span>3. Handling Evaluated Edge Cases</span>
            </h4>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                <strong>Sub-Parts (11a / 11b):</strong> Enforced via JSON schema and prompt rules to treat labelled sub-parts as separate question cards with individual mark badges.
              </p>
              <p>
                <strong>Out-of-Order Answers:</strong> The AI Vision engine matches question text to student handwriting regardless of page sequence (e.g. Q7 answered before Q2).
              </p>
              <p>
                <strong>Unanswered Questions:</strong> Automatically detected and assigned 0 marks with explicit feedback stating the question was not attempted.
              </p>
              <p>
                <strong>Bounding Box Synchronization:</strong> Bounding boxes are normalized coordinates (0-1000 scale). Clicking a question card highlights the box and smoothly scrolls the answer sheet viewer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
