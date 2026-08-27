'use client';
import React from 'react';
import { ArrowLeft, HelpCircle, Bell, Sparkles, ChevronDown, ClipboardList, Menu } from 'lucide-react';

interface TopHeaderProps {
  showBack?: boolean;
  onBackToUpload?: () => void;
  onOpenMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ 
  showBack, 
  onBackToUpload,
  onOpenMobileMenu 
}) => {
  return (
    <header
      className="h-[64px] bg-white rounded-3xl border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] px-6 flex items-center justify-between flex-shrink-0 select-none"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Left side: title + back button ──────────────── */}
      <div className="flex items-center gap-3" style={{ paddingLeft: '28px' }}>
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden w-9 h-9 rounded-full bg-white hover:bg-gray-50 border border-gray-200/60 shadow-xs flex items-center justify-center text-gray-600 transition-colors cursor-pointer mr-1"
            title="Open Menu"
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        )}
        {showBack && onBackToUpload && (
          <button
            onClick={onBackToUpload}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-50 border border-gray-200/60 shadow-xs flex items-center justify-center text-gray-600 transition-colors cursor-pointer mr-1"
            title="Back to Upload"
          >
            <ArrowLeft size={16} strokeWidth={2.2} />
          </button>
        )}
        <div className="flex items-center gap-2 text-[#8E8E9C]">
          <ClipboardList size={22} strokeWidth={1.8} />
          <span className="text-[18px] font-bold text-[#8E8E9C] tracking-tight">Exams</span>
        </div>
      </div>

      {/* ── Right side: actions & profile ───────────────── */}
      <div className="flex items-center gap-3">
        <button
          title="Help"
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <HelpCircle size={20} strokeWidth={1.8} />
        </button>

        <button
          title="Notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors relative cursor-pointer"
        >
          <Bell size={20} strokeWidth={1.8} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF5429] ring-2 ring-white" />
        </button>

        <button
          title="AI Assistant"
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <Sparkles size={20} strokeWidth={1.8} />
        </button>

        {/* Profile Pill - Matching exact Image 1 & 2 layout */}
        <div className="flex items-center gap-3 pl-4 ml-1 border-l border-gray-100 cursor-pointer hover:opacity-85 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-[#FF5429] flex items-center justify-center text-white text-[13px] font-bold shadow-xs">
            MR
          </div>
          <span className="text-[15px] font-bold text-[#1A1A1A] tracking-tight hidden sm:block">
            Madhur Rastogi
          </span>
          <ChevronDown size={15} strokeWidth={2} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};
