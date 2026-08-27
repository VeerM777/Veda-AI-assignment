'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';

export const ExtractionLoader: React.FC = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-6 animate-fade-up">
      {/* Three Sparkle Stars matching Figma exact style */}
      <div className="flex items-end gap-3">
        <svg className="w-8 h-8 text-[#FF5429] animate-sparkle" style={{ animationDelay: '0.2s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L14.5 9H23L16.5 14L19 22L12 17L5 22L7.5 14L1 9H9.5L12 1Z" />
        </svg>
        <svg className="w-12 h-12 text-[#FF5429] animate-sparkle" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L14.5 9H23L16.5 14L19 22L12 17L5 22L7.5 14L1 9H9.5L12 1Z" />
        </svg>
        <svg className="w-8 h-8 text-[#FF5429] animate-sparkle" style={{ animationDelay: '0.4s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L14.5 9H23L16.5 14L19 22L12 17L5 22L7.5 14L1 9H9.5L12 1Z" />
        </svg>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-[24px] font-black text-[#1A1A1A] tracking-tight">Extracting...</h2>
        <p className="text-[14px] text-[#9B9B9B] font-medium">This may take a while</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-[#EDEDED] rounded-full overflow-hidden">
        <div className="h-full bg-[#FF5429] rounded-full animate-pulse" style={{ width: '65%' }} />
      </div>
    </div>
  </div>
);
