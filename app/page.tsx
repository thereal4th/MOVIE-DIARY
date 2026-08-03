/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
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
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { CustomizeCoverModal } from '../components/modals/CustomizeCoverModal';
import { Film, Sun, Moon, Plus, Sparkles, Settings, X, BookOpen, Palette } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab, theme, toggleTheme, setIsLogModalOpen, setIsAccountModalOpen, setIsCustomizeCoverModalOpen, setEditingMovie, setPrefillMovie, userProfile, diaryState, setDiaryState } = useMovieDiary();

  const handleOpenLogModal = () => {
    setEditingMovie(null);
    setPrefillMovie(null);
    setIsLogModalOpen(true);
  };

  const handleCloseNotebook = () => {
    setDiaryState('closed');
  };

  const handleOpenNotebook = () => {
    setDiaryState('open');
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
          {diaryState === 'closed' && (
            <button
              onClick={() => setIsCustomizeCoverModalOpen(true)}
              title="Customize Book Cover Color, Inscription & Stickers"
              className="w-9 h-9 rounded-full bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border-2 border-[var(--border-color)] flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform select-none cursor-pointer animate-fade-in"
            >
              {theme === 'day' ? (
                <Palette className="w-4.5 h-4.5 text-amber-500 fill-amber-300/20 stroke-[2.5]" />
              ) : (
                <Palette className="w-4.5 h-4.5 text-rose-600 fill-rose-400/20 stroke-[2.5]" />
              )}
            </button>
          )}

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
        
        {/* Theme-aligned round X close button fixed on the far-right margin (Only visible when notebook is open!) */}
        {diaryState !== 'closed' && (
          <button
            onClick={() => setDiaryState('closed')}
            title="Fold Notebook Closed"
            className="theme-x-btn fixed top-[58px] sm:top-[66px] right-3 sm:right-6 lg:right-8 z-[100] w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 select-none cursor-pointer group animate-fadeIn shadow-2xl"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] transition-transform duration-300 group-hover:rotate-90" />
          </button>
        )}


        {/* Outer Notebook Wrapper (Transparent container so no background paper remains visible when closed!) */}
        <div className={`notebook-wrapper w-full h-full flex flex-row relative z-20 overflow-visible ${diaryState === 'closed' ? 'closed' : ''}`}>
          
          {/* Automatically fade out side divider tabs when notebook is closed */}
          <div className={`transition-opacity duration-500 ${diaryState === 'closed' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <NotebookSideTabs />
          </div>

          {/* Journal Interior Content Area */}
          <main className="flex-1 min-w-0 min-h-0 overflow-visible z-10 w-full flex flex-col h-full">
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
      <EditProfileModal />
      <CustomizeCoverModal />

      {/* Floating Lower-Right Account Center Action (Only visible when notebook is closed!) */}
      {diaryState === 'closed' && (
        <button
          onClick={() => setIsAccountModalOpen(true)}
          className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer select-none group animate-fadeIn"
          title="Open User Dashboard & Account Center"
        >
          <Settings className="w-5 h-5 text-rose-500 stroke-[2.5] transition-transform duration-500 group-hover:rotate-90" />
        </button>
      )}
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
