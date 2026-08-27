# VedaAI — AI Assessment Extraction & Answer Mapping

A web application that allows teachers to upload a question paper and handwritten student answer sheet, automatically extracting questions, mapping student answers, highlighting exact answer regions, and providing AI evaluation feedback.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack & AI Models
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: TailwindCSS, Lucide Icons
- **PDF Renderer**: PDF.js (Canvas)
- **AI Models**: Google Gemini 3.6 Flash & Groq Vision OCR (`qwen/qwen3.8-27b`)
