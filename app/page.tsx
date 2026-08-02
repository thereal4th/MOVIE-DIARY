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
import { AccountCenterModal } from '../components/modals/AccountCenterModal';
import { Film, Sun, Moon, Plus, Sparkles, Settings } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab, theme, toggleTheme, setIsLogModalOpen, setIsAccountModalOpen, setEditingMovie, setPrefillMovie } = useMovieDiary();

  const handleOpenLogModal = () => {
    setEditingMovie(null);
    setPrefillMovie(null);
    setIsLogModalOpen(true);
  };

  return (
    <div className="h-screen max-h-screen w-full flex flex-col gingham-tablecloth transition-colors duration-400 font-sans p-1.5 sm:p-2.5 lg:px-4 lg:py-2 items-center overflow-hidden">
      
      {/* Upper Tablecloth Bar Outside Notebook: "Filmoire" on Left, Controls on Right! */}
      <header className="w-full max-w-[1360px] shrink-0 flex items-center justify-between mb-1.5 select-none z-30 px-2">
        
        {/* Top Left: Filmoire Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] flex items-center justify-center shadow-md border-2 border-white/80 transform -rotate-6 hover:rotate-0 transition-transform text-[var(--text-primary)]">
            <Film className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-black text-lg sm:text-xl tracking-tight text-[var(--tablecloth-text)] font-sans leading-none drop-shadow-xs transition-colors">
              Filmoire
            </h1>
            <span className="text-[9px] font-black uppercase text-[var(--tablecloth-subtext)] tracking-wider block transition-colors">
              Fourth and Sheena's Movie Journal
            </span>
          </div>
        </div>

        {/* Top Right: Lucide Theme Switcher & Log Movie Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            title={theme === 'day' ? 'Switch to Red Gingham with Green Accents' : 'Switch to Classic Black Gingham with Cream Paper'}
            className="w-9 h-9 rounded-full bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border-2 border-[var(--border-color)] flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform select-none cursor-pointer"
          >
            {theme === 'day' ? (
              <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-400 stroke-[2.5]" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-indigo-400 fill-indigo-300 stroke-[2.5]" />
            )}
          </button>

          <button
            onClick={handleOpenLogModal}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider bg-linear-to-r from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 select-none cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3] transition-transform group-hover:rotate-90" />
            <span>Log Movie</span>
          </button>
        </div>
      </header>
      
      {/* 📖 Perfectly Centered 100vh Locked Notebook Wrapper! */}
      <div className="max-w-[1360px] w-full flex-1 min-h-0 flex items-stretch justify-center relative mb-0.5">
        
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
      <AccountCenterModal />

      {/* Floating Lower-Left Account Center Action (No Label) */}
      <button
        onClick={() => setIsAccountModalOpen(true)}
        className="fixed bottom-3.5 left-3.5 sm:bottom-5 sm:left-5 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer select-none group"
        title="Open User Dashboard & Account Center"
      >
        <Settings className="w-5 h-5 text-rose-500 stroke-[2.5] transition-transform duration-500 group-hover:rotate-90" />
      </button>
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
