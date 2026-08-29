'use client';
import React, { useState } from 'react';
import { ExtractedQuestion } from '@/types';
import { QuestionCard } from './QuestionCard';

interface QuestionListProps {
  questions: ExtractedQuestion[];
  activeQuestionId: string;
  onSelectQuestion: (id: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions, activeQuestionId, onSelectQuestion }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const allExpanded = questions.length > 0 && questions.every(q => expandedIds[q.id]);

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds({});
    } else {
      const next: Record<string, boolean> = {};
      questions.forEach(q => { next[q.id] = true; });
      setExpandedIds(next);
    }
  };

  const toggleOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>

      {/* ── Header — fixed, never shrinks ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '16px 20px',
        borderBottom: '1px solid #F0F0F2',
        backgroundColor: 'white',
        borderRadius: '24px 24px 0 0',
        overflow: 'hidden',
      }}>
        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <h2 style={{ fontSize: '14.5px', fontWeight: 800, color: '#1A1A1A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Extracted Questions
          </h2>
          <p style={{ fontSize: '11px', color: '#ABABAB', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            from question paper
          </p>
        </div>
        <button
          onClick={toggleAll}
          style={{
            flexShrink: 0,
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#6B6B6B',
            backgroundColor: '#F5F5F7',
            border: 'none',
            borderRadius: '999px',
            padding: '6px 14px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* ── Scrollable list — grows to fill remaining height ── */}
      <div style={{
        flex: '1 1 0%',
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        padding: '10px 10px 60px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#D0D0D8 transparent',
      }}>
        {questions.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', padding: '32px', textAlign: 'center' }}>
            <span style={{ fontSize: '32px' }}>📄</span>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6B6B', margin: 0 }}>No questions extracted yet</p>
            <p style={{ fontSize: '11.5px', color: '#ABABAB', margin: 0 }}>Upload your documents to get started.</p>
          </div>
        ) : (
          questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              isActive={q.id === activeQuestionId}
              isExpanded={Boolean(expandedIds[q.id])}
              onSelect={() => onSelectQuestion(q.id)}
              onToggleExpand={(e) => toggleOne(q.id, e)}
            />
          ))
        )}
      </div>
    </div>
  );
};
