'use client';
import React from 'react';
import {
  LayoutGrid, GraduationCap, FileText,
  ClipboardList, History, Settings, ChevronRight, ChevronsRight, PanelLeftClose,
  Sparkles, X,
} from 'lucide-react';

export type NavTab = 'home' | 'classroom' | 'assignments' | 'exams' | 'library' | 'settings';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeNav: NavTab;
  onSelectNav: (tab: NavTab) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <LayoutGrid size={22} strokeWidth={1.8} /> },
  { id: 'classroom', label: 'My Classroom', icon: <OpenIconWrapper><GraduationCap size={22} strokeWidth={1.8} /></OpenIconWrapper> },
  { id: 'assignments', label: 'Assignments', icon: <OpenIconWrapper><FileText size={22} strokeWidth={1.8} /></OpenIconWrapper> },
  { id: 'exams', label: 'Exams', icon: <OpenIconWrapper><ClipboardList size={22} strokeWidth={1.8} /></OpenIconWrapper> },
  { id: 'library', label: 'My Library', icon: <OpenIconWrapper><History size={22} strokeWidth={1.8} /></OpenIconWrapper> },
];

// Helper to keep icon sizing clean
function OpenIconWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex-shrink-0">{children}</div>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  activeNav,
  onSelectNav,
  mobileOpen = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile dim background overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`
          fixed md:relative inset-y-3 left-3 md:inset-0 md:h-full z-50 md:z-auto
          transition-transform duration-300 ease-out max-w-[calc(100vw-24px)] md:max-w-none
          bg-white rounded-3xl flex flex-col overflow-hidden border border-black/[0.04] select-none flex-shrink-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0'}
        `}
        style={{
          width: collapsed ? '76px' : (mobileOpen ? '280px' : '320px'), // 280px on mobile to fit screen perfectly
          minWidth: collapsed ? '76px' : (mobileOpen ? '280px' : '320px'),
          fontFamily: "'Bricolage Grotesque', sans-serif",
          marginLeft: '0px',
          boxShadow: collapsed ? 'none' : '0 20px 50px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          className={`flex flex-col h-full pt-6 pb-8 overflow-y-auto no-scrollbar ${collapsed ? 'px-3.5' : 'px-6'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >

          {/* ── Logo Row ── */}
          <div 
            style={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              marginBottom: '36px',
              paddingLeft: collapsed ? '0px' : '16px', 
              paddingTop: '16px', // Shifted down comfortably in both states
              paddingRight: collapsed ? '0px' : '16px'
            }}
          >
            <div
              className="flex items-center gap-3 cursor-pointer flex-shrink-0"
              onClick={() => onSelectNav('exams')}
            >
              <img
                src="/myvedaai_logo.jpg"
                alt="VedaAI"
                className="w-11 h-11 rounded-xl object-cover shadow-sm flex-shrink-0"
              />
              {!collapsed && (
                <span className="font-extrabold text-[26px] text-[#1A1A1A] tracking-tight">
                  VedaAI
                </span>
              )}
            </div>

            {/* Sidebar Close / Collapse Toggle button */}
            {!collapsed && (
              <div className="flex items-center ml-auto">
                <button
                  onClick={() => {
                    if (mobileOpen && onCloseMobile) {
                      onCloseMobile();
                    } else {
                      onToggleCollapse();
                    }
                  }}
                  title="Close Sidebar"
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
                >
                  <PanelLeftClose size={20} strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>

          {/* ── AI Teacher's Toolkit Button ── */}
          {/* ── AI Teacher's Toolkit Button ── */}
          <div className="flex-shrink-0 flex justify-center w-full" style={{ marginBottom: '36px' }}>
            {collapsed ? (
              <button
                onClick={() => onSelectNav('exams')}
                title="AI Teacher's Toolkit"
                className="w-12 h-12 rounded-full bg-[#242427] border-[3.5px] border-[#FF5429] flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md flex-shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                  <path d="M 10 3 Q 10 12 19 12 Q 10 12 10 21 Q 10 12 1 12 Q 10 12 10 3 Z" />
                  <path d="M 18 1 Q 18 5 22 5 Q 18 5 18 9 Q 18 5 14 5 Q 18 5 18 1 Z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => onSelectNav('exams')}
                className="w-full max-w-[268px] h-[52px] flex items-center justify-center gap-2.5 px-6 rounded-full text-white text-[14.5px] font-semibold hover:opacity-95 transition-all cursor-pointer shadow-md flex-shrink-0"
                style={{
                  background: 'linear-gradient(180deg, #323235 0%, #1A1A1C 100%)',
                  border: '4px solid #FF5429',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                  <path d="M 10 3 Q 10 12 19 12 Q 10 12 10 21 Q 10 12 1 12 Q 10 12 10 3 Z" />
                  <path d="M 18 1 Q 18 5 22 5 Q 18 5 18 9 Q 18 5 14 5 Q 18 5 18 1 Z" />
                </svg>
                <span>AI Teacher's Toolkit</span>
              </button>
            )}
          </div>

          {/* ── Navigation Items ── */}
          {/* Locked gaps using standard marginBottom on each nav child to avoid flex gap bugs */}
          <nav className="flex flex-col flex-shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav(item.id)}
                  style={{
                    paddingLeft: collapsed ? '0px' : '30px',
                    marginBottom: '20px' // Guaranteed gap between buttons
                  }}
                  className={`w-full flex items-center pr-4 py-3.5 rounded-2xl text-[16px] transition-all cursor-pointer flex-shrink-0 ${collapsed ? 'justify-center pr-0' : ''
                    } ${isActive
                      ? 'bg-[#F0F0F4] text-[#1A1A1A] font-extrabold shadow-sm'
                      : 'text-[#646473] hover:bg-gray-50 hover:text-[#1A1A1A] font-semibold'
                    }`}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-[#8E8E9C]'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={{ marginLeft: '24px' }}>{item.label}</span> // Guaranteed space between icon and text
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Bottom: Settings + School Card ── */}
          <div
            className="pt-6 border-t border-gray-100 flex flex-col flex-shrink-0"
            style={{ marginTop: 'auto', paddingBottom: collapsed ? '24px' : '0px' }}
          >
            <button
              onClick={() => onSelectNav('settings')}
              style={{
                paddingLeft: collapsed ? '0px' : '30px',
                marginBottom: '16px'
              }}
              className={`w-full flex items-center pr-4 py-3.5 rounded-2xl text-[16px] transition-all cursor-pointer flex-shrink-0 ${collapsed ? 'justify-center pr-0' : ''
                } ${activeNav === 'settings'
                  ? 'bg-[#F0F0F4] text-[#1A1A1A] font-extrabold'
                  : 'text-[#646473] hover:bg-gray-50 hover:text-[#1A1A1A] font-semibold'
                }`}
            >
              <Settings size={22} strokeWidth={1.8} className={activeNav === 'settings' ? 'text-[#1A1A1A]' : 'text-[#8E8E9C]'} />
              {!collapsed && (
                <span style={{ marginLeft: '24px' }}>Settings</span>
              )}
            </button>

            {/* School Card */}
            {collapsed ? (
              <div className="flex flex-col items-center gap-2.5 pt-1 pb-2 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#F2F7F2] border border-green-100 flex items-center justify-center text-[16px]">
                  🏫
                </div>
                <button
                  onClick={onToggleCollapse}
                  title="Expand Sidebar"
                  className="w-9 h-9 rounded-xl bg-[#F4F4F7] hover:bg-[#EBEBEF] text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer mt-1 shadow-2xs border border-black/[0.06]"
                >
                  <ChevronsRight size={18} strokeWidth={2.2} />
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F7FA] border border-gray-100 flex-shrink-0"
                style={{ marginTop: '4px' }}
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[18px] flex-shrink-0 shadow-sm">
                  🏫
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-[14px] font-bold text-[#1A1A1A] truncate leading-tight">
                    Delhi Public School
                  </p>
                  <p className="text-[12.5px] font-medium text-[#8E8E9C] truncate leading-tight mt-0.5">
                    Bokaro Steel City
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
