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
import { Search, Scroll, Film, Calendar as CalendarIcon, RotateCcw, MapPin, CalendarDays, Plus, X, Sparkles, Clapperboard, Heart, Users } from 'lucide-react';

export const WatchedLibrary: React.FC = () => {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    setEditingMovie,
    setIsLogModalOpen,
    setSelectedFriend,
    getTaggedFriends,
    setPrefillMovie,
    updateRating,
    userProfile
  } = useMovieDiary();

  const genres = ['All', 'Animation', 'Romance', 'Drama', 'Sci-Fi', 'Fantasy', 'Indie', 'Family', 'Period'];

  // Calendar State: Default to August 2026
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 7, 1));
  const [selectedDayMovies, setSelectedDayMovies] = useState<{ date: string; list: Movie[] } | null>(null);

  // Filter and sort movies reactively
  const filteredAndSortedMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        const matchesSearch =
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.reviewNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.moodTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (movie.hashtags && movie.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
          (movie.venue && movie.venue.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);

        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortOption === 'date_desc') return b.dateWatched.localeCompare(a.dateWatched);
        if (sortOption === 'date_asc') return a.dateWatched.localeCompare(b.dateWatched);
        if (sortOption === 'rating_desc') return b.userRating - a.userRating;
        if (sortOption === 'rating_asc') return a.userRating - b.userRating;
        if (sortOption === 'title_asc') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [movies, searchQuery, selectedGenre, sortOption]);

  // Group Chronological Feed by Month and Year directly for smooth inner scrolling
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

  return (
    <div className="flex flex-col h-full min-h-0 space-y-5 sm:space-y-6 overflow-hidden">
      
      {/* 🔒 FIXED SECTION 1: Personalized Header Greeting (Never scrolls!) */}
      <section className="shrink-0 bg-linear-to-r from-[var(--surface-card)] via-[var(--accent-lavender)]/40 to-[var(--surface-card)] rounded-3xl p-5 sm:p-7 border-2 border-[var(--border-color)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="washi-strip washi-lilac right-12 left-auto"></div>
        
        <div className="flex items-center gap-4 sm:gap-5">
          <img
            src={userProfile ? userProfile.avatar : '/images/avatars/maya.jpg'}
            alt="Profile Avatar"
            className="w-14 sm:w-16 h-14 sm:h-16 rounded-full object-cover border-3 border-white shadow-md shrink-0"
          />
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
              <span>Hi,</span>
              <span className="text-[var(--accent-sakura-text)] font-mono">{userProfile ? userProfile.handle : '@filmory_user'}</span>
              <span>👋</span>
            </h2>
            <p className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider mt-1">
              Your Personal Film Archive • {movies.length} films logged
            </p>
          </div>
        </div>

        {/* Quick Summary stats pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-4 py-2 rounded-2xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-2xs text-center min-w-28">
            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider">Avg Score</p>
            <p className="text-xl font-black text-[var(--accent-star)]">
              {(movies.reduce((acc, m) => acc + m.userRating, 0) / (movies.length || 1)).toFixed(1)} ★
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-2xs text-center min-w-28">
            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider">Rewatches</p>
            <p className="text-xl font-black text-[var(--accent-sakura-text)] flex items-center justify-center gap-1">
              <span>{movies.filter((m) => m.isRewatch).length}</span>
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            </p>
          </div>
        </div>
      </section>

      {/* 🔒 FIXED SECTION 2: View Switcher Toolbar & Filter Controls (Never scrolls!) */}
      <section className="shrink-0 flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-[var(--surface-card)] p-4 rounded-2xl border-2 border-[var(--border-color)] shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-[var(--text-muted)] stroke-[2.5]" />
          </span>
          <input
            type="text"
            placeholder="Search by title, venue, @friend, hashtag, or mood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] focus:bg-[var(--surface-card)] border-2 border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] outline-hidden transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right controls: View Mode Toggle & Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          
          {/* 🌟 Primary View Switcher ordered strictly: Feed > Films > Calendar! */}
          <div className="flex items-center p-1.5 bg-[var(--surface-subtle)] rounded-2xl border-2 border-[var(--border-color)] shadow-inner flex-wrap gap-1">
            
            {/* 1. Feed */}
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'timeline' ? 'bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] shadow-md scale-102 ring-2 ring-white/60' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
              title="Chronological Feed (Grouped by Month & Year)"
            >
              <Scroll className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Feed</span>
            </button>

            {/* 2. Films */}
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid' ? 'bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-md scale-102 ring-2 ring-white/60' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
              title="Films View"
            >
              <Film className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Films</span>
            </button>

            {/* 3. Calendar */}
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar' ? 'bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] shadow-md scale-102 ring-2 ring-white/60' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
              title="Poster Calendar View"
            >
              <CalendarIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Calendar</span>
            </button>
          </div>

          {/* Sorting Selector */}
          <div className="flex items-center gap-1.5">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border-2 border-[var(--border-color)] text-xs font-extrabold text-[var(--text-primary)] focus:outline-hidden hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              <option value="date_desc">Date (Newest)</option>
              <option value="date_asc">Date (Oldest)</option>
              <option value="rating_desc">Rating (Highest)</option>
              <option value="rating_asc">Rating (Lowest)</option>
              <option value="title_asc">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 🔒 FIXED SECTION 3: Genre Filter Pills Bar (Never scrolls!) */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-black text-[var(--text-muted)] mr-1.5 shrink-0 uppercase tracking-wider">Genres:</span>
        {genres.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`journal-pill px-4 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] border-2 border-[var(--accent-sakura-text)] shadow-sm scale-105'
                  : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)]'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* 📜 SCROLLABLE OVERFLOW AREA: Only this container scrolls when content exceeds notebook height! */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-8">
        
        {/* 🌟 VIEW 1: CHRONOLOGICAL FEED VIEW */}
        {viewMode === 'timeline' && (
          <div className="space-y-12 pt-2">
            {Object.keys(groupedByMonthYear).map((monthYearGroup) => (
              <div key={monthYearGroup} className="space-y-6">
                
                {/* Group Month & Year Banner */}
                <div className="flex items-center gap-4">
                  <div className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-[var(--accent-sakura)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-base uppercase tracking-widest shadow-md border-2 border-white/60 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 stroke-[2.5] text-[var(--text-primary)]" />
                    <span>{monthYearGroup}</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-dashed bg-[var(--border-color)]"></div>
                  <span className="text-xs font-black text-[var(--text-muted)] uppercase">
                    {groupedByMonthYear[monthYearGroup].length} films archived
                  </span>
                </div>

                {/* Feed Items under this month */}
                <div className="relative border-l-3 border-[var(--border-color)] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
                  {groupedByMonthYear[monthYearGroup].map((movie, idx) => {
                    const taggedFriends = getTaggedFriends(movie.taggedFriendIds);
                    const tintClasses = ['card-tint-pink', 'card-tint-mint', 'card-tint-lilac', 'card-tint-gold'];
                    const washiClasses = ['washi-pink', 'washi-mint', 'washi-lilac', 'washi-gold'];
                    
                    return (
                      <div key={movie.id} className="relative group">
                        {/* Timeline Node Icon */}
                        <span className="absolute -left-[39px] sm:-left-[55px] top-6 w-8 h-8 rounded-full bg-[var(--accent-honey)] text-[var(--accent-honey-text)] font-black border-4 border-[var(--diary-paper)] shadow-md flex items-center justify-center text-xs">
                          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>

                        <div className={`polaroid-card ${tintClasses[idx % tintClasses.length]} rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-start relative`}>
                          <div className={`washi-strip ${washiClasses[idx % washiClasses.length]}`}></div>

                          <div className="relative shrink-0 w-32 sm:w-40 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-lg mt-2">
                            <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
                            {movie.isRewatch && (
                              <span className="absolute top-2 left-2 bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-md uppercase flex items-center gap-1">
                                <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                                <span>Rewatch</span>
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-3 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)]/70 pb-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-2xl font-black text-[var(--text-primary)] hover:text-[var(--accent-sakura-text)] transition-colors cursor-pointer" onClick={() => handleEdit(movie)}>
                                    {movie.title}
                                  </h3>
                                  <span className="date-stamp text-xs font-bold text-[var(--text-secondary)] bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded-md">
                                    {movie.releaseYear}
                                  </span>
                                  {movie.favorite && <span title="Favorite"><Heart className="w-5 h-5 text-pink-500 fill-pink-500 inline" /></span>}
                                </div>
                                <p className="text-xs text-[var(--text-muted)] font-bold mt-1">
                                  Dir. <span className="text-[var(--text-secondary)]">{movie.director}</span> • {movie.runtimeMinutes} mins • {movie.genres.join(', ')}
                                </p>
                              </div>

                              {/* Date & Venue Stamp */}
                              <div className="flex flex-col items-start sm:items-end gap-1.5">
                                <span className="date-stamp text-xs font-extrabold px-3 py-1 bg-[var(--surface-card)] text-[var(--text-secondary)] flex items-center gap-1.5">
                                  <CalendarIcon className="w-3.5 h-3.5 stroke-[2.5] text-[var(--text-muted)]" />
                                  <span>{movie.dateWatched}</span>
                                </span>
                                {(movie.venue || movie.watchFormat) && (
                                  <span className="text-xs font-black text-white bg-slate-900 dark:bg-[#1A181C] dark:text-[#F7ECD9] dark:border dark:border-[#D1BEA5] px-3 py-1 rounded-lg shadow-2xs uppercase tracking-wider flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                                    <span>{movie.venue || movie.watchFormat}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <StarRating rating={movie.userRating} interactive={true} size="md" showTooltip={false} onRatingChange={(v) => updateRating(movie.id, v)} />
                              <span className="text-sm font-black text-[var(--accent-star)]">{movie.userRating.toFixed(1)} ★</span>
                            </div>

                            {/* Contextual Badges Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[var(--border-color)]/50">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {movie.hashtags && movie.hashtags.map((tag) => (
                                  <span key={tag} className="text-xs font-black px-3 py-1 rounded-lg bg-[var(--accent-honey)] text-[var(--accent-honey-text)] border border-black/10 shadow-2xs uppercase tracking-wide">
                                    {tag}
                                  </span>
                                ))}
                                {movie.moodTags && movie.moodTags.map((tag) => (
                                  <span key={tag} className="text-xs font-extrabold px-3 py-1 rounded-full bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-color)] shadow-2xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Tagged Friends with explicit @user handle! */}
                              {taggedFriends.length > 0 && (
                                <div className="flex items-center flex-wrap gap-1.5">
                                  <span className="text-xs text-[var(--text-muted)] font-black uppercase flex items-center gap-1">
                                    <Users className="w-3 h-3 stroke-[2.5]" />
                                    <span>Watched with:</span>
                                  </span>
                                  {taggedFriends.map((f) => (
                                    <button
                                      key={f.id}
                                      onClick={() => setSelectedFriend(f)}
                                      className="journal-pill flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] text-xs font-black text-[var(--text-primary)] shadow-2xs cursor-pointer"
                                    >
                                      <img src={f.avatar} alt={f.name} className="w-5 h-5 rounded-full object-cover border border-white" />
                                      <span className="text-[var(--accent-sakura-text)] font-mono">{f.handle}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
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

        {/* 🌟 VIEW 2: FILMS VIEW (Compact Polaroid Snapshots) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {filteredAndSortedMovies.map((movie, idx) => (
              <MovieCard key={movie.id} movie={movie} onEdit={handleEdit} index={idx} />
            ))}
          </div>
        )}

        {/* 🌟 VIEW 3: POSTER CALENDAR VIEW */}
        {viewMode === 'calendar' && (
          <div className="bg-[var(--surface-card)] border-3 border-[var(--border-color)] rounded-3xl p-4 sm:p-8 shadow-xl relative overflow-visible mt-1">
            
            {/* Calendar Month Navigation Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-[var(--border-color)]/70 mb-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                  <CalendarDays className="w-7 h-7 stroke-[2.5] text-[var(--accent-sakura-text)]" />
                  <span>{monthLabel}</span>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[var(--accent-honey)] text-[var(--accent-honey-text)] uppercase tracking-wide">
                    {Object.keys(moviesByDate).filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).reduce((total, date) => total + moviesByDate[date].length, 0)} films watched
                  </span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-wider mt-1">
                  Hover over date tiles to preview metadata tags. Double features stack with a +N badge!
                </p>
              </div>

              {/* Month Control Switchers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] font-black text-sm border-2 border-[var(--border-color)] shadow-xs transition-transform active:scale-95 cursor-pointer"
                  title="Previous Month"
                >
                  ◀ Prev
                </button>
                <button
                  onClick={() => setCalendarDate(new Date(2026, 7, 1))}
                  className="px-4 py-2 rounded-xl bg-linear-to-r from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-xs uppercase tracking-wider border-2 border-[var(--border-color)] shadow-xs transition-transform active:scale-95 cursor-pointer"
                  title="Jump to August 2026"
                >
                  Aug 2026
                </button>
                <button
                  onClick={nextMonth}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] font-black text-sm border-2 border-[var(--border-color)] shadow-xs transition-transform active:scale-95 cursor-pointer"
                  title="Next Month"
                >
                  Next ▶
                </button>
              </div>
            </div>

            {/* 7-Column Calendar Day Names Header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
                <div key={dayName} className={`text-xs font-black uppercase tracking-wider py-2 rounded-xl border border-[var(--border-color)]/60 bg-[var(--surface-subtle)] ${index === 0 || index === 6 ? 'text-rose-500' : 'text-[var(--text-secondary)]'}`}>
                  {dayName}
                </div>
              ))}
            </div>

            {/* 7-Column Interactive Monthly Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3.5">
              {/* Preceding blank padded cells for first week */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-28 sm:h-40 md:h-48 rounded-2xl bg-[var(--surface-subtle)]/40 border border-dashed border-[var(--border-color)]/40 pointer-events-none opacity-50"></div>
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
                    className={`group relative h-28 sm:h-40 md:h-48 rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col justify-between p-2 select-none ${
                      hasFilms
                        ? 'border-[var(--accent-sakura-text)]/70 shadow-lg hover:shadow-2xl hover:scale-102 cursor-pointer z-10 hover:z-30 bg-[var(--surface-card)]'
                        : 'border-[var(--border-color)]/80 bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] cursor-pointer'
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
                    {/* Top Day Number Label */}
                    <div className="flex items-center justify-between z-20 w-full">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg border shadow-xs ${
                        hasFilms ? 'bg-slate-900 text-white dark:bg-[#1A181C] dark:text-[#F7ECD9] dark:border-[#D1BEA5] border-white/20' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-[var(--border-color)]'
                      }`}>
                        {dayNum}
                      </span>

                      {/* Multi-Log Stacked Badge! */}
                      {isMultiLog && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-linear-to-r from-rose-500 to-amber-500 text-white shadow-md animate-pulse">
                          +{filmsOnDate.length} watched
                        </span>
                      )}
                    </div>

                    {/* CONTENT: Blank Date vs Film Poster vs Multi-Log Stacked Posters */}
                    {!hasFilms ? (
                      <div className="m-auto flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[var(--accent-sakura)] to-[var(--accent-matcha)] text-[var(--text-primary)] flex items-center justify-center shadow-md mb-1 border border-white/60">
                          <Plus className="w-5 h-5 stroke-[3]" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-[var(--text-primary)] tracking-wider bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded-md">
                          Log Movie
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Stacked background image for multi-logs */}
                        {isMultiLog && filmsOnDate[1] && (
                          <img
                            src={filmsOnDate[1].posterPath}
                            alt="Background Stack"
                            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-xl filter brightness-75 transform rotate-6 translate-x-2 -translate-y-1 z-0 shadow-lg"
                          />
                        )}

                        {/* Foreground Thumbnail Poster */}
                        <img
                          src={mainFilm.posterPath}
                          alt={mainFilm.title}
                          className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105 z-10 ${
                            isMultiLog ? 'transform -rotate-2 scale-95 shadow-xl border border-white/40' : ''
                          }`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/posters/totoro.jpg';
                          }}
                        />

                        {/* Dark Gradient Overlay for readability */}
                        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-linear-to-t from-black via-black/60 to-transparent z-10 pointer-events-none rounded-b-xl opacity-90"></div>

                        {/* Bottom Quick Title & Stars */}
                        <div className="z-20 text-left relative mt-auto w-full pt-1">
                          <p className="text-white font-extrabold text-[11px] sm:text-xs leading-tight line-clamp-1 drop-shadow-md">
                            {mainFilm.title}
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-amber-300 font-black text-[11px] drop-shadow-sm">
                              {mainFilm.userRating.toFixed(1)} ★
                            </span>
                            {mainFilm.isRewatch && <span title="Rewatch"><RotateCcw className="w-3 h-3 text-pink-300 stroke-[2.5]" /></span>}
                          </div>
                        </div>

                        {/* ✨ HOVER METADATA POPUP OVERLAY */}
                        <div className="absolute inset-0 bg-slate-900 text-white dark:bg-[#1A181C] dark:text-[#F7ECD9] p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 flex flex-col justify-between text-xs overflow-y-auto pointer-events-none border-2 border-white/30 dark:border-[#D1BEA5] shadow-2xl">
                          <div>
                            <div className="flex items-start justify-between gap-1 border-b border-white/20 pb-1.5 mb-2">
                              <p className="font-black text-xs uppercase tracking-tight text-[var(--accent-honey)] dark:text-[#FCECCD] leading-tight">
                                {mainFilm.title} ({mainFilm.releaseYear})
                              </p>
                              <span className="font-black text-amber-300 shrink-0 text-xs">{mainFilm.userRating}★</span>
                            </div>

                            {/* Venue & Rewatch badges */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {mainFilm.isRewatch && (
                                <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white font-black text-[9px] uppercase flex items-center gap-1">
                                  <RotateCcw className="w-2.5 h-2.5 stroke-[2.5]" />
                                  <span>Rewatch</span>
                                </span>
                              )}
                              {(mainFilm.venue || mainFilm.watchFormat) && (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[9px] uppercase flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5 stroke-[2.5]" />
                                  <span>{mainFilm.venue || mainFilm.watchFormat}</span>
                                </span>
                              )}
                            </div>

                            {/* Tagged Friends (@handle format) */}
                            {mainFilm.taggedFriendIds && mainFilm.taggedFriendIds.length > 0 && (
                              <div className="text-[10px] font-extrabold text-amber-200 mb-2">
                                👥 With: {getTaggedFriends(mainFilm.taggedFriendIds).map(f => f.handle).join(', ')}
                              </div>
                            )}

                            {/* Custom Hashtags */}
                            {mainFilm.hashtags && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {mainFilm.hashtags.map(t => (
                                  <span key={t} className="text-[9px] text-cyan-200 font-mono font-bold bg-white/10 px-1 rounded-xs">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <span className="text-[9px] font-black uppercase text-center mt-2 pt-1 border-t border-white/20 text-[var(--accent-sakura)] dark:text-amber-200">
                            {isMultiLog ? `Click to view all ${filmsOnDate.length} entries` : 'Click to edit journal entry'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 🌟 MULTI-LOG DAY DRAWER MODAL */}
      {selectedDayMovies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
          <div className="bg-[var(--surface-card)] border-4 border-[var(--border-color)] rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedDayMovies(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-center font-black text-lg transition-transform active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3.5 pb-4 border-b border-[var(--border-color)] mb-6">
              <div className="p-3 rounded-2xl bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] shadow-md">
                <Clapperboard className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[var(--text-primary)]">
                  Double Feature Day: {selectedDayMovies.date}
                </h3>
                <span className="text-xs font-black uppercase text-[var(--accent-sakura-text)] bg-[var(--accent-sakura)] px-3 py-1 rounded-full">
                  +{selectedDayMovies.list.length} Films Recorded
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {selectedDayMovies.list.map((movie, index) => (
                <div key={movie.id} onClick={() => { setSelectedDayMovies(null); handleEdit(movie); }} className="cursor-pointer transition-transform hover:scale-102">
                  <MovieCard movie={movie} index={index} onEdit={(m) => { setSelectedDayMovies(null); handleEdit(m); }} />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center border-t border-[var(--border-color)]/70 pt-4">
              <button
                onClick={() => {
                  const d = selectedDayMovies.date;
                  setSelectedDayMovies(null);
                  handleLogForDate(d);
                }}
                className="px-6 py-3 rounded-2xl bg-linear-to-r from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-90 flex items-center justify-center gap-2 mx-auto cursor-pointer border border-white/60"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Log Another Film on {selectedDayMovies.date}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
