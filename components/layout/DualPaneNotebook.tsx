"use client";
import React from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Film, BookOpen, Sparkles } from 'lucide-react';

interface DualPaneNotebookProps {
  leftPage: React.ReactNode;
  rightPage: React.ReactNode;
}

export const DualPaneNotebook: React.FC<DualPaneNotebookProps> = ({ leftPage, rightPage }) => {
  const { diaryState, setDiaryState, userProfile } = useMovieDiary();

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

          {/* BACK FACE (.page-back - Solid Color Outer Notebook Cover with ZERO paper/line textures!) */}
          <div 
            onClick={() => {
              if (isClosed) setDiaryState('open');
            }}
            title="Click anywhere on the cover to smoothly slide out and unfold diary"
            className="page-back rounded-r-3xl rounded-l-md border-4 border-amber-950 shadow-[25px_25px_60px_rgba(0,0,0,0.7)] cursor-pointer overflow-hidden flex flex-col items-center justify-between p-8 sm:p-12 text-center select-none"
          >
            {/* Hinge spine shadow facing the center rings on left */}
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-linear-to-r from-black/50 via-black/20 to-transparent border-r border-amber-900/40 shadow-inner" />
            
            {/* Elegant bookmark ribbon hanging down on cover */}
            <div className="absolute -bottom-4 right-16 w-8 h-20 bg-rose-700 shadow-xl border-x border-rose-950/50 rounded-b-sm transform rotate-3 z-0" />

            {/* Clean Solid Cover Plate (No paper texture) */}
            <div className="w-full max-w-sm h-full border-2 border-amber-400/40 rounded-2xl p-6 flex flex-col items-center justify-between z-10 bg-black/20 relative overflow-hidden shadow-inner my-auto">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg border-2 border-amber-200 text-amber-950 mx-auto mt-2 transform hover:rotate-12 transition-transform">
                <Film className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div className="space-y-3 my-auto px-4">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-200 text-xs font-black tracking-widest uppercase inline-block shadow-xs">
                  Vol. I • Cinema Edition
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-wider text-amber-100 uppercase font-serif drop-shadow-md">
                  Movie Diary
                </h2>
                <div className="w-16 h-1 bg-linear-to-r from-transparent via-amber-400 to-transparent mx-auto opacity-75" />
                <p className="text-xs font-extrabold text-amber-200/80 tracking-wider uppercase">
                  Click Cover to Unfold & Center
                </p>
              </div>

              <div className="px-5 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-100 font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 mx-auto mb-2 group hover:scale-105 transition-all">
                <BookOpen className="w-4 h-4 text-amber-400 stroke-[2.5] group-hover:scale-110 transition-transform" />
                <span>Unfold Diary</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300 animate-pulse" />
              </div>
            </div>
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


