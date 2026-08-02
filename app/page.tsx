/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { MovieDiaryProvider, useMovieDiary } from '../context/MovieDiaryContext';
import { NotebookSideTabs } from '../components/layout/Navbar';
import { BinderSpine } from '../components/layout/BinderSpine';
import { WatchedLibrary } from '../components/library/WatchedLibrary';
import { FriendsSection } from '../components/friends/FriendsSection';
import { RecommendationsSection } from '../components/recommendations/RecommendationsSection';
import { MyProfile } from '../components/profile/MyProfile';
import { LogMovieModal } from '../components/modals/LogMovieModal';
import { FriendProfileModal } from '../components/friends/FriendProfileModal';
import { Film, Sun, Moon, Plus, Sparkles } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab, theme, toggleTheme, setIsLogModalOpen, setEditingMovie, setPrefillMovie } = useMovieDiary();

  const handleOpenLogModal = () => {
    setEditingMovie(null);
    setPrefillMovie(null);
    setIsLogModalOpen(true);
  };

  return (
    <div className="h-screen max-h-screen w-full flex flex-col gingham-tablecloth transition-colors duration-400 font-sans p-2 sm:p-3 lg:p-5 items-center overflow-hidden">
      
      {/* Upper Tablecloth Bar Outside Notebook: "Filmory" on Left, Controls on Right! */}
      <header className="w-full max-w-[1550px] shrink-0 flex items-center justify-between mb-2.5 sm:mb-3 select-none z-30 px-2 sm:px-4">
        
        {/* Top Left: Filmory Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] flex items-center justify-center shadow-md border-2 border-white/80 transform -rotate-6 hover:rotate-0 transition-transform text-[var(--text-primary)]">
            <Film className="w-5.5 h-5.5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-black text-xl sm:text-2xl tracking-tight text-[var(--tablecloth-text)] font-sans leading-none drop-shadow-sm transition-colors">
              Filmory
            </h1>
            <span className="text-[10px] font-black uppercase text-[var(--tablecloth-subtext)] tracking-wider block mt-0.5 transition-colors">
              2-Page Open Cinema Journal
            </span>
          </div>
        </div>

        {/* Top Right: Lucide Theme Switcher & Log Movie Action */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            title={theme === 'day' ? 'Switch to Red Gingham with Green Accents' : 'Switch to Classic Black Gingham with Cream Paper'}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border-2 border-[var(--border-color)] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform select-none cursor-pointer"
          >
            {theme === 'day' ? (
              <Sun className="w-5 h-5 text-amber-500 fill-amber-400 stroke-[2.5]" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-400 fill-indigo-300 stroke-[2.5]" />
            )}
          </button>

          <button
            onClick={handleOpenLogModal}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-linear-to-r from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 select-none cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3] transition-transform group-hover:rotate-90" />
            <span>Log Movie</span>
          </button>
        </div>
      </header>
      
      {/* 📖 Perfectly Centered 100vh Locked Notebook Wrapper! */}
      <div className="max-w-[1550px] w-full flex-1 min-h-0 flex items-stretch justify-center relative mb-1">
        
        {/* Main Leatherette Bound Diary Paper Content Frame: 100vh Locked & 2-Page Split! */}
        <div className="w-full h-full diary-notebook-frame diary-paper-texture flex flex-row relative z-20 shadow-2xl rounded-3xl overflow-visible">
          
          {/* Absolutely position side divider tabs on outer right rim! */}
          <NotebookSideTabs />

          {/* Journal Paper Interior Content Area: 100vh fixed container for Left & Right pages */}
          <main className="flex-1 min-w-0 min-h-0 overflow-hidden rounded-3xl z-10 w-full flex flex-col h-full">
            {activeTab === 'library' && <WatchedLibrary />}
            {activeTab === 'friends' && <FriendsSection />}
            {activeTab === 'discover' && <RecommendationsSection />}
            {activeTab === 'profile' && <MyProfile />}
          </main>
        </div>
      </div>

      {/* Global Interactive Modals */}
      <LogMovieModal />
      <FriendProfileModal />

      {/* Cozy Minimal Compact Footer */}
      <footer className="w-full shrink-0 pt-1 text-center text-[10px] text-[var(--tablecloth-subtext)] font-extrabold uppercase tracking-widest transition-colors hidden sm:flex items-center justify-center gap-1.5 z-10">
        <Sparkles className="w-3 h-3 text-[var(--tablecloth-text)] inline" />
        <span>Filmory • Open Dual-Pane Analog Archives</span>
      </footer>
    </div>
  );
};

export default function Home() {
  return (
    <MovieDiaryProvider>
      <DashboardContent />
    </MovieDiaryProvider>
  );
}
