'use client';
import React from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { ExtractedQuestion } from '@/types';

interface QuestionCardProps {
  question: ExtractedQuestion;
  isActive: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: (e: React.MouseEvent) => void;
}

/** Remove verbose 'Prompt' word from sub-question labels: 'Q3 Prompt A' → 'Q3 A' */
function cleanLabel(label: string): string {
  // e.g. "Q3 Prompt A" → "Q3 A", "Q3 Prompt B" → "Q3 B"
  return label.replace(/\bPrompt\s+/gi, '');
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question, isActive, isExpanded, onSelect, onToggleExpand,
}) => {
  const full = question.obtainedMarks === question.maxMarks && question.maxMarks > 0;
  const unanswered = question.status === 'unanswered';

  const scoreBg = unanswered ? '#FEE2E2' : full ? '#D1FAE5' : '#FEF3C7';
  const scoreColor = unanswered ? '#DC2626' : full ? '#059669' : '#D97706';
  const scoreBorder = unanswered ? '#FECACA' : full ? '#A7F3D0' : '#FDE68A';

  return (
    <div
      onClick={onSelect}
      style={{
        borderRadius: '16px',
        border: `1.5px solid ${isActive ? '#FF5429' : '#EDEDED'}`,
        backgroundColor: 'white',
        cursor: 'pointer',
        boxShadow: isActive ? '0 0 0 3px rgba(255,84,41,0.12), 0 2px 8px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
        /* NO overflow:hidden — the card must expand to fit AI feedback text */
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px' }}>

        {/* Question number badge */}
        <div style={{
          flexShrink: 0,
          minWidth: '26px',
          height: '26px',
          padding: '0 6px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 900,
          marginTop: '2px',
          backgroundColor: isActive ? '#1A1A1A' : '#F0F0F2',
          color: isActive ? 'white' : '#1A1A1A',
          whiteSpace: 'nowrap',
        }}>
          {cleanLabel(question.questionNumber)}
        </div>

        {/* Question text — MUST have minWidth:0 to allow it to shrink */}
        <div style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
          <p style={{
            margin: 0,
            fontSize: '12.5px',
            lineHeight: '1.55',
            fontWeight: 500,
            color: '#1A1A1A',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}>
            {question.questionText}
          </p>
          {question.status === 'out_of_order' && (
            <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', fontWeight: 700, color: '#7C3AED', backgroundColor: '#F5F3FF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
              answered out of order
            </span>
          )}
          {question.status === 'unanswered' && (
            <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FECACA' }}>
              not attempted
            </span>
          )}
        </div>

        {/* Score + chevron — never shrink */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '999px',
            border: `1px solid ${scoreBorder}`,
            backgroundColor: scoreBg,
            color: scoreColor,
            whiteSpace: 'nowrap',
          }}>
            {question.obtainedMarks}/{question.maxMarks}
          </span>
          <button
            onClick={onToggleExpand}
            style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#9B9B9B',
              flexShrink: 0,
              padding: 0,
            }}
          >
            {isExpanded ? <ChevronUp size={13} strokeWidth={2.5} /> : <ChevronDown size={13} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* AI Feedback drawer */}
      {isExpanded && question.aiFeedback && (
        <div style={{ padding: '0 14px 12px' }}>
          <div style={{ backgroundColor: '#F8F8FA', borderRadius: '12px', border: '1px solid #EDEDED', padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Sparkles size={12} strokeWidth={1.8} fill="#FF5429" color="#FF5429" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1A1A1A' }}>AI Feedback</span>
            </div>
            <p style={{ margin: 0, fontSize: '11.5px', color: '#6B6B6B', lineHeight: '1.6', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {question.aiFeedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
