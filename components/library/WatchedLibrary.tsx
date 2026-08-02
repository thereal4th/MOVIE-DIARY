/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useMemo, useState } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { MovieCard } from './MovieCard';
import { SortOption, ViewMode, Movie } from '../../types/diary';
import { StarRating } from '../rating/StarRating';
import { DualPaneNotebook } from '../layout/DualPaneNotebook';
import { Search, Scroll, Film, Calendar as CalendarIcon, RotateCcw, MapPin, CalendarDays, Plus, X, Sparkles, Heart, Users } from 'lucide-react';

export const WatchedLibrary: React.FC = () => {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    setEditingMovie,
    setIsLogModalOpen,
    setSelectedFriend,
    getTaggedFriends,
    setPrefillMovie,
    updateRating,
    userProfile
  } = useMovieDiary();

  const genres = ['All', 'Animation', 'Romance', 'Drama', 'Sci-Fi', 'Fantasy', 'Indie', 'Family', 'Period'];

  // Right page view switcher state (Chronological Feed vs Dense Poster Wall)
  const [rightPageMode, setRightPageMode] = useState<'timeline' | 'grid'>('timeline');

  // Calendar State: Default to August 2026
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 7, 1));
  const [selectedDayMovies, setSelectedDayMovies] = useState<{ date: string; list: Movie[] } | null>(null);

  // Filter movies reactively
  const filteredAndSortedMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.reviewNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.moodTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (movie.hashtags && movie.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (movie.venue && movie.venue.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);

      return matchesSearch && matchesGenre;
    });
  }, [movies, searchQuery, selectedGenre]);

  // Group Chronological Feed by Month and Year directly for smooth inner micro-scrolling
  const groupedByMonthYear = useMemo(() => {
    const groups: { [key: string]: Movie[] } = {};
    filteredAndSortedMovies.forEach((m) => {
      const parts = m.dateWatched.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const dateObj = new Date(parseInt(year), monthIndex, 1);
        const label = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!groups[label]) groups[label] = [];
        groups[label].push(m);
      } else {
        const label = 'Earlier Archives';
        if (!groups[label]) groups[label] = [];
        groups[label].push(m);
      }
    });
    return groups;
  }, [filteredAndSortedMovies]);

  // Calendar Helper Math
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthLabel = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

  // Map movies to dates in current calendar month
  const moviesByDate = useMemo(() => {
    const map: { [key: string]: Movie[] } = {};
    filteredAndSortedMovies.forEach((m) => {
      if (m.dateWatched) {
        if (!map[m.dateWatched]) map[m.dateWatched] = [];
        map[m.dateWatched].push(m);
      }
    });
    return map;
  }, [filteredAndSortedMovies]);

  const handleEdit = (movie: any) => {
    setEditingMovie(movie);
    setIsLogModalOpen(true);
  };

  const handleLogForDate = (dateStr: string) => {
    setPrefillMovie({ dateWatched: dateStr });
    setIsLogModalOpen(true);
  };

  /* ========================================================================= */
  /* 📖 LEFT PAGE CONTENT: Interactive Monthly Poster Calendar                   */
  /* ========================================================================= */
  const leftPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-hidden">
      
      {/* Locked Calendar Header & Profile Identity Strip */}
      <div className="shrink-0 flex items-center justify-between gap-3 pb-3 border-b-2 border-[var(--border-color)]/70">
        <div className="flex items-center gap-3">
          <img
            src={userProfile ? userProfile.avatar : '/images/avatars/maya.jpg'}
            alt="Profile Avatar"
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md shrink-0"
          />
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 stroke-[2.5] text-pink-500" />
              <span>{monthLabel}</span>
            </h3>
            <p className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wide">
              {Object.keys(moviesByDate).filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).reduce((total, date) => total + moviesByDate[date].length, 0)} films in month • Click date to inspect or log
            </p>
          </div>
        </div>

        {/* Month Navigation Control Switchers */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={prevMonth}
            className="px-3 py-1.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] font-black text-xs border border-[var(--border-color)] shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Previous Month"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => setCalendarDate(new Date(2026, 7, 1))}
            className="px-3 py-1.5 rounded-xl bg-linear-to-r from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-[10px] uppercase tracking-wider border border-[var(--border-color)] shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Jump to August 2026"
          >
            Aug 2026
          </button>
          <button
            onClick={nextMonth}
            className="px-3 py-1.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] font-black text-xs border border-[var(--border-color)] shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Next Month"
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* 7-Column Calendar Day Names Header */}
      <div className="shrink-0 grid grid-cols-7 gap-1.5 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
          <div key={dayName} className={`text-[11px] font-black uppercase tracking-wider py-1.5 rounded-lg border border-[var(--border-color)]/60 bg-[var(--surface-subtle)] ${index === 0 || index === 6 ? 'text-rose-500' : 'text-[var(--text-secondary)]'}`}>
            {dayName}
          </div>
        ))}
      </div>

      {/* Fixed-Height 7-Column Monthly Calendar Grid (No Scrolling Needed!) */}
      <div className="flex-1 min-h-0 w-full overflow-hidden pt-0.5 pb-1">
        <div 
          className="grid grid-cols-7 gap-1.5 h-full w-full min-h-0" 
          style={{ gridTemplateRows: `repeat(${Math.ceil((firstDayOfWeek + daysInMonth) / 7)}, minmax(0, 1fr))` }}
        >
          {/* Preceding blank padding cells for first week */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-full min-h-0 w-full rounded-xl bg-[var(--surface-subtle)]/20 border border-dashed border-[var(--border-color)]/30 pointer-events-none opacity-40"></div>
          ))}

          {/* Date Cells */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const filmsOnDate = moviesByDate[dateStr] || [];
            const hasFilms = filmsOnDate.length > 0;
            const mainFilm = filmsOnDate[0];
            const isMultiLog = filmsOnDate.length > 1;

            return (
              <div
                key={dateStr}
                className={`group relative h-full min-h-0 w-full rounded-xl border-2 transition-all duration-200 overflow-hidden flex flex-col justify-between p-1 select-none ${
                  hasFilms
                    ? 'border-pink-500/70 shadow-sm hover:shadow-lg hover:scale-102 cursor-pointer z-10 hover:z-30 bg-[var(--surface-card)]'
                    : 'border-[var(--border-color)]/70 bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] cursor-pointer'
                }`}
                onClick={() => {
                  if (isMultiLog) {
                    setSelectedDayMovies({ date: dateStr, list: filmsOnDate });
                  } else if (hasFilms && mainFilm) {
                    handleEdit(mainFilm);
                  } else {
                    handleLogForDate(dateStr);
                  }
                }}
              >
                {/* Top Day Number Label & Multi-log badge */}
                <div className="flex items-center justify-between z-20 w-full">
                  <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md border shadow-2xs ${
                    hasFilms ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-white/20' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-[var(--border-color)]'
                  }`}>
                    {dayNum}
                  </span>

                  {isMultiLog && (
                    <span className="text-[8px] font-black px-1 py-0.5 rounded-full bg-linear-to-r from-rose-500 to-amber-500 text-white shadow-xs animate-pulse truncate max-w-[60px]">
                      +{filmsOnDate.length}
                    </span>
                  )}
                </div>

                {/* CONTENT: Blank Date vs Film Poster */}
                {!hasFilms ? (
                  <div className="m-auto flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-linear-to-tr from-[var(--accent-sakura)] to-[var(--accent-matcha)] text-[var(--text-primary)] flex items-center justify-center shadow-xs mb-0.5 border border-white/60">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-[var(--text-primary)] bg-white/90 dark:bg-black/80 px-1 py-0.5 rounded-xs">
                      + Log
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
                    <img src={mainFilm.posterPath} alt={mainFilm.title} className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Hover Metadata Overlay: Star rating, rewatch badge, venue tag, review snippet */}
                    <div className="absolute inset-0 bg-slate-950/95 p-1.5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 text-white text-[9px] overflow-hidden">
                      <div>
                        <p className="font-black text-amber-400 truncate text-[10px]">{mainFilm.title}</p>
                        <p className="font-bold text-pink-300 mb-0.5">{mainFilm.userRating.toFixed(1)} ★ {mainFilm.isRewatch && "• 🔄"}</p>
                        <p className="italic font-serif line-clamp-2 sm:line-clamp-3 text-slate-200 text-[8px] leading-tight">
                          "{mainFilm.reviewNotes || "An unforgettable screening."}"
                        </p>
                      </div>
                      <div className="mt-0.5 pt-0.5 border-t border-white/20 flex items-center justify-between">
                        <span className="bg-emerald-600/80 px-1 py-0.5 rounded-xs font-black uppercase text-[7px] truncate">
                          {mainFilm.venue || "Home"}
                        </span>
                        <span className="text-[7px] text-amber-300 font-bold">Edit ➔</span>
                      </div>
                    </div>

                    {/* Default bottom title banner */}
                    <div className="absolute bottom-1 left-1 right-1 z-10 text-center">
                      <p className="text-[8px] sm:text-[9px] font-black text-white truncate drop-shadow-md bg-black/70 px-1 py-0.5 rounded-md backdrop-blur-xs">
                        {mainFilm.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Multi-Log Popup */}
      {selectedDayMovies && (
        <div className="shrink-0 p-4 bg-slate-900 text-white rounded-2xl border-2 border-amber-500 shadow-2xl animate-fadeIn flex flex-col space-y-3 relative z-30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Double Feature Day ({selectedDayMovies.date})</span>
            </span>
            <button onClick={() => setSelectedDayMovies(null)} className="text-slate-400 hover:text-white font-black text-sm cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-40 overflow-y-auto pr-1">
            {selectedDayMovies.list.map((m) => (
              <div key={m.id} onClick={() => handleEdit(m)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-2 cursor-pointer">
                <img src={m.posterPath} alt={m.title} className="w-10 h-14 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-white truncate">{m.title}</p>
                  <p className="text-[10px] text-amber-400 font-extrabold">{m.userRating.toFixed(1)} ★</p>
                  <span className="text-[9px] text-slate-300 block truncate">{m.venue || 'Home Screening'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* ========================================================================= */
  /* 📖 RIGHT PAGE CONTENT: View Switcher & Entry Context                      */
  /* ========================================================================= */
  const rightPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-hidden">
      
      {/* 🔒 FIXED TOP TOOLBAR & ACTION BAR */}
      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b-2 border-[var(--border-color)]/70">
        
        {/* View Switcher Controls */}
        <div className="flex items-center p-1 bg-[var(--surface-subtle)] rounded-xl border border-[var(--border-color)] shadow-inner">
          <button
            onClick={() => setRightPageMode('timeline')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              rightPageMode === 'timeline' ? 'bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] shadow-sm scale-102 ring-1 ring-white/50' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Scroll className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Films</span>
          </button>
          <button
            onClick={() => setRightPageMode('grid')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              rightPageMode === 'grid' ? 'bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-sm scale-102 ring-1 ring-white/50' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Film className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Poster Wall</span>
          </button>
        </div>
      </div>

      {/* Search & Genre Pill Strip */}
      <div className="shrink-0 flex flex-col gap-2.5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search archive by title, venue, @friend, hashtag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] focus:bg-[var(--surface-card)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] outline-hidden transition-all shadow-inner"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
              Clear
            </button>
          )}
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] border-2 border-[var(--accent-sakura-text)] shadow-xs scale-105'
                  : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* 📜 INTERNAL MICRO-SCROLLING REGION FOR FEED OR WALL */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pt-1 pb-6">
        
        {/* VIEW A: CHRONOLOGICAL LIST FEED (compact grouped list with review snippets) */}
        {rightPageMode === 'timeline' && (
          <div className="space-y-8">
            {Object.keys(groupedByMonthYear).map((monthYearGroup) => (
              <div key={monthYearGroup} className="space-y-4">
                
                {/* Month/Year Group Banner */}
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-[var(--accent-sakura)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-xs uppercase tracking-widest shadow-xs border border-white/60 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 stroke-[2.5]" />
                    <span>{monthYearGroup}</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-dashed bg-[var(--border-color)]/70"></div>
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase">
                    {groupedByMonthYear[monthYearGroup].length} logged
                  </span>
                </div>

                {/* Compact List Feed items under this month */}
                <div className="relative border-l-2 border-[var(--border-color)] ml-3.5 pl-5 space-y-4">
                  {groupedByMonthYear[monthYearGroup].map((movie) => {
                    const taggedFriends = getTaggedFriends(movie.taggedFriendIds);
                    return (
                      <div key={movie.id} className="relative group">
                        <span className="absolute -left-[27px] top-4 w-5 h-5 rounded-full bg-[var(--accent-honey)] text-[var(--accent-honey-text)] font-black border-2 border-[var(--diary-paper)] shadow-sm flex items-center justify-center text-[10px]">
                          <Sparkles className="w-2.5 h-2.5 stroke-[2.5]" />
                        </span>

                        <div className="p-4 rounded-2xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border-2 border-[var(--border-color)] shadow-sm flex items-start gap-4 transition-all">
                          <img src={movie.posterPath} alt={movie.title} onClick={() => handleEdit(movie)} className="w-16 sm:w-20 aspect-[2/3] rounded-xl object-cover border border-[var(--border-color)] shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform" />
                          
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 onClick={() => handleEdit(movie)} className="font-black text-sm sm:text-base text-[var(--text-primary)] hover:text-pink-500 cursor-pointer truncate">
                                  {movie.title}
                                </h4>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                                  {movie.releaseYear}
                                </span>
                                {movie.isRewatch && (
                                  <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <RotateCcw className="w-2.5 h-2.5 stroke-[2.5]" />
                                    <span>Rewatch</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-black text-amber-500 whitespace-nowrap">{movie.userRating.toFixed(1)} ★</span>
                            </div>

                            <p className="text-[11px] text-[var(--text-muted)] font-extrabold flex items-center gap-2">
                              <span>Dir. {movie.director}</span>
                              <span>•</span>
                              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                {movie.venue || 'In Theaters / Home'}
                              </span>
                            </p>

                            <p className="text-xs text-[var(--text-secondary)] italic font-serif leading-relaxed line-clamp-2 bg-[var(--surface-subtle)] p-2 rounded-xl border border-[var(--border-color)]/50">
                              "{movie.reviewNotes || "An extraordinary screening written down in the physical film notebook."}"
                            </p>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <span className="text-[10px] text-[var(--text-muted)] font-extrabold flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3 stroke-[2.5]" />
                                <span>{movie.dateWatched}</span>
                              </span>
                              <button onClick={() => handleEdit(movie)} className="text-[11px] font-black text-[var(--accent-sakura-text)] hover:underline cursor-pointer">
                                Edit Notes ➔
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW B: DENSE POSTER WALL GRID */}
        {rightPageMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 pt-1">
            {filteredAndSortedMovies.map((movie, idx) => (
              <div
                key={movie.id}
                onClick={() => handleEdit(movie)}
                className="group relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer bg-[var(--surface-card)]"
              >
                <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                
                {movie.isRewatch && (
                  <span className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase shadow-md flex items-center gap-0.5">
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>RW</span>
                  </span>
                )}

                <div className="absolute bottom-2 left-2 right-2 text-white space-y-0.5 text-center">
                  <p className="font-black text-xs truncate text-amber-300">{movie.title}</p>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold">
                    <span className="text-amber-400">{movie.userRating.toFixed(1)} ★</span>
                    <span>•</span>
                    <span className="text-slate-300">{movie.releaseYear}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return <DualPaneNotebook leftPage={leftPageContent} rightPage={rightPageContent} />;
};
