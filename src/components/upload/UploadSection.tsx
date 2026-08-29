'use client';
import React, { useRef } from 'react';
import { Upload, X, ArrowRight, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { UploadedFileState } from '@/types';

interface UploadSectionProps {
  questionPaper: UploadedFileState;
  answerSheet: UploadedFileState;
  onQuestionPaperUpload: (files: File[]) => void;
  onAnswerSheetUpload:   (files: File[]) => void;
  onRemoveQPPage:        (index: number) => void;
  onRemoveASPage:        (index: number) => void;
  onReorderQPPages:      (from: number, to: number) => void;
  onReorderASPages:      (from: number, to: number) => void;
  onRemoveQuestionPaper: () => void;
  onRemoveAnswerSheet:   () => void;
  onStartMapping:        () => void;
  onLoadDemoFiles:       () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  questionPaper, answerSheet,
  onQuestionPaperUpload, onAnswerSheetUpload,
  onRemoveQPPage, onRemoveASPage,
  onReorderQPPages, onReorderASPages,
  onRemoveQuestionPaper, onRemoveAnswerSheet,
  onStartMapping, onLoadDemoFiles,
}) => {
  const qpRef = useRef<HTMLInputElement>(null);
  const asRef = useRef<HTMLInputElement>(null);
  const canStart = Boolean((questionPaper.files?.length || questionPaper.file) && (answerSheet.files?.length || answerSheet.file));

  return (
    <div
      className="h-full overflow-y-auto flex flex-col items-center justify-start md:justify-center px-3 md:px-8 py-8 md:py-16"
      style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        background: 'transparent',
      }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center gap-6 md:gap-9 animate-fade-up my-auto">

        {/* ── Main Title Heading ── */}
        <div className="text-center w-full px-2">
          <h1
            style={{ fontFamily: "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif" }}
            className="text-[24px] sm:text-[34px] md:text-[44px] lg:text-[50px] font-bold text-[#1A1A1A] leading-tight flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3.5 tracking-tight"
          >
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}>Upload</span>
            <span
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
              className="inline-block bg-[#F5E4DA] text-[#FF5429] px-5 md:px-8 py-2 md:py-3 rounded-2xl border border-[#F7C6B6] shadow-xs text-center max-w-[95vw] md:max-w-none text-[20px] sm:text-[30px] md:text-[42px] lg:text-[48px]"
            >
              Question Paper &amp; Answer Sheets
            </span>
          </h1>
          <p
            className="text-[17px] sm:text-[19px] md:text-[21px] text-[#2D2D36] tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 400, marginTop: '10px' }}
          >
            Upload both files to get started
          </p>
        </div>

        {/* ── Center Teacher Hero Circle Avatar with Floating Icons ── */}
        <div className="flex justify-center items-center w-full mt-2 mb-1">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform duration-200">
            <img
              src="/teacher_hero_graphic_transparent.png"
              alt="Teacher Assistant"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>
        </div>

        {/* ── 2 Upload Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-full md:max-w-4xl px-1">
          <SequentialUploadCard
            label="Question Paper"
            fileState={questionPaper}
            inputRef={qpRef}
            onAddFiles={onQuestionPaperUpload}
            onRemovePage={onRemoveQPPage}
            onReorder={onReorderQPPages}
            onClearAll={onRemoveQuestionPaper}
          />
          <SequentialUploadCard
            label="Answer Sheet"
            fileState={answerSheet}
            inputRef={asRef}
            onAddFiles={onAnswerSheetUpload}
            onRemovePage={onRemoveASPage}
            onReorder={onReorderASPages}
            onClearAll={onRemoveAnswerSheet}
          />
        </div>

        {/* ── Start Mapping CTA & Demo Load ── */}
        <div className="flex flex-col items-center gap-3 pt-6 sm:pt-8 md:pt-10 w-full px-4 mt-2">
          <button
            onClick={onStartMapping}
            disabled={!canStart}
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '12px',
              paddingBottom: '12px',
              whiteSpace: 'nowrap',
              minWidth: 'max-content'
            }}
            className={`flex items-center justify-center gap-2.5 rounded-full text-[16px] md:text-[17px] font-semibold transition-all select-none flex-shrink-0 w-full sm:w-auto
              ${canStart
                ? 'bg-[#1A1A1A] text-white hover:bg-black cursor-pointer shadow-lg hover:scale-[1.02]'
                : 'bg-[#9E9E9E] text-[#E0E0E6] cursor-not-allowed shadow-none'
              }`}
          >
            <span>Start Mapping</span>
            <ArrowRight size={18} strokeWidth={2} className={canStart ? 'text-white' : 'text-[#E0E0E6]'} />
          </button>

          <p
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            className="text-[15px] sm:text-[16.5px] md:text-[17.5px] text-[#6A6A76] font-normal text-center mt-1 tracking-tight"
          >
            Once both files are uploaded, you'll able to map answers with questions
          </p>
        </div>

      </div>
    </div>
  );
};

