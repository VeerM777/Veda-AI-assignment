'use client';
import React from 'react';
import { ExtractedQuestion, AnswerLocation } from '@/types';

interface BoundingBoxOverlayProps {
  questions: ExtractedQuestion[];
  activeQuestionId: string;
  currentPage: number;
  onSelectQuestion: (id: string) => void;
}

/** Strip verbose 'Prompt' word: 'Q3 Prompt A' → 'Q3 A' */
function cleanLabel(label: string): string {
  return label.replace(/\bPrompt\s+/gi, '');
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({
  questions, activeQuestionId, currentPage, onSelectQuestion,
}) => {
  const items: { question: ExtractedQuestion; location: AnswerLocation }[] = [];
  questions.forEach(q => {
    q.answerLocations.forEach(loc => {
      if (loc.pageNumber === currentPage) items.push({ question: q, location: loc });
    });
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {items.map(({ question, location }) => {
        const isActive = question.id === activeQuestionId;
        const b = location.boundingBox;
        const full = question.obtainedMarks === question.maxMarks && question.maxMarks > 0;
        const zero = question.obtainedMarks === 0;

        // Base status color — constant across all pages for the same question
        const baseColor = full ? '#22C55E' : zero ? '#EF4444' : '#F59E0B';
        const borderColor = isActive ? '#FF5429' : baseColor;
        const bgColor = isActive
          ? 'rgba(255,84,41,0.08)'
          : full
          ? 'rgba(34,197,94,0.06)'
          : zero
          ? 'rgba(239,68,68,0.06)'
          : 'rgba(245,158,11,0.06)';
        const badgeBg = isActive ? '#FF5429' : baseColor;

        return (
          <div
            key={`${question.id}-${currentPage}-${b.ymin}`}
            onClick={() => onSelectQuestion(question.id)}
            style={{
              top: `${(b.ymin / 1000) * 100}%`,
              left: `${(b.xmin / 1000) * 100}%`,
              width: `${((b.xmax - b.xmin) / 1000) * 100}%`,
              height: `${((b.ymax - b.ymin) / 1000) * 100}%`,
              border: `2px solid ${borderColor}`,
              backgroundColor: bgColor,
              boxShadow: isActive ? `0 0 0 3px ${borderColor}33` : undefined,
            }}
            className="absolute rounded-xl pointer-events-auto cursor-pointer transition-all duration-150 flex items-start p-1"
          >
            <span
              className="text-[10px] font-black text-white px-1.5 py-0.5 rounded-md leading-none"
              style={{ backgroundColor: badgeBg }}
            >
              {(() => {
                const raw = question.questionNumber || location.label || 'Answer';
                const cleaned = cleanLabel(raw);
                // If already starts with Q/q don't add another Q
                return /^[Qq]\d/.test(cleaned) ? cleaned : `Q${cleaned}`;
              })()}
            </span>
          </div>
        );
      })}
    </div>
  );
};
