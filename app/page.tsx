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
    <div className="min-h-screen flex flex-col gingham-tablecloth transition-colors duration-400 font-sans pb-20 pt-6 sm:pt-8 px-4 sm:px-12 lg:px-24 xl:px-32 items-center overflow-x-hidden">
      
      {/* Upper Tablecloth Bar Outside Notebook: "Filmory" on Left, Controls on Right! */}
      <header className="w-full max-w-6xl flex items-center justify-between mb-5 sm:mb-6 select-none z-30">
        
        {/* Top Left: Filmory Brand Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] flex items-center justify-center shadow-md border-2 border-white/80 transform -rotate-6 hover:rotate-0 transition-transform text-[var(--text-primary)]">
            <Film className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-black text-2xl sm:text-3xl tracking-tight text-[var(--tablecloth-text)] font-sans leading-none drop-shadow-sm transition-colors">
              Filmory
            </h1>
            <span className="text-[10px] font-black uppercase text-[var(--tablecloth-subtext)] tracking-wider block mt-0.5 transition-colors">
              Analog Cinema Keepsake
            </span>
          </div>
        </div>

        {/* Top Right: Lucide Theme Switcher & Log Movie Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title={theme === 'day' ? 'Switch to Red Gingham with Green Accents' : 'Switch to Classic Black Gingham with Cream Paper'}
            className="w-12 h-12 rounded-full bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border-2 border-[var(--border-color)] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform text-xl select-none cursor-pointer"
          >
            {theme === 'day' ? (
              <Sun className="w-5 h-5 text-amber-500 fill-amber-400 stroke-[2.5]" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-400 fill-indigo-300 stroke-[2.5]" />
            )}
          </button>

          <button
            onClick={handleOpenLogModal}
            className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-linear-to-r from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 select-none cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3] transition-transform group-hover:rotate-90" />
            <span>Log Movie</span>
          </button>
        </div>
      </header>
      
      {/* 📖 Perfectly Centered Bounded Notebook Wrapper with Fixed Height and Internal Scrolling! */}
      <div className="max-w-6xl w-full flex items-center justify-center relative my-1">
        
        {/* Main Leatherette Bound Diary Paper Content Frame: Double length and internally scrollable! */}
        <div className="w-full diary-notebook-frame diary-paper-texture flex flex-row h-[1400px] sm:h-[1500px] lg:h-[1600px] relative z-20 shadow-2xl rounded-3xl overflow-visible">
          
          {/* Absolutely position side divider tabs on outer right rim! */}
          <NotebookSideTabs />

          {/* Left Spine with Metal Ring Loops */}
          <div className="shrink-0 h-full overflow-hidden rounded-l-[28px] py-4 flex flex-col justify-between">
            <BinderSpine />
          </div>

          {/* Journal Paper Interior Content Area: Fixed notebook page where only overflowing children scroll */}
          <main className="flex-1 px-4 sm:px-8 lg:px-14 py-8 overflow-hidden animate-fadeIn z-10 w-full flex flex-col h-full">
            
            {/* Flipped Chapter Content Wrapper */}
            <div className="flex-1 min-h-0 w-full flex flex-col max-w-full overflow-hidden pb-2">
              {activeTab === 'library' && <WatchedLibrary />}
              {activeTab === 'friends' && <FriendsSection />}
              {activeTab === 'discover' && <RecommendationsSection />}
              {activeTab === 'profile' && <MyProfile />}
            </div>
          </main>
        </div>
      </div>

      {/* Global Interactive Modals */}
      <LogMovieModal />
      <FriendProfileModal />

      {/* Cozy Minimal Footer */}
      <footer className="w-full mt-14 py-6 text-center text-xs text-[var(--tablecloth-subtext)] font-extrabold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[var(--tablecloth-text)] inline" />
        <span>Filmory • Personal Ring Binder Archives</span>
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
