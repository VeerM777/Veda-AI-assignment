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
      className="h-full overflow-y-auto flex flex-col items-center justify-start px-3 md:px-8 py-4 md:py-8 bg-[#EBEBF0]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center gap-5 md:gap-8 animate-fade-up">

        {/* ── Main Title Heading ── */}
        <div className="text-center space-y-2 w-full px-2">
          <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }} className="text-[20px] sm:text-[28px] md:text-[36px] lg:text-[40px] font-extrabold text-[#1A1A1A] leading-tight flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 tracking-tight">
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Upload</span>
            <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }} className="inline-block bg-[#FFF0EB] text-[#FF5429] px-4 md:px-7 py-1.5 md:py-2.5 rounded-2xl border border-[#FED3C8] font-extrabold shadow-xs text-center max-w-[95vw] md:max-w-none text-[16px] sm:text-[24px] md:text-[36px] lg:text-[40px]">
              Question Paper &amp; Answer Sheets
            </span>
          </h1>
          <p className="text-[13px] md:text-[16px] text-[#6E6E7C] font-semibold">
            Upload PDF document or image pages in sequence
          </p>
        </div>

        {/* ── Center Teacher Hero Circle Avatar ── */}
        <div className="flex justify-center items-center w-full my-1">
          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white flex items-center justify-center bg-white flex-shrink-0 hover:scale-105 transition-transform duration-200">
            <img
              src="/Teacher_holding_book_2K_202608262351.jpeg"
              alt="Teacher Assistant"
              className="w-full h-full object-cover object-center transform scale-125 translate-y-1.5"
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
        <div className="flex flex-col items-center gap-3 pt-1 w-full px-4">
          <button
            onClick={onStartMapping}
            disabled={!canStart}
            style={{
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '14px',
              paddingBottom: '14px',
              whiteSpace: 'nowrap',
              minWidth: 'max-content'
            }}
            className={`flex items-center justify-center gap-3 rounded-full text-[15px] md:text-[16.5px] font-extrabold transition-all select-none flex-shrink-0 w-full sm:w-auto
              ${canStart
                ? 'bg-[#1A1A1A] text-white hover:bg-black cursor-pointer shadow-lg hover:scale-[1.02]'
                : 'bg-[#C2C2CB] text-white cursor-not-allowed shadow-none'
              }`}
          >
            <span>Start Mapping</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

          <p className="text-[12px] md:text-[13.5px] text-[#787885] font-medium text-center">
            Once both files are attached, click Start Mapping
          </p>

          <button
            onClick={onLoadDemoFiles}
            style={{
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingTop: '10px',
              paddingBottom: '10px',
              whiteSpace: 'nowrap',
              minWidth: 'max-content'
            }}
            className="flex items-center gap-2 text-[13.5px] font-bold text-[#FF5429] hover:text-[#E04520] bg-white hover:bg-[#FFF0EB] rounded-full border border-[#FED3C8] shadow-xs transition-all cursor-pointer mt-1"
          >
            <span>Load Demo Files</span>
          </button>
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
        borderRadius: '20px',
        border: hasFiles ? '2px solid rgba(255,84,41,0.3)' : '2px dashed #E0E0E8',
        backgroundColor: 'white',
        height: '260px',
        maxHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 22px',
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
        boxShadow: hasFiles ? '0 4px 12px rgba(0,0,0,0.05)' : '0 1px 3px rgba(0,0,0,0.03)',
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

      {/* Card Header */}
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
          <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: '17px', fontWeight: 800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: '#1A1A1A' }}>Upload </span>
            <span style={{ color: '#FF5429' }}>{label}</span>
          </h3>
          <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#8E8E9A', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {hasFiles 
              ? isPDF ? 'PDF Document Attached' : `${filesList.length} Image Page${filesList.length > 1 ? 's' : ''} in Sequence` 
              : 'PDF or Images'}
          </p>
        </div>
        {hasFiles && (
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
        )}
      </div>

      {/* Uploaded Content */}
      {hasFiles ? (
        isPDF ? (
          /* ── SINGLE PDF FILE ATTACHED CARD ── */
          <div style={{
            flex: '1 1 0%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            backgroundColor: '#F8F8FA',
            border: '1.5px solid #EDEDED',
            borderRadius: '16px',
            padding: '16px 18px',
            width: '100%',
            minWidth: 0,
            marginTop: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 0%', overflow: 'hidden' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                PDF
              </div>
              <div style={{ minWidth: 0, flex: '1 1 0%', overflow: 'hidden' }}>
                <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1A1A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={filesList[0].name}>
                  {filesList[0].name}
                </p>
                <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#8E8E9A', margin: '4px 0 0 0' }}>
                  {(filesList[0].size / 1048576).toFixed(1)}MB &bull; {fileState.pageCount || 1} Pages
                </p>
              </div>
            </div>
            <button
              onClick={onClearAll}
              title="Remove PDF"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#1A1A1A',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <X size={14} strokeWidth={2.5} />
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
        /* Empty Dropzone State */
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            flex: '1 1 0%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
            textAlign: 'center', cursor: 'pointer', padding: '24px 0',
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#F4F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload className="w-5 h-5 text-[#555562]" strokeWidth={1.8} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Upload <span style={{ color: '#FF5429' }}>{label}</span>
          </p>
          <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#9898A6', margin: 0 }}>Click or drop PDF or images to begin</p>
        </div>
      )}
    </div>
  );
};
