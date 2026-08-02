/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Movie, Friend } from '../../types/diary';
import { DualPaneNotebook } from '../layout/DualPaneNotebook';
import { Award, Users, PenTool, Film, Star, Clock, Calendar, Sparkles, Popcorn, Glasses, Clapperboard, Trophy, Share2, Globe, BarChart3, Bookmark, Scroll, ShieldCheck, TrendingUp, Plus, Edit3, X } from 'lucide-react';

export const MyProfile: React.FC = () => {
  const { userProfile, updateUserProfile, movies, friends, setIsLogModalOpen, setEditingMovie, setPrefillMovie } = useMovieDiary();

  // Edit Profile modal & form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || "Fourth & Sheena's Cinema",
    handle: userProfile?.handle || "fourth_and_sheena",
    avatar: userProfile?.avatar || "/images/avatars/default.png",
    bannerUrl: userProfile?.bannerUrl || "/images/posters/past_lives.jpg",
    bio: userProfile?.bio ?? "Cinema enthusiasts watching everything from Studio Ghibli to Greta Gerwig masterpieces.",
    tastePhilosophy: userProfile?.tastePhilosophy ?? "Every screening is an event. We judge films by emotions, set design, and storytelling craftsmanship.",
    favoriteQuote: userProfile?.favoriteQuote ?? "In another life, I would have really liked just doing laundry and taxes with you.",
    favoriteQuoteMovie: userProfile?.favoriteQuoteMovie ?? "Everything Everywhere All at Once (2022)",
    favoriteQuoteCharacter: userProfile?.favoriteQuoteCharacter ?? "Waymond Wang"
  });

  const handleOpenEditModal = () => {
    setEditForm({
      name: userProfile?.name || "",
      handle: userProfile?.handle || "",
      avatar: userProfile?.avatar || "",
      bannerUrl: userProfile?.bannerUrl || "/images/posters/past_lives.jpg",
      bio: userProfile?.bio || "",
      tastePhilosophy: userProfile?.tastePhilosophy || "",
      favoriteQuote: userProfile?.favoriteQuote || "",
      favoriteQuoteMovie: userProfile?.favoriteQuoteMovie || "",
      favoriteQuoteCharacter: userProfile?.favoriteQuoteCharacter || ""
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editForm.name,
      handle: editForm.handle,
      avatar: editForm.avatar,
      bannerUrl: editForm.bannerUrl,
      bio: editForm.bio,
      tastePhilosophy: editForm.tastePhilosophy,
      favoriteQuote: editForm.favoriteQuote,
      favoriteQuoteMovie: editForm.favoriteQuoteMovie,
      favoriteQuoteCharacter: editForm.favoriteQuoteCharacter
    });
    setIsEditModalOpen(false);
  };

  // Right Page sub-navigation tab switch
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'lists' | 'reviews' | 'badges'>('analytics');

  // Quick Stats computations
  const quickStats = useMemo(() => {
    const totalFilms = movies.length;
    const totalMinutes = movies.reduce((acc, m) => acc + (m.runtimeMinutes || 0), 0);
    const totalHours = Math.round(totalMinutes / 60);
    const totalDays = (totalHours / 24).toFixed(1);
    const loggedThisYear = movies.filter(m => m.dateWatched?.startsWith('2026') || m.dateWatched?.startsWith(new Date().getFullYear().toString())).length;
    
    return {
      totalFilms,
      totalHours,
      totalDays,
      loggedThisYear,
      followers: userProfile?.followersCount || 1284,
      following: userProfile?.followingCount || 142
    };
  }, [movies, userProfile]);

  // Top 4 Favorite Film Treasures (Letterboxd iconic row!)
  const topFourMovies = useMemo(() => {
    const favorites = movies.filter((m) => m.favorite);
    const sortedByRating = [...(favorites.length >= 4 ? favorites : movies)].sort((a, b) => b.userRating - a.userRating);
    return sortedByRating.slice(0, 4);
  }, [movies]);

  // Best Movie Buddy (Person Tagged Most)
  const bestMovieBuddy = useMemo(() => {
    const counts: Record<string, number> = {};
    movies.forEach((m) => {
      (m.taggedFriendIds || []).forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });

    let topId: string | null = null;
    let maxCount = 0;
    Object.entries(counts).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topId = id;
      }
    });

    if (topId) {
      const friendObj = friends.find((f) => f.id === topId);
      if (friendObj) return { friend: friendObj, count: maxCount };
    }
    return friends[0] ? { friend: friends[0], count: 5 } : null;
  }, [movies, friends]);

  // Rating Distribution Histogram (1 to 5 stars)
  const ratingDistribution = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    movies.forEach(m => {
      const star = Math.round(m.userRating) || 5;
      if (star >= 1 && star <= 5) counts[star as 1|2|3|4|5] = (counts[star as 1|2|3|4|5] || 0) + 1;
    });
    const maxVal = Math.max(...Object.values(counts), 1);
    return { counts, maxVal };
  }, [movies]);

  /* ========================================================================= */
  /* 📖 LEFT PAGE: Identity, Favorite Movie Quote, & Top 4 Favorites Showcase  */
  /* ========================================================================= */
  const leftPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-hidden">
      
      {/* Internal Micro-Scrolling Left Page Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-6">
        
        {/* MODULE 1: HEADER & IDENTITY BLOCK */}
        <div className="rounded-3xl overflow-hidden border-2 border-[var(--border-color)] shadow-sm bg-[var(--surface-card)] relative">
          
          {/* High-Res Background Banner */}
          <div className="h-32 sm:h-36 w-full relative overflow-hidden bg-slate-950">
            <img
              src={userProfile.bannerUrl || "/images/posters/past_lives.jpg"}
              alt="Cinematic Banner"
              className="w-full h-full object-cover object-center opacity-80 filter brightness-95 transform scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[var(--surface-card)] via-transparent to-black/40"></div>

            {/* Edit Profile Button (Symbol only in Top Right Corner) */}
            <button
              onClick={handleOpenEditModal}
              className="absolute top-3 right-3.5 z-20 p-2 rounded-xl bg-black/55 hover:bg-[var(--accent-honey)] hover:text-[var(--accent-honey-text)] text-white border border-white/30 transition-all cursor-pointer shadow-md backdrop-blur-xs hover:scale-110 flex items-center justify-center"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Identity Info & Mascot Container */}
          <div className="px-5 pb-5 pt-0 flex flex-col items-start gap-4 relative z-10">
            
            {/* Avatar & Display Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 -mt-12 w-full">
              <div className="w-22 h-22 rounded-full overflow-hidden border-4 border-[var(--surface-card)] shadow-xl shrink-0 bg-white relative z-20">
                <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
              </div>

              <div className="pt-2 sm:pt-12 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                    {userProfile.name}
                  </h2>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-500 text-white uppercase tracking-wide flex items-center gap-1 shadow-2xs">
                    <span>VIP Auteur</span>
                    <PenTool className="w-2.5 h-2.5 stroke-[2.5]" />
                  </span>
                </div>
                <p className="text-xs font-extrabold text-[var(--accent-sakura-text)] font-mono">@{userProfile.handle}</p>
                {userProfile.bio && userProfile.bio.trim() !== '' && (
                  <p className="text-xs text-[var(--text-secondary)] italic font-serif mt-1">
                    "{userProfile.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 flex-wrap w-full border-t border-[var(--border-color)]/60 pt-3">
              {userProfile.socialLinks?.letterboxd && (
                <a href={userProfile.socialLinks.letterboxd} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border-color)] flex items-center gap-1 transition-colors">
                  <Film className="w-3 h-3 text-emerald-500 stroke-[2.5]" />
                  <span>Letterboxd</span>
                </a>
              )}
              {userProfile.socialLinks?.twitter && (
                <a href={userProfile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border-color)] flex items-center gap-1 transition-colors">
                  <Share2 className="w-3 h-3 text-sky-400 stroke-[2.5]" />
                  <span>Twitter / X</span>
                </a>
              )}
              {userProfile.socialLinks?.instagram && (
                <a href={userProfile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border-color)] flex items-center gap-1 transition-colors">
                  <Sparkles className="w-3 h-3 text-pink-400 stroke-[2.5]" />
                  <span>Instagram</span>
                </a>
              )}
            </div>

            {/* Favorite Movie Quote Showcase */}
            <div className="w-full bg-linear-to-br from-[var(--surface-subtle)] via-[var(--surface-card)] to-[var(--surface-subtle)] p-4 rounded-2xl border-2 border-[var(--border-color)] shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-[var(--accent-honey)]/15 via-[var(--accent-sakura)]/10 to-transparent rounded-full pointer-events-none blur-xl"></div>
              
              <div className="relative z-10 space-y-2">
                <blockquote className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] font-serif italic leading-relaxed pl-3.5 border-l-3 border-[var(--accent-honey)]">
                  "{userProfile.favoriteQuote || "In another life, I would have really liked just doing laundry and taxes with you."}"
                </blockquote>

                <div className="flex items-center justify-end gap-1.5 text-right text-xs pt-0.5 flex-wrap">
                  <span className="font-extrabold text-[var(--text-primary)] font-sans">
                    — {userProfile.favoriteQuoteCharacter || "Waymond Wang"}
                  </span>
                  <span className="text-[var(--text-muted)] font-bold">in</span>
                  <span className="font-black text-[var(--accent-sakura-text)] font-sans">
                    {userProfile.favoriteQuoteMovie || "Everything Everywhere All at Once (2022)"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Horizontal Quick Stats Strip */}
          <div className="px-5 py-3 bg-[var(--surface-subtle)] border-t border-[var(--border-color)]/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="font-black text-[var(--text-primary)] block text-base">{quickStats.totalFilms}</span>
              <span className="text-[9px] font-extrabold text-[var(--text-muted)] uppercase">Total Films</span>
            </div>
            <div>
              <span className="font-black text-[var(--text-primary)] block text-base">{quickStats.totalHours}h</span>
              <span className="text-[9px] font-extrabold text-[var(--text-muted)] uppercase">{quickStats.totalDays} Days Watched</span>
            </div>
            <div>
              <span className="font-black text-[var(--text-primary)] block text-base">{quickStats.loggedThisYear}</span>
              <span className="text-[9px] font-extrabold text-[var(--text-muted)] uppercase">2026 Screenings</span>
            </div>
            <div>
              <span className="font-black text-[var(--text-primary)] block text-base">{quickStats.followers}</span>
              <span className="text-[9px] font-extrabold text-[var(--text-muted)] uppercase">Followers</span>
            </div>
          </div>
        </div>

        {/* MODULE 2: SIGNATURE TOP 4 FAVORITE MOVIES ROW */}
        <div className="p-5 rounded-3xl bg-linear-to-tr from-[var(--surface-card)] via-[var(--accent-lavender)]/20 to-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm space-y-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Signature Top 4 Favorites</span>
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] font-extrabold">Your all-time highest rated film monuments</p>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[var(--accent-honey)] text-[var(--accent-honey-text)]">
              5.0 ★ Masterpieces
            </span>
          </div>

          {/* 4-Poster Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {Array.from({ length: 4 }).map((_, idx) => {
              const movie = topFourMovies[idx];
              const medals = ['#1 Diamond', '#2 Gold', '#3 Silver', '#4 Bronze'];
              const badgeColors = ['bg-amber-500 text-white', 'bg-yellow-500 text-white', 'bg-slate-400 text-white', 'bg-amber-700 text-white'];

              return movie ? (
                <div key={movie.id} onClick={() => { setEditingMovie(movie); setPrefillMovie(null); setIsLogModalOpen(true); }} className="group p-2 rounded-2xl bg-white/80 dark:bg-black/40 border border-[var(--border-color)] shadow-xs hover:shadow-md transition-all flex flex-col items-center cursor-pointer">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-1.5 shadow-2xs ${badgeColors[idx] || 'bg-pink-500 text-white'}`}>
                    {medals[idx]}
                  </span>
                  <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-[var(--border-color)] relative shadow-2xs">
                    <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="font-black text-xs text-[var(--text-primary)] truncate w-full text-center mt-1 group-hover:text-pink-500">{movie.title}</h4>
                  <span className="text-[10px] font-extrabold text-amber-500 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current inline" />
                    <span>{movie.userRating.toFixed(1)}</span>
                  </span>
                </div>
              ) : (
                <div key={`empty-${idx}`} onClick={() => { setPrefillMovie(null); setEditingMovie(null); setIsLogModalOpen(true); }} className="aspect-[2/3] rounded-2xl bg-[var(--surface-subtle)]/50 border-2 border-dashed border-[var(--border-color)]/60 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                  <Plus className="w-6 h-6 text-[var(--text-muted)] mb-1 stroke-[2.5]" />
                  <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase">Add Top #{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );

  /* ========================================================================= */
  /* 📖 RIGHT PAGE: Analytics & Sub-Tab Archives (Reviews, Lists, Badges)    */
  /* ========================================================================= */
  const rightPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-hidden">
      
      {/* Locked Sub-Navigation Header */}
      <div className="shrink-0 flex flex-col gap-3 pb-4 border-b-2 border-[var(--border-color)]/70">
        <div>
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2 font-serif">
            <BarChart3 className="w-5 h-5 text-purple-500 stroke-[2.5]" />
            <span>Analytics & Archives</span>
          </h3>
          <p className="text-xs font-extrabold text-[var(--text-muted)] tracking-wide mt-0.5">
            Explore your screening metrics, custom cinema collections, & achievement badges
          </p>
        </div>

        {/* Sub-Navigation Tabs Switcher Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-[var(--surface-subtle)] rounded-2xl border border-[var(--border-color)] shadow-inner">
          {[
            { key: 'analytics', label: 'DNA & Charts', icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" /> },
            { key: 'lists', label: 'Curated Lists', icon: <Bookmark className="w-3.5 h-3.5 text-pink-500 stroke-[2.5]" /> },
            { key: 'reviews', label: 'All Reviews', icon: <Scroll className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" /> },
            { key: 'badges', label: 'VIP Badges', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-500 stroke-[2.5]" /> },
          ].map((tab) => {
            const isActive = activeSubTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key as any)}
                className={`py-2 px-2.5 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-md scale-102 ring-1 ring-[var(--border-color)] font-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]'
                }`}
              >
                <span className={isActive ? 'text-[var(--accent-honey-text)] transition-colors' : 'transition-colors'}>{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Internal Micro-Scrolling Right Page Content Area */}
      <div className={`flex-1 min-h-0 overflow-x-hidden ${activeSubTab === 'analytics' ? 'overflow-y-hidden pb-1 space-y-4' : 'overflow-y-auto pr-2 pb-6 space-y-6'} no-scrollbar`}>
        
        {/* TAB 1: VISUAL ANALYTICS (Rating Bar Chart & Top Auteurs) */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-3.5 animate-fadeIn">
            
            {/* Rating Spectrum Histogram Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-md space-y-3 relative overflow-hidden group">
              {/* Subtle ambient decorative backdrop gradient */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)]/60 pb-2.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm font-black tracking-tight text-[var(--text-primary)] uppercase font-serif">
                    Screening Sentiment Spectrum
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[var(--surface-subtle)] px-3 py-1 rounded-xl border border-[var(--border-color)] shadow-inner">
                  <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">Avg Score:</span>
                  <span className="text-xs font-black text-amber-500 flex items-center gap-0.5">
                    <span>{quickStats.avgRating}</span>
                    <Star className="w-3 h-3 fill-amber-500" />
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-0.5 relative z-10">
                {[
                  { star: 5, label: 'Masterpieces', colors: 'from-amber-400 via-rose-500 to-purple-600', text: 'text-amber-500' },
                  { star: 4, label: 'Exceptional', colors: 'from-emerald-400 to-teal-500', text: 'text-emerald-500' },
                  { star: 3, label: 'Enjoyable', colors: 'from-sky-400 to-blue-600', text: 'text-sky-500' },
                  { star: 2, label: 'Mixed Feelings', colors: 'from-amber-500 to-orange-600', text: 'text-orange-500' },
                  { star: 1, label: 'Critical Pass', colors: 'from-rose-500 to-red-700', text: 'text-rose-500' },
                ].map(({ star, label, colors, text }) => {
                  const count = ratingDistribution.counts[star as 1|2|3|4|5] || 0;
                  const pct = Math.round((count / ratingDistribution.maxVal) * 100);
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs font-black group/bar">
                      <span className={`w-10 text-right font-black shrink-0 flex items-center justify-end gap-1 text-xs ${text}`}>
                        <span>{star}</span>
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </span>
                      
                      <div className="flex-1 h-5 bg-[var(--surface-subtle)] rounded-full overflow-hidden border border-[var(--border-color)]/70 relative p-0.5 shadow-inner flex items-center">
                        <div
                          className={`h-full bg-linear-to-r ${colors} rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 group-hover/bar:brightness-110 shadow-xs`}
                          style={{ width: `${Math.max(pct, 12)}%` }}
                        >
                          <span className="text-[9px] font-black text-white uppercase tracking-wider drop-shadow-sm truncate pl-1">
                            {count} {count === 1 ? 'film' : 'films'}
                          </span>
                        </div>
                      </div>

                      <span className="w-24 text-left text-[var(--text-muted)] font-bold shrink-0 text-[10px] truncate hidden sm:block">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Genres & Most-Watched Auteurs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Cinema Taste DNA Card */}
              <div className="p-4 sm:p-4.5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-md space-y-2.5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] font-serif">
                        Cinema Taste DNA
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-pink-500/10 text-pink-500 border border-pink-500/30 px-2 py-0.5 rounded-md">
                      Top Genres
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { name: "Romance", pct: "38%", num: 38, bar: "bg-pink-500", text: "text-pink-500" },
                      { name: "Animation / Ghibli", pct: "32%", num: 32, bar: "bg-amber-500", text: "text-amber-500" },
                      { name: "Indie / Drama", pct: "30%", num: 30, bar: "bg-purple-500", text: "text-purple-500" }
                    ].map(g => (
                      <div key={g.name} className="p-2 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)]/60 space-y-1.5 shadow-2xs hover:border-[var(--border-color)] transition-colors">
                        <div className="flex items-center justify-between text-xs font-black px-1">
                          <span className="flex items-center gap-2 truncate">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${g.bar} shadow-xs`} />
                            <span className="text-[var(--text-primary)] truncate">{g.name}</span>
                          </span>
                          <span className={`font-mono font-extrabold text-[11px] shrink-0 ml-2 ${g.text}`}>{g.pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${g.bar} rounded-full transition-all duration-700`} style={{ width: `${g.num}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Most-Screened Legends Card */}
              <div className="p-4 sm:p-4.5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-md space-y-2.5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <Clapperboard className="w-3.5 h-3.5 text-purple-500" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] font-serif">
                        Auteur Showcase
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-purple-500/10 text-purple-500 border border-purple-500/30 px-2 py-0.5 rounded-md">
                      Most Screened
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { role: "Director", name: "Greta Gerwig", initials: "GG", count: "4 films", avatarBg: "from-rose-400 to-pink-600" },
                      { role: "Director", name: "Hayao Miyazaki", initials: "HM", count: "3 films", avatarBg: "from-emerald-400 to-teal-700" },
                      { role: "Lead Star", name: "Saoirse Ronan", initials: "SR", count: "5 films", avatarBg: "from-amber-400 via-orange-500 to-purple-600" }
                    ].map((a, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)]/60 font-black shadow-2xs hover:border-[var(--border-color)] transition-colors">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-7 h-7 rounded-xl bg-linear-to-tr ${a.avatarBg} text-white flex items-center justify-center font-extrabold text-[10px] shrink-0 shadow-sm border border-white/40`}>
                            {a.initials}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-[var(--text-primary)] font-bold text-xs truncate leading-tight">{a.name}</span>
                            <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{a.role}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold bg-[var(--surface-card)] px-2.5 py-1 rounded-xl border border-[var(--border-color)] font-mono shrink-0 ml-2 shadow-2xs flex items-center gap-1">
                          <span>{a.count}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CURATED LISTS & WATCHLIST */}
        {activeSubTab === 'lists' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-pink-500" />
              <span>Custom Curated Cinema Lists</span>
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {[
                { title: "Autumn Rainy Day Comforts", count: 14, likes: 82, cover: "/images/posters/totoro.jpg", desc: "Cozy hot cocoa films with hand-painted backgrounds and gentle gentle scores." },
                { title: "Neo-Noir & Cyberpunk Neon", count: 9, likes: 45, cover: "/images/posters/lala_land.jpg", desc: "Nocturnal silhouettes, wet asphalt, and existential reflections." },
                { title: "2026 Masterpieces Watchlist", count: 18, likes: 119, cover: "/images/posters/past_lives.jpg", desc: "Essential theatrical releases to experience before the year ends." }
              ].map((list, i) => (
                <div key={i} className="p-4 rounded-3xl bg-[var(--surface-card)] border border-[var(--border-color)] flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img src={list.cover} alt={list.title} className="w-12 h-16 rounded-xl object-cover shadow-xs shrink-0" />
                    <div className="min-w-0">
                      <h5 className="font-black text-sm text-[var(--text-primary)] truncate">{list.title}</h5>
                      <span className="text-[10px] text-[var(--text-muted)] font-extrabold">{list.count} Films • {list.likes} Community Likes</span>
                      <p className="text-xs text-[var(--text-secondary)] italic font-serif truncate mt-0.5">"{list.desc}"</p>
                    </div>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] font-black text-xs uppercase shrink-0 border border-[var(--border-color)] cursor-pointer">
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WRITTEN REVIEW ARCHIVES */}
        {activeSubTab === 'reviews' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
              <Scroll className="w-4 h-4 text-amber-500" />
              <span>Written Review Archives</span>
            </h4>
            <div className="space-y-3">
              {movies.map(m => (
                <div key={m.id} onClick={() => { setEditingMovie(m); setPrefillMovie(null); setIsLogModalOpen(true); }} className="p-4 rounded-2xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-start gap-3.5 shadow-xs cursor-pointer transition-all">
                  <img src={m.posterPath} alt={m.title} className="w-12 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-black text-sm text-[var(--text-primary)] truncate">{m.title} <span className="text-xs font-bold text-[var(--text-muted)]">({m.releaseYear})</span></h5>
                      <span className="text-xs font-black text-amber-500">{m.userRating.toFixed(1)} ★</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] italic font-serif leading-relaxed line-clamp-2 mt-1">
                      "{m.reviewNotes || "Logged without extended written notes."}"
                    </p>
                    <span className="text-[10px] text-[var(--text-muted)] font-extrabold block mt-1">Logged on {m.dateWatched} • {m.venue || 'Home'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MILESTONE BADGES & BEST MOVIE BUDDY */}
        {activeSubTab === 'badges' && (
          <div className="space-y-6">
            
            {/* Best Movie Buddy Card */}
            {bestMovieBuddy && (
              <div className="p-5 rounded-3xl bg-linear-to-r from-[var(--surface-card)] via-[var(--accent-matcha)]/20 to-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={bestMovieBuddy.friend.avatar} alt={bestMovieBuddy.friend.name} className="w-14 h-14 rounded-full object-cover border-2 border-green-500 shadow-md" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">🏆 Best Movie Buddy Award</span>
                    <h4 className="text-base font-black text-[var(--text-primary)]">{bestMovieBuddy.friend.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] font-extrabold">Tagged in {bestMovieBuddy.count} Screenings Together!</p>
                  </div>
                </div>
                <span className="hidden sm:block text-xs font-black px-3 py-1 rounded-full bg-emerald-500 text-white shadow-xs">
                  #1 Partner
                </span>
              </div>
            )}

            {/* Unlockable Milestone Badges */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span>Unlockable Achievements & Badges</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { title: "Director's Hat", desc: "Unlocked after logging 50 film reviews!", icon: "🎬", status: "Unlocked", bg: "bg-rose-500/10 border-rose-500/40 text-rose-600" },
                  { title: "Weekend Double Feature", desc: "Watched 2 films in one single Saturday!", icon: "🍿", status: "Unlocked", bg: "bg-amber-500/10 border-amber-500/40 text-amber-600" },
                  { title: "Ghibli Explorer", desc: "Logged 3+ anime masterpieces with matcha.", icon: "🍃", status: "Unlocked", bg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-600" },
                  { title: "Cannes Auteur", desc: "Review 10 Palme d'Or official winners.", icon: "🏆", status: "In Progress (7/10)", bg: "bg-slate-500/10 border-[var(--border-color)] text-[var(--text-muted)]" },
                ].map((badge, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-xs ${badge.bg}`}>
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-black text-xs text-[var(--text-primary)] truncate">{badge.title}</h5>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/80 dark:bg-black/80">{badge.status}</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 mt-0.5 truncate">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );

  return (
    <>
      <DualPaneNotebook leftPage={leftPageContent} rightPage={rightPageContent} />

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl p-6 w-full max-w-lg shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-[var(--border-color)]/70 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent-honey)] text-[var(--accent-honey-text)] flex items-center justify-center shrink-0 shadow-md">
                  <Edit3 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-wide font-serif">
                    Edit Auteur Profile
                  </h3>
                  <p className="text-[11px] font-extrabold text-[var(--text-muted)]">
                    Customize your name, cover photo, avatar, & cinema philosophy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-bold text-[var(--text-primary)]">
              
              {/* Cover Photo Banner URL & Live Preview */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  Cover Photo Banner (URL or simple path)
                </label>
                <div className="h-24 w-full rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-950 relative shadow-inner">
                  <img
                    src={editForm.bannerUrl || "/images/posters/past_lives.jpg"}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/posters/past_lives.jpg"; }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-extrabold uppercase backdrop-blur-xs">
                      Live Cover Preview
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  value={editForm.bannerUrl}
                  onChange={(e) => setEditForm({ ...editForm, bannerUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] font-mono text-xs"
                  placeholder="e.g. /images/posters/past_lives.jpg or https://..."
                />
              </div>

              {/* Display Name & Username Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)]"
                    placeholder="Fourth & Sheena's Cinema"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                    Username (@handle)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-[var(--text-muted)] font-mono">@</span>
                    <input
                      type="text"
                      required
                      value={editForm.handle}
                      onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)]"
                      placeholder="fourth_and_sheena"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Avatar URL & Miniature Preview */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  Profile Photo Avatar (URL or image path)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--border-color)] bg-[var(--surface-subtle)] shrink-0 shadow-md">
                    <img
                      src={editForm.avatar || "/images/avatars/default.png"}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"; }}
                    />
                  </div>
                  <input
                    type="text"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] font-mono text-xs"
                    placeholder="https://... or /images/avatars/..."
                  />
                </div>
              </div>

              {/* Auteur Quote / Bio */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  Auteur Bio / Cinema Quote
                </label>
                <textarea
                  rows={2}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] font-serif italic focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] resize-none"
                  placeholder="Tell us about your cinematic style..."
                />
              </div>

              {/* Favorite Movie Quote Section */}
              <div className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-subtle)]/50 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--accent-honey-text)] dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Favorite Movie Quote</span>
                </span>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                    The Quote
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.favoriteQuote}
                    onChange={(e) => setEditForm({ ...editForm, favoriteQuote: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-serif italic focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] resize-none text-xs"
                    placeholder="In another life, I would have really liked..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                      Character Name
                    </label>
                    <input
                      type="text"
                      value={editForm.favoriteQuoteCharacter}
                      onChange={(e) => setEditForm({ ...editForm, favoriteQuoteCharacter: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] text-xs"
                      placeholder="e.g. Waymond Wang"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                      Movie Title (& Year)
                    </label>
                    <input
                      type="text"
                      value={editForm.favoriteQuoteMovie}
                      onChange={(e) => setEditForm({ ...editForm, favoriteQuoteMovie: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] text-xs"
                      placeholder="e.g. Everything Everywhere All at Once"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[var(--border-color)]/70">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-md hover:scale-105 transition-all border border-[var(--border-color)] cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Save Profile</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};
