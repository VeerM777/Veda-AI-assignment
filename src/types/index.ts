export interface BoundingBox {
  ymin: number; // 0 to 1000 normalized percentage scale
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface AnswerLocation {
  pageNumber: number; // 1-indexed page number
  boundingBox: BoundingBox;
  label?: string; // e.g. "Q2"
}

export type QuestionStatus = 'answered' | 'unanswered' | 'partial' | 'out_of_order' | 'unmapped';

export interface ExtractedQuestion {
  id: string; // e.g., "q1", "q11a", "q11b"
  questionNumber: string; // e.g. "1", "2", "11 a.", "11 b."
  parentQuestionNumber?: string; // e.g. "11"
  questionText: string;
  maxMarks: number;
  obtainedMarks: number;
  status: QuestionStatus;
  aiFeedback?: string;
  answerLocations: AnswerLocation[];
}

export interface UnmappedAnswer {
  id: string;
  pageNumber: number;
  boundingBox: BoundingBox;
  detectedText: string;
  note?: string;
}

export interface ExtractionSummary {
  totalQuestions: number;
  totalMaxMarks: number;
  totalObtainedMarks: number;
  answeredCount: number;
  unansweredCount: number;
  outOfOrderCount: number;
  percentageScore: number;
}

export interface ExtractionResult {
  summary: ExtractionSummary;
  questions: ExtractedQuestion[];
  unmappedAnswers: UnmappedAnswer[];
}

export interface UploadedFileState {
  file: File | null;
  files?: File[]; // List of files for multi-image uploads
  name: string;
  sizeMB: string;
  pageCount: number;
  dataUrl?: string;
  previewUrl?: string;
}

export type AppStep = 'upload' | 'extracting' | 'dashboard';
