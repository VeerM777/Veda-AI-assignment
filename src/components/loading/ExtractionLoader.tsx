'use client';
import React from 'react';

export const ExtractionLoader: React.FC = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-6 animate-fade-up">
      {/* ── AI Sparkle Cluster matching reference screenshot ── */}
      <div className="w-44 h-44 sm:w-52 sm:h-52 relative flex items-center justify-center">
        <svg
          viewBox="0 0 90 80"
          className="w-full h-full text-[#FF5429]"
        >
          <defs>
            <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6842" />
              <stop offset="100%" stopColor="#FF451A" />
            </linearGradient>
          </defs>

          {/* Top Left Floating Dot */}
          <circle cx="24" cy="24" r="4.5" fill="url(#sparkleGrad)" />

          {/* Large Top Right Sparkle Star */}
          <path
            d="M 56 2 Q 56 24 78 24 Q 56 24 56 46 Q 56 24 34 24 Q 56 24 56 2 Z"
            fill="url(#sparkleGrad)"
            className="animate-pulse"
          />

          {/* Medium Bottom Left Sparkle Star */}
          <path
            d="M 38 36 Q 38 54 56 54 Q 38 54 38 72 Q 38 54 20 54 Q 38 54 38 36 Z"
            fill="url(#sparkleGrad)"
            className="animate-pulse"
            style={{ animationDelay: '0.3s' }}
          />

          {/* Small Middle Right Sparkle Star */}
          <path
            d="M 76 41 Q 76 50 85 50 Q 76 50 76 59 Q 76 50 67 50 Q 76 50 76 41 Z"
            fill="url(#sparkleGrad)"
            className="animate-pulse"
            style={{ animationDelay: '0.6s' }}
          />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h2
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className="text-[34px] sm:text-[40px] font-extrabold text-[#1A1A1A] tracking-tight"
        >
          Extracting...
        </h2>
        <p
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className="text-[17px] sm:text-[19px] text-[#787885] font-medium"
        >
          This may take a while
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 sm:w-72 h-2.5 bg-[#EDEDED] rounded-full overflow-hidden mt-3">
        <div className="h-full bg-[#FF5429] rounded-full animate-pulse" style={{ width: '65%' }} />
      </div>
    </div>
  </div>
);