/* ── Upload Card Component (Handles Single PDF or Sequential Images) ── */
interface SequentialUploadCardProps {
  label: string;
  fileState: UploadedFileState;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAddFiles: (files: File[]) => void;
  onRemovePage: (index: number) => void;
  onReorder: (from: number, to: number) => void;
  onClearAll: () => void;
}

const SequentialUploadCard: React.FC<SequentialUploadCardProps> = ({
  label, fileState, inputRef, onAddFiles, onRemovePage, onReorder, onClearAll,
}) => {
  const filesList = fileState.files || (fileState.file ? [fileState.file] : []);
  const hasFiles = filesList.length > 0;
  const isPDF = hasFiles && filesList.length === 1 && (filesList[0].type === 'application/pdf' || filesList[0].name.toLowerCase().endsWith('.pdf'));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      onAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={handleDrop}
      style={{
        borderRadius: '24px',
        border: hasFiles ? '2px solid rgba(255,84,41,0.3)' : '2px dashed #C8C8D4',
        backgroundColor: 'white',
        height: '235px',
        maxHeight: '235px',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px',
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
        boxShadow: hasFiles ? '0 4px 12px rgba(0,0,0,0.05)' : '0 2px 6px rgba(0,0,0,0.02)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/heic,image/heif,image/*"
        multiple={!isPDF}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAddFiles(Array.from(e.target.files));
          }
          e.target.value = '';
        }}
      />

      {/* Card Header — shown only when files are attached */}
      {hasFiles && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingBottom: '10px',
          borderBottom: '1px solid #F0F0F2',
          marginBottom: '12px',
          width: '100%',
          minWidth: 0,
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{ minWidth: 0, flex: '1 1 0%', overflow: 'hidden' }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '16px', fontWeight: 800, color: '#1A1A1A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</h3>
            <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#8E8E9A', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isPDF ? 'PDF Document Attached' : `${filesList.length} Image Page${filesList.length > 1 ? 's' : ''} in Sequence`}
            </p>
          </div>
          <button
            onClick={onClearAll}
            style={{
              fontSize: '11.5px', fontWeight: 700, color: '#DC2626',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 8px', borderRadius: '8px', flexShrink: 0, whiteSpace: 'nowrap',
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Uploaded Content */}
      {hasFiles ? (
        isPDF ? (
          /* ── SINGLE PDF FILE ATTACHED CARD — matching reference screenshot ── */
          <div style={{
            position: 'relative',
            flex: '1 1 0%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            backgroundColor: '#F5F5F8',
            border: '1.5px solid #EBEBEF',
            borderRadius: '22px',
            padding: '18px 22px',
            width: '100%',
            minWidth: 0,
            marginTop: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0, flex: '1 1 0%', overflow: 'hidden' }}>
              {/* Red Dog-Eared PDF Badge Icon */}
              <div style={{
                width: '46px',
                height: '52px',
                backgroundColor: '#E54D4C',
                borderRadius: '10px 18px 10px 10px',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '9px',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(229,77,76,0.22)',
              }}>
                {/* Folded top-right corner fold */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '13px',
                  height: '13px',
                  backgroundColor: '#F5F5F8',
                  borderBottomLeftRadius: '5px',
                }} />
                <span style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '11.5px',
                  fontWeight: 900,
                  color: 'white',
                  letterSpacing: '0.04em',
                }}>
                  PDF
                </span>
              </div>

              {/* PDF Filename and Metadata */}
              <div style={{ minWidth: 0, flex: '1 1 0%', overflow: 'hidden' }}>
                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#1A1A1A',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '-0.01em',
                  }}
                  title={filesList[0].name}
                >
                  {filesList[0].name}
                </p>
                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: '14.5px',
                    fontWeight: 500,
                    color: '#8A8A96',
                    margin: '3px 0 0 0',
                  }}
                >
                  {Math.max(1, Math.round(filesList[0].size / 1048576))}MB &bull; {fileState.pageCount || 2} Pages
                </p>
              </div>
            </div>

            {/* Floating dark circle X close button top-right */}
            <button
              onClick={onClearAll}
              title="Remove PDF"
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#44444C',
                color: 'white',
                border: '2px solid white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                transition: 'transform 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#44444C')}
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          /* ── SEQUENTIAL IMAGE PAGES LIST ── */
          <div style={{
            flex: '1 1 0%',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
            width: '100%',
            minWidth: 0,
            paddingRight: '4px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#C0C0C8 transparent',
          }}>
            {filesList.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  backgroundColor: '#F8F8FA',
                  border: '1px solid #EDEDED',
                  borderRadius: '14px',
                  padding: '8px 12px',
                  width: '100%',
                  minWidth: 0,
                  minHeight: '44px',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Left: Badge + Filename */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#1A1A1A',
                    color: 'white', fontSize: '11px', fontWeight: 900, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <div style={{ minWidth: 0, flex: '1 1 0%', overflow: 'hidden' }}>
                    <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#1A1A1A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' }} title={file.name}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: '10.5px', color: '#8E8E9A', fontWeight: 600, margin: '2px 0 0 0', lineHeight: '1' }}>
                      Page {idx + 1} &bull; {(file.size / 1048576).toFixed(1)}MB
                    </p>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                  <button
                    onClick={() => onReorder(idx, idx - 1)}
                    disabled={idx === 0}
                    style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#555', opacity: idx === 0 ? 0.2 : 1, padding: 0, borderRadius: '6px', flexShrink: 0 }}
                    title="Move Up"
                  >
                    <ChevronUp size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => onReorder(idx, idx + 1)}
                    disabled={idx === filesList.length - 1}
                    style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#555', opacity: idx === filesList.length - 1 ? 0.2 : 1, padding: 0, borderRadius: '6px', flexShrink: 0 }}
                    title="Move Down"
                  >
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => onRemovePage(idx)}
                    style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626', padding: 0, borderRadius: '6px', flexShrink: 0, marginLeft: '2px' }}
                    title="Remove Page"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Page Button (For Images Only) */}
            <button
              onClick={() => inputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                border: '2px dashed rgba(255,84,41,0.35)', borderRadius: '14px',
                backgroundColor: 'rgba(255,240,235,0.35)', color: '#FF5429',
                padding: '9px 0', fontSize: '13px', fontWeight: 700,
                minHeight: '38px', flexShrink: 0,
                cursor: 'pointer', marginTop: '2px', width: '100%',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add Page {filesList.length + 1}</span>
            </button>
          </div>
        )
      ) : (
        /* Empty Dropzone State — matches Image 2 design exactly */
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            flex: '1 1 0%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '10px',
            textAlign: 'center', cursor: 'pointer', padding: '12px 0',
          }}
        >
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#F4F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px' }}>
            <Upload className="w-6 h-6 text-[#1A1A1A]" strokeWidth={2.2} />
          </div>
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '23.5px', fontWeight: 700, color: '#1A1A1A', margin: 0, letterSpacing: '-0.02em' }}>
            Upload <span style={{ color: '#FF5429', fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}>{label}</span>
          </p>
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '13.5px', fontWeight: 500, color: '#8E8E9A', margin: 0 }}>
            Max 10MB
          </p>
        </div>
      )}
    </div>
  );
};
