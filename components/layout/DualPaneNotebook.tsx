"use client";
import React from 'react';

interface DualPaneNotebookProps {
  leftPage: React.ReactNode;
  rightPage: React.ReactNode;
}

export const DualPaneNotebook: React.FC<DualPaneNotebookProps> = ({ leftPage, rightPage }) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch h-full w-full min-h-0 overflow-hidden divide-y-2 lg:divide-y-0 divide-[var(--border-color)]">
      
      {/* 📖 LEFT PAGE CONTAINER (50% split on desktop, internal micro-scrolling ready) */}
      <div className="flex-1 min-h-0 min-w-0 flex flex-col w-full lg:w-[calc(50%-12px)] h-full overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white/40 dark:bg-black/20 z-10">
        <div className="flex-1 min-h-0 flex flex-col w-full h-full overflow-hidden">
          {leftPage}
        </div>
      </div>

      {/* 🔗 CENTER RING BINDER SPINE (Authentic open 2-page book binding!) */}
      <div className="hidden lg:flex w-6 shrink-0 h-full center-ring-spine flex-col justify-between py-6 items-center z-20 select-none border-x border-[var(--border-color)]">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="binder-ring my-1 shadow-xs transform hover:scale-105 transition-transform" />
        ))}
      </div>

      {/* 📖 RIGHT PAGE CONTAINER (50% split on desktop, internal micro-scrolling ready) */}
      <div className="flex-1 min-h-0 min-w-0 flex flex-col w-full lg:w-[calc(50%-12px)] h-full overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white/40 dark:bg-black/20 z-10">
        <div className="flex-1 min-h-0 flex flex-col w-full h-full overflow-hidden">
          {rightPage}
        </div>
      </div>

    </div>
  );
};
