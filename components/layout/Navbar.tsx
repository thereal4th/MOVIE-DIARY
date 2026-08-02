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
    /* Positioned squarely along the outer right edge near the bottom, directly above the corner curve without intersecting the paper! */
    <div className="absolute left-full -ml-[1px] bottom-14 flex flex-col gap-3 z-50 select-none pointer-events-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div key={tab.id} className="group relative flex flex-col items-start z-10 hover:z-50">
            
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

            {/* Compact Hover Label Displaying Below the Tab */}
            <div className="absolute top-[48px] sm:top-[52px] left-1 sm:left-2 mt-1 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-200 z-60 flex flex-col items-start drop-shadow-md">
              
              {/* Small upward-pointing triangle arrow */}
              <div className="w-1.5 h-1.5 rotate-45 ml-3 -mb-1 bg-[var(--tooltip-bg)] z-10 border-l border-t border-[var(--tooltip-border)]"></div>

              {/* Compact, cleanly-sized text label badge */}
              <div className="px-2.5 py-1 rounded-lg bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] border border-[var(--tooltip-border)] text-[10px] font-extrabold tracking-wider whitespace-nowrap uppercase shadow-lg select-none">
                {tab.label}
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
