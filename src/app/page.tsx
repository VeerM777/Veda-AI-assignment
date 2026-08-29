'use client';
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { UploadSection } from '@/components/upload/UploadSection';
import { ExtractionLoader } from '@/components/loading/ExtractionLoader';
import { QuestionList } from '@/components/mapping/QuestionList';
import { PDFAnswerViewer } from '@/components/mapping/PDFAnswerViewer';
import { ExtractionResult, UploadedFileState, AppStep } from '@/types';

const EMPTY_FILE: UploadedFileState = { file: null, name: '', sizeMB: '', pageCount: 0 };

const EMPTY_RESULT: ExtractionResult = {
  summary: {
    totalQuestions: 0,
    totalMaxMarks: 0,
    totalObtainedMarks: 0,
    answeredCount: 0,
    unansweredCount: 0,
    outOfOrderCount: 0,
    percentageScore: 0,
  },
  questions: [],
  unmappedAnswers: [],
};

export default function VedaAIApp() {
  const [activeNav, setActiveNav]     = useState<NavTab>('exams');
  const [step, setStep]               = useState<AppStep>('upload');
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileTab, setMobileTab]     = useState<'questions' | 'answerSheet'>('questions');
  const [questionPaper, setQP]        = useState<UploadedFileState>(EMPTY_FILE);
  const [answerSheet, setAS]          = useState<UploadedFileState>(EMPTY_FILE);
  const [result, setResult]           = useState<ExtractionResult>(EMPTY_RESULT);
  const [activeQ, setActiveQ]         = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [padding, setPadding] = useState('24px');
  const [gap, setGap] = useState('20px');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPadding('12px');
        setGap('12px');
      } else {
        setPadding('24px');
        setGap('20px');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Natural sort helper (e.g. page1, page2, page10 in correct numerical order)
  const sortFilesNaturally = (files: File[]) => {
    return [...files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  };

  const updateQPState = (files: File[]) => {
    if (files.length === 0) {
      setQP(EMPTY_FILE);
      return;
    }
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const sizeMB = `${(totalSize / 1048576).toFixed(1)}MB`;
    const pageCount = files.length;
    const name = files.length === 1 
      ? files[0].name 
      : `${files.length} pages (${files[0].name})`;

    setQP({
      file: files[0],
      files: files,
      name,
      sizeMB,
      pageCount,
    });
  };

  const updateASState = (files: File[]) => {
    if (files.length === 0) {
      setAS(EMPTY_FILE);
      return;
    }
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const sizeMB = `${(totalSize / 1048576).toFixed(1)}MB`;
    const pageCount = files.length;
    const name = files.length === 1 
      ? files[0].name 
      : `${files.length} pages (${files[0].name})`;

    setAS({
      file: files[0],
      files: files,
      name,
      sizeMB,
      pageCount,
    });
  };

  const handleQPUpload = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const isNewPDF = newFiles.some(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (isNewPDF) {
      // PDF uploads replace the state with the single PDF file
      const pdfFile = newFiles.find(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) || newFiles[0];
      updateQPState([pdfFile]);
      return;
    }
    const existing = (questionPaper.files || (questionPaper.file ? [questionPaper.file] : [])).filter(f => !f.type?.includes('pdf') && !f.name?.toLowerCase().endsWith('.pdf'));
    const sortedNew = sortFilesNaturally(newFiles);
    updateQPState([...existing, ...sortedNew]);
  };

  const handleASUpload = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const isNewPDF = newFiles.some(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (isNewPDF) {
      // PDF uploads replace the state with the single PDF file
      const pdfFile = newFiles.find(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) || newFiles[0];
      updateASState([pdfFile]);
      return;
    }
    const existing = (answerSheet.files || (answerSheet.file ? [answerSheet.file] : [])).filter(f => !f.type?.includes('pdf') && !f.name?.toLowerCase().endsWith('.pdf'));
    const sortedNew = sortFilesNaturally(newFiles);
    updateASState([...existing, ...sortedNew]);
  };

  const handleRemoveQPPage = (index: number) => {
    const existing = questionPaper.files || (questionPaper.file ? [questionPaper.file] : []);
    const next = existing.filter((_, i) => i !== index);
    updateQPState(next);
  };

  const handleRemoveASPage = (index: number) => {
    const existing = answerSheet.files || (answerSheet.file ? [answerSheet.file] : []);
    const next = existing.filter((_, i) => i !== index);
    updateASState(next);
  };

  const handleReorderQPPages = (from: number, to: number) => {
    const existing = [...(questionPaper.files || (questionPaper.file ? [questionPaper.file] : []))];
    if (to < 0 || to >= existing.length) return;
    const [moved] = existing.splice(from, 1);
    existing.splice(to, 0, moved);
    updateQPState(existing);
  };

  const handleReorderASPages = (from: number, to: number) => {
    const existing = [...(answerSheet.files || (answerSheet.file ? [answerSheet.file] : []))];
    if (to < 0 || to >= existing.length) return;
    const [moved] = existing.splice(from, 1);
    existing.splice(to, 0, moved);
    updateASState(existing);
  };

  const handleLoadDemo = () => {
    const qpDemo = new File(['demo_content'], 'Class_10_maths_unit_test.pdf', { type: 'application/pdf' });
    const asDemo = new File(['demo_content'], 'student_1_answer_sheet.pdf', { type: 'application/pdf' });
    setQP({
      file: qpDemo,
      files: [qpDemo],
      name: 'Class_10_maths_unit_test.pdf',
      sizeMB: '2MB',
      pageCount: 2,
    });
    setAS({
      file: asDemo,
      files: [asDemo],
      name: 'student_1_answer_sheet.pdf',
      sizeMB: '8MB',
      pageCount: 4,
    });
  };

  const handleStartMapping = async () => {
    setStep('extracting');
    let success = false;

    /** Convert & Compress ALL image files to clean JPEG via FileReader + Canvas (max 1600px dimension, ~250KB size) */
    async function normalizeImageFile(file: File): Promise<File> {
      // PDFs stay as-is
      if (!file || file.type === 'application/pdf' || (file.name || '').toLowerCase().endsWith('.pdf')) {
        return file;
      }

      try {
        // Read file as Data URL using FileReader (100% safe on iOS Safari & Android)
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        // Convert & scale image to standard JPEG via Canvas
        return await new Promise<File>((resolve) => {
          const img = new Image();
          img.onload = () => {
            try {
              const MAX_DIM = 1600;
              let width = img.naturalWidth || img.width || 1200;
              let height = img.naturalHeight || img.height || 1200;

              // Scale down large camera photos (e.g. 4032x3024 iPhone photos)
              if (width > MAX_DIM || height > MAX_DIM) {
                if (width > height) {
                  height = Math.round((height * MAX_DIM) / width);
                  width = MAX_DIM;
                } else {
                  width = Math.round((width * MAX_DIM) / height);
                  height = MAX_DIM;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx && width > 0 && height > 0) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height); // White canvas background
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                  if (blob) {
                    const baseName = (file.name || 'image').replace(/\.[^.]+$/, '');
                    resolve(new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }));
                  } else {
                    resolve(file);
                  }
                }, 'image/jpeg', 0.80);
              } else {
                resolve(file);
              }
            } catch {
              resolve(file);
            }
          };
          img.onerror = () => resolve(file); // Safe fallback to original file if canvas loading fails
          img.src = dataUrl;
        });
      } catch {
        return file; // Safe fallback if FileReader fails
      }
    }

    try {
      const fd = new FormData();

      // Normalize and append all Question Paper files IN EXACT SEQUENTIAL ORDER
      const qpFiles = questionPaper.files && questionPaper.files.length > 0
        ? questionPaper.files
        : questionPaper.file ? [questionPaper.file] : [];
      for (const f of qpFiles) {
        const normalized = await normalizeImageFile(f);
        fd.append('questionPaper', normalized);
      }

      // Normalize and append all Answer Sheet files IN EXACT SEQUENTIAL ORDER
      const asFiles = answerSheet.files && answerSheet.files.length > 0
        ? answerSheet.files
        : answerSheet.file ? [answerSheet.file] : [];
      for (const f of asFiles) {
        const normalized = await normalizeImageFile(f);
        fd.append('answerSheet', normalized);
      }

      const res = await fetch('/api/extract', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        
        if (data.questions && data.questions.length > 0) {
          setActiveQ(data.questions[0].id);
        }
        success = true;
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Extraction failed');
      }
    } catch (err: any) {
      let rawMsg = String(err?.message || err || '');
      try {
        const parsed = JSON.parse(rawMsg);
        if (parsed?.error?.message) rawMsg = parsed.error.message;
      } catch (e) {}
      alert(rawMsg.includes('busy') || rawMsg.includes('demand') ? 'AI service is temporarily busy. Please click Start Mapping again.' : (rawMsg || 'Extraction service error. Please try again.'));
      setStep('upload');
    }

    if (success) {
      setTimeout(() => {
        setStep('dashboard');
        setCollapsed(true);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }, 2200);
    }
  };

  const handleSelectQuestion = (id: string) => {
    setActiveQ(id);
    const q = result.questions.find((q) => q.id === id);
    if (q?.answerLocations[0]) {
      setCurrentPage(q.answerLocations[0].pageNumber);
    }
    // Automatically switch mobile view to answerSheet tab so user sees bounding box highlight
    setMobileTab('answerSheet');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#EBEBF0',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* ── Sidebar ── */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        activeNav={activeNav}
        onSelectNav={(tab) => { setActiveNav(tab); setMobileMenuOpen(false); }}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* ── Right workspace ── */}
      <div style={{
        flex: '1 1 0%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: padding,
        gap: gap,
        backgroundColor: '#EBEBF0',
      }}>
        <TopHeader
          showBack={step === 'dashboard'}
          onBackToUpload={() => setStep('upload')}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Main content */}
        <main style={{
          flex: '1 1 0%',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <UploadSection
              questionPaper={questionPaper}
              answerSheet={answerSheet}
              onQuestionPaperUpload={handleQPUpload}
              onAnswerSheetUpload={handleASUpload}
              onRemoveQPPage={handleRemoveQPPage}
              onRemoveASPage={handleRemoveASPage}
              onReorderQPPages={handleReorderQPPages}
              onReorderASPages={handleReorderASPages}
              onRemoveQuestionPaper={() => setQP(EMPTY_FILE)}
              onRemoveAnswerSheet={() => setAS(EMPTY_FILE)}
              onStartMapping={handleStartMapping}
              onLoadDemoFiles={handleLoadDemo}
            />
          )}

          {/* STEP 2: Extracting */}
          {step === 'extracting' && (
            <div style={{ flex: '1 1 0%', minHeight: 0, overflow: 'hidden', borderRadius: '24px' }}
              className="bg-white border border-black/[0.05] shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <ExtractionLoader />
            </div>
          )}

          {/* STEP 3: Dashboard — two side-by-side panels with Mobile Tab Switcher */}
          {step === 'dashboard' && (
            <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 md:gap-4 overflow-hidden">

              {/* Mobile Tab Switcher (< 768px) */}
              <div className="md:hidden flex bg-[#E2E2E8] p-1 rounded-2xl flex-shrink-0">
                <button
                  onClick={() => setMobileTab('questions')}
                  className={`flex-1 py-2 text-[13.5px] font-bold rounded-xl transition-all ${
                    mobileTab === 'questions' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#646470]'
                  }`}
                >Questions</button>
                <button
                  onClick={() => setMobileTab('answerSheet')}
                  className={`flex-1 py-2 text-[13.5px] font-bold rounded-xl transition-all ${
                    mobileTab === 'answerSheet' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#646470]'
                  }`}
                >Answer Sheet</button>
              </div>

              {/* LEFT PANEL — Questions list */}
              <div
                className={`
                  flex-1 min-h-0 flex flex-col bg-white rounded-3xl
                  border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                  overflow-hidden w-full md:w-[42%] md:min-w-[280px] md:max-w-[440px]
                  ${mobileTab === 'answerSheet' ? 'hidden md:flex' : 'flex'}
                `}
              >
                <QuestionList
                  questions={result.questions}
                  activeQuestionId={activeQ}
                  onSelectQuestion={handleSelectQuestion}
                />
              </div>

              {/* RIGHT PANEL — Answer sheet viewer */}
              <div
                className={`
                  min-h-0 flex-1 min-w-0 flex flex-col
                  rounded-3xl border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                  overflow-hidden
                  ${mobileTab === 'questions' ? 'hidden md:flex' : 'flex'}
                `}
              >
                <PDFAnswerViewer
                  questions={result.questions}
                  activeQuestionId={activeQ}
                  currentPage={currentPage}
                  totalPages={answerSheet.pageCount || 4}
                  onPageChange={setCurrentPage}
                  onSelectQuestion={handleSelectQuestion}
                  answerSheetFiles={answerSheet.files || (answerSheet.file ? [answerSheet.file] : [])}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


