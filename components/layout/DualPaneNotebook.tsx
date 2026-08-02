"use client";
import React from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Film, BookOpen, Sparkles } from 'lucide-react';

interface DualPaneNotebookProps {
  leftPage: React.ReactNode;
  rightPage: React.ReactNode;
}

export const DualPaneNotebook: React.FC<DualPaneNotebookProps> = ({ leftPage, rightPage }) => {
  const { diaryState, setDiaryState, coverCustomization } = useMovieDiary();

  const isClosed = diaryState === 'closed' || diaryState === 'closing';

  return (
    <div className="flex flex-col lg:flex-row items-stretch h-full w-full min-h-0 overflow-visible relative">
      
      {/* 📖 LEFT PANEL 3D HINGE CONTAINER (pivots 180 degrees over to the right side around binder axis!) */}
      <div className="flex-1 min-h-0 min-w-0 flex flex-col w-full lg:w-[calc(50%-12px)] h-full z-40 relative">
        {/* Single 3D Card Wrapper (#left-panel controlled by .notebook-wrapper.closed #left-panel) */}
        <div id="left-panel" className="w-full h-full relative">
          
          {/* FRONT FACE (.page-front - Left Page Interior Table of Contents / Calendar) */}
          <div className={`page-front overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 diary-paper-texture bg-[var(--surface-card)] shadow-2xl rounded-l-3xl border-y-2 border-l-2 border-[var(--border-color)] flex flex-col ${isClosed ? 'pointer-events-none' : ''}`}>
            <div className="flex-1 min-h-0 flex flex-col w-full h-full overflow-hidden">
              {leftPage}
            </div>
          </div>

          {/* BACK FACE (.page-back - Solid Color Outer Notebook Cover with Customization Support!) */}
          <div 
            onClick={() => {
              if (isClosed) setDiaryState('open');
            }}
            style={{
              backgroundColor: coverCustomization?.color && coverCustomization.color !== 'default'
                ? coverCustomization.color
                : undefined,
            }}
            title="Click anywhere on the cover to smoothly slide out and unfold diary"
            className="page-back rounded-r-3xl rounded-l-md border-4 border-black/20 dark:border-white/10 shadow-[25px_25px_60px_rgba(0,0,0,0.65)] cursor-pointer overflow-hidden select-none flex flex-col items-center justify-center p-8 sm:p-12 relative"
          >
            {/* Custom Title Inscription */}
            {coverCustomization?.title ? (
              <div className="z-10 text-center my-auto px-6 max-w-[85%] border-2 border-white/20 p-6 rounded-2xl bg-black/15 backdrop-blur-[2px] shadow-lg">
                <h2 
                  style={{ color: coverCustomization.titleColor || '#FFFFFF' }}
                  className="text-2xl sm:text-4xl font-serif font-black tracking-wide uppercase drop-shadow-md leading-snug"
                >
                  {coverCustomization.title}
                </h2>
              </div>
            ) : null}

            {/* Sticker Decals Arranged around the Cover */}
            {coverCustomization?.stickers && coverCustomization.stickers.length > 0 ? (
              <div className="absolute inset-4 sm:inset-8 z-0 pointer-events-none flex flex-wrap items-center justify-center gap-6 sm:gap-8 overflow-hidden opacity-95">
                {coverCustomization.stickers.map((sticker, idx) => {
                  const rotations = ['rotate-12', '-rotate-12', 'rotate-6', '-rotate-6', 'rotate-3', '-rotate-3'];
                  const tilt = rotations[idx % rotations.length];
                  return (
                    <span 
                      key={idx} 
                      className={`text-4xl sm:text-6xl filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)] transform ${tilt} transition-transform hover:scale-125 pointer-events-auto`}
                    >
                      {sticker}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>

        </div>
      </div>

      {/* 🔗 CENTER RING BINDER SPINE (The exact pivot line! Fades away when closed so only solid cover remains) */}
      <div className={`hidden lg:flex w-6 shrink-0 h-full center-ring-spine diary-paper-texture bg-[var(--surface-card)] shadow-inner flex-col justify-between py-8 items-center z-30 select-none border-x border-y-2 border-[var(--border-color)] transition-opacity duration-500 ${isClosed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="binder-ring my-1 shadow-xs transform hover:scale-105 transition-transform" />
        ))}
      </div>

      {/* 📖 RIGHT PAGE CONTAINER (Fades underneath as cover folds over it so ONLY the solid book cover can be seen!) */}
      <div className={`flex-1 min-h-0 min-w-0 flex flex-col w-full lg:w-[calc(50%-12px)] h-full overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 diary-paper-texture bg-[var(--surface-card)] shadow-2xl z-10 rounded-r-3xl border-y-2 border-r-2 border-[var(--border-color)] transition-opacity duration-500 ${isClosed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex-1 min-h-0 flex flex-col w-full h-full overflow-hidden">
          {rightPage}
        </div>
      </div>

    </div>
  );
};


