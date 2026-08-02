/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { ActiveTab } from '../../types/diary';
import { BookOpen, Users, Compass, User } from 'lucide-react';

export const NotebookSideTabs: React.FC = () => {
  const { activeTab, setActiveTab, userProfile } = useMovieDiary();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; bgClass: string; textClass: string }[] = [
    { id: 'library', label: 'My Diary', icon: <BookOpen className="w-5 h-5 stroke-[2.5]" />, bgClass: 'bg-[var(--accent-sakura)]', textClass: 'text-[var(--accent-sakura-text)]' },
    { id: 'friends', label: 'Friends', icon: <Users className="w-5 h-5 stroke-[2.5]" />, bgClass: 'bg-[var(--accent-matcha)]', textClass: 'text-[var(--accent-matcha-text)]' },
    { id: 'discover', label: 'Recommendations', icon: <Compass className="w-5 h-5 stroke-[2.5]" />, bgClass: 'bg-[var(--accent-lavender)]', textClass: 'text-[var(--accent-lavender-text)]' },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5 stroke-[2.5]" />, bgClass: 'bg-[var(--accent-honey)]', textClass: 'text-[var(--accent-honey-text)]' },
  ];

  return (
    /* 100% Permanently Fused onto the lower right corner of the notebook rim! */
    <div className="absolute left-full -ml-[3px] bottom-8 flex flex-col gap-3.5 z-50 select-none pointer-events-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div key={tab.id} className="group relative flex items-center">
            
            {/* Protruding Symbol-Only Tab Button */}
            <button
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
              className={`side-symbol-tab flex items-center justify-center h-12 sm:h-13 rounded-r-2xl shadow-md cursor-pointer ${
                isActive
                  ? `${tab.bgClass} ${tab.textClass} active font-extrabold ring-2 ring-white/60`
                  : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] opacity-90 hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="select-none inline-flex items-center justify-center">{tab.icon}</span>
            </button>

            {/* ✨ Horizontal Hover Tooltip Tag! Popping directly to the right over the tablecloth! */}
            <div className="absolute left-[48px] top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-200 z-60 flex items-center drop-shadow-xl">
              
              {/* Left-pointing triangle arrow */}
              <div className="w-2 h-2 rotate-45 -mr-1 bg-[var(--tooltip-bg)] z-10 border-l border-b border-[var(--tooltip-border)]"></div>

              {/* Tooltip Tag Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] border border-[var(--tooltip-border)] text-[11px] font-black tracking-wide whitespace-nowrap uppercase flex items-center gap-1.5 shadow-2xl">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'profile' && userProfile && (
                  <img src={userProfile.avatar} alt="Me" className="w-4 h-4 rounded-full object-cover border border-white ml-0.5" />
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};

/* Export aliases */
export const Navbar: React.FC = () => <NotebookSideTabs />;
export const TopRightTabs: React.FC = () => <NotebookSideTabs />;
