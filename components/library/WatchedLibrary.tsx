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
import { Search, Scroll, Film, Calendar as CalendarIcon, RotateCcw, MapPin, CalendarDays, Plus, X, Sparkles, Heart, Users, Pencil, Trash2, Bell } from 'lucide-react';

interface TagNotification {
  id: string;
  friendId: string;
  friendName: string;
  friendHandle: string;
  friendAvatar: string;
  movieTitle: string;
  posterPath: string;
  releaseYear: number;
  genres: string[];
  friendRating: number;
  friendComment: string;
  timeAgo: string;
  dateWatched: string;
  isRead: boolean;
}

export const WatchedLibrary: React.FC = () => {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    setEditingMovie,
    setIsLogModalOpen,
    setSelectedFriend,
    getTaggedFriends,
    setPrefillMovie,
    updateRating,
    userProfile,
    deleteMovie,
    addMovie
  } = useMovieDiary();

  // Friend Tag Notifications State
  const [tagNotifications, setTagNotifications] = useState<TagNotification[]>([
    {
      id: 'tag-1',
      friendId: 'friend-sarah',
      friendName: 'Sarah Jenkins',
      friendHandle: '@sarah_filmtea',
      friendAvatar: '/images/avatars/sarah.jpg',
      movieTitle: 'Past Lives',
      posterPath: '/images/posters/past_lives.jpg',
      releaseYear: 2023,
      genres: ['Romance', 'Drama'],
      friendRating: 5.0,
      friendComment: 'Sobbing through the final walk in New York! So glad we experienced this poignant masterpiece together. 🍵💛',
      timeAgo: '2 hours ago',
      dateWatched: '2026-08-08',
      isRead: false,
    },
    {
      id: 'tag-2',
      friendId: 'friend-alex',
      friendName: 'Alex Rivera',
      friendHandle: '@alex_films',
      friendAvatar: '/images/avatars/alex.jpg',
      movieTitle: 'Dune: Part Two',
      posterPath: '/images/posters/dune2.jpg',
      releaseYear: 2024,
      genres: ['Sci-Fi', 'Adventure'],
      friendRating: 4.5,
      friendComment: 'Incredible IMAX screening! The sound design and Arrakis cinematography blew us both away! 🏜️⚔️',
      timeAgo: 'Yesterday',
      dateWatched: '2026-08-05',
      isRead: false,
    },
    {
      id: 'tag-3',
      friendId: 'friend-maya',
      friendName: 'Maya Lin',
      friendHandle: '@cozy_cineast',
      friendAvatar: '/images/avatars/maya.jpg',
      movieTitle: 'My Neighbor Totoro',
      posterPath: '/images/posters/totoro.jpg',
      releaseYear: 1988,
      genres: ['Animation', 'Fantasy'],
      friendRating: 5.0,
      friendComment: 'Our rainy afternoon tea screening under cozy blankets! Absolute Ghibli comfort therapy! 🌧️🍃',
      timeAgo: '3 days ago',
      dateWatched: '2026-08-01',
      isRead: true,
    }
  ]);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedTagForReview, setSelectedTagForReview] = useState<TagNotification | null>(null);

  // State for the rate and comment modal (Popup 2)
  const [userTagRating, setUserTagRating] = useState<number>(4.5);
  const [userTagComment, setUserTagComment] = useState<string>('');
  const [userTagDate, setUserTagDate] = useState<string>('');

  const handleOpenTagReview = (notif: TagNotification) => {
    // Mark as read
    setTagNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationsOpen(false);
    setUserTagRating(notif.friendRating);
    setUserTagComment('');
    setUserTagDate(notif.dateWatched);
    setSelectedTagForReview(notif);
  };

  const handleSaveTagReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTagForReview) return;
    if (!userTagComment.trim()) {
      alert('Please write a quick comment for your diary log! ✿');
      return;
    }

    // Directly log to user's diary
    addMovie({
      title: selectedTagForReview.movieTitle,
      director: 'Curated Cinema',
      releaseYear: selectedTagForReview.releaseYear,
      runtimeMinutes: 115,
      genres: selectedTagForReview.genres,
      posterPath: selectedTagForReview.posterPath,
      userRating: userTagRating,
      reviewNotes: `${userTagComment.trim()} (Watched & Tagged with ${selectedTagForReview.friendHandle})`,
      dateWatched: userTagDate || new Date().toISOString().split('T')[0],
      watchFormat: 'With Friends 🍿',
      venue: 'Social Screening',
      moodTags: ['🌸 Feel-Good', '☁️ Comfort Watch'],
      taggedFriendIds: [selectedTagForReview.friendId],
      favorite: userTagRating >= 4.5
    });

    alert(`✨ Saved "${selectedTagForReview.movieTitle}" with your comments & rating to your diary!`);
    setSelectedTagForReview(null);
  };

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

      return matchesSearch;
    });
  }, [movies, searchQuery]);

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
                  if (hasFilms) {
                    setSelectedDayMovies({ date: dateStr, list: filmsOnDate });
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
        <div 
          className="shrink-0 p-4 rounded-2xl border-2 shadow-2xl animate-fadeIn flex flex-col space-y-3 relative z-30 transition-colors duration-300"
          style={{
            backgroundColor: 'var(--popup-bg)',
            borderColor: 'var(--popup-border)',
            boxShadow: 'var(--popup-shadow)',
            color: 'var(--popup-text)'
          }}
        >
          <div className="flex items-center justify-between">
            <span 
              className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 drop-shadow-xs"
              style={{ color: 'var(--popup-title)' }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{selectedDayMovies.list.length > 1 ? 'Double Feature Day' : 'Diary Log Day'} ({selectedDayMovies.date})</span>
            </span>
            <button 
              onClick={() => setSelectedDayMovies(null)} 
              className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm cursor-pointer transition-transform hover:scale-110 active:scale-95"
              style={{ color: 'var(--popup-title)' }}
              title="Close popup"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-44 overflow-y-auto pr-1">
            {selectedDayMovies.list.map((m) => (
              <div 
                key={m.id} 
                onClick={() => handleEdit(m)} 
                className="group relative p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02]"
                style={{
                  backgroundColor: 'var(--popup-card-bg)',
                  borderColor: 'var(--popup-card-border)'
                }}
                title="Click to edit entry"
              >
                <img src={m.posterPath} alt={m.title} className="w-11 h-16 rounded-lg object-cover shadow-md shrink-0" />
                <div className="min-w-0 flex-1 pr-6 py-0.5 flex flex-col justify-between h-16">
                  <div>
                    <p className="text-xs font-black truncate leading-snug" style={{ color: 'var(--popup-text)' }}>{m.title}</p>
                    <p className="text-[11px] font-extrabold tracking-wide mt-0.5" style={{ color: 'var(--popup-stars)' }}>{m.userRating.toFixed(1)} ★</p>
                  </div>
                  <span className="text-[9px] font-bold truncate tracking-tight" style={{ color: 'var(--popup-subtext)' }}>{m.venue || 'Home Screening'}</span>
                </div>

                {/* Hover action button group on top right */}
                <div 
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-1 rounded-lg border shadow-xl z-20 backdrop-blur-md"
                  style={{
                    backgroundColor: 'var(--popup-bg)',
                    borderColor: 'var(--popup-border)'
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(m);
                    }}
                    className="p-1 rounded-md hover:scale-115 transition-transform cursor-pointer flex items-center justify-center"
                    style={{ color: 'var(--popup-edit-icon)' }}
                    title="Edit comments, ratings, and details"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete "${m.title}" from your diary?`)) {
                        deleteMovie(m.id);
                        const updatedList = selectedDayMovies.list.filter(item => item.id !== m.id);
                        if (updatedList.length === 0) {
                          setSelectedDayMovies(null);
                        } else {
                          setSelectedDayMovies({ ...selectedDayMovies, list: updatedList });
                        }
                      }
                    }}
                    className="p-1 rounded-md hover:scale-115 transition-transform cursor-pointer flex items-center justify-center"
                    style={{ color: 'var(--popup-delete-icon)' }}
                    title="Delete movie in case of mistaken log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t flex justify-end" style={{ borderColor: 'var(--popup-card-border)' }}>
            <button
              type="button"
              onClick={() => {
                const targetDate = selectedDayMovies.date;
                setSelectedDayMovies(null);
                handleLogForDate(targetDate);
              }}
              className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
              style={{
                backgroundColor: 'var(--popup-btn-bg)',
                color: 'var(--popup-btn-text)'
              }}
            >
              <span>+ Add Another</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* ========================================================================= */
  /* 📖 RIGHT PAGE CONTENT: View Switcher & Entry Context                      */
  /* ========================================================================= */
  const rightPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 pt-1 px-1">
      
      {/* 🔒 FIXED TOP TOOLBAR & ACTION BAR */}
      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b-2 border-[var(--border-color)]/70 relative z-40 pr-1 pt-1">
        
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

        {/* Top Right Notification Bell & Dropdown */}
        <div className="relative flex items-center justify-end pr-1.5 pt-1.5">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95 relative ${
              isNotificationsOpen
                ? 'bg-[var(--accent-sakura)] border-[var(--accent-sakura-text)] text-[var(--accent-sakura-text)] shadow-md scale-105'
                : 'bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border-[var(--border-color)] text-[var(--text-primary)] hover:scale-105'
            }`}
            title="View Friend Tag Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2.5] text-rose-500" />
            {tagNotifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950 flex items-center justify-center text-[10px] text-white font-black shadow-xs animate-bounce" style={{ animationDuration: '3s' }}>
                {tagNotifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>

          {/* Popup 1: Tag Notifications Feed Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute top-11 right-0 w-80 sm:w-96 bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn text-[var(--text-primary)] backdrop-blur-xl ring-4 ring-black/10">
              <div className="p-3 bg-[var(--surface-subtle)] border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🍿</span>
                  <span className="font-black text-xs uppercase tracking-wider text-[var(--text-primary)]">Tagged Movie Logs</span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] font-extrabold text-[10px]">
                    {tagNotifications.length} Total
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="w-6 h-6 rounded-full bg-[var(--surface-hover)] hover:bg-[var(--surface-card)] flex items-center justify-center font-bold text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Close feed"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-color)]/50">
                {tagNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleOpenTagReview(notif)}
                    className={`p-3.5 hover:bg-[var(--surface-hover)]/80 transition-colors cursor-pointer flex gap-3 relative group ${
                      !notif.isRead ? 'bg-[var(--accent-sakura)]/25' : ''
                    }`}
                  >
                    {!notif.isRead && (
                      <span className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-rose-500" title="New unread tag" />
                    )}
                    <img
                      src={notif.friendAvatar}
                      alt={notif.friendName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[var(--accent-sakura-text)] shrink-0 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-muted)] gap-1">
                        <span className="truncate text-xs font-bold text-[var(--text-primary)]">
                          {notif.friendName}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-[var(--text-muted)]">{notif.timeAgo}</span>
                      </div>
                      <p className="text-xs text-[var(--text-primary)] mt-0.5 font-medium leading-relaxed">
                        Tagged you in <span className="font-black text-[var(--accent-sakura-text)] hover:underline">{notif.movieTitle}</span> ({notif.friendRating.toFixed(1)} ★)
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)] italic line-clamp-2 mt-1 bg-[var(--surface-subtle)] px-2.5 py-1.5 rounded-lg border border-[var(--border-color)]/60">
                        &ldquo;{notif.friendComment}&rdquo;
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                          <span>✨ Click to Add Your Rating & Comment</span>
                        </span>
                        <span className="text-[10px] bg-[var(--surface-card)] px-2 py-0.5 rounded-md border font-mono">
                          {notif.dateWatched}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-[var(--surface-subtle)] border-t border-[var(--border-color)] text-center">
                <button
                  type="button"
                  onClick={() => setTagNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
                  className="text-[11px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase tracking-wider cursor-pointer"
                >
                  ✓ Mark All As Read
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Strip */}
      <div className="shrink-0">
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

  return (
    <>
      <DualPaneNotebook leftPage={leftPageContent} rightPage={rightPageContent} />

      {/* Popup 2: Rate & Comment on Tagged Movie Modal */}
      {selectedTagForReview && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 flex flex-col gap-5 text-[var(--text-primary)]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl">🎬</span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black truncate leading-snug">
                    Log Tag: &ldquo;{selectedTagForReview.movieTitle}&rdquo;
                  </h3>
                  <p className="text-[11px] font-extrabold text-[var(--text-muted)] truncate">
                    Tagged by {selectedTagForReview.friendName} ({selectedTagForReview.friendHandle})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTagForReview(null)}
                className="w-8 h-8 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-center font-bold text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0"
                title="Cancel"
              >
                ✕
              </button>
            </div>

            {/* Friend's Original Tag & Review Card */}
            <div className="p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] flex gap-3.5 items-center">
              <img
                src={selectedTagForReview.posterPath}
                alt={selectedTagForReview.movieTitle}
                className="w-16 h-22 rounded-xl object-cover shadow-md shrink-0 border border-white/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={selectedTagForReview.friendAvatar}
                    alt={selectedTagForReview.friendName}
                    className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/50"
                  />
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate">{selectedTagForReview.friendName}&rsquo;s Take:</span>
                  <span className="text-xs font-black text-amber-400 font-mono ml-auto">{selectedTagForReview.friendRating.toFixed(1)} ★</span>
                </div>
                <p className="text-xs italic text-[var(--text-secondary)] leading-relaxed line-clamp-3 bg-[var(--surface-card)] p-2 rounded-lg border border-[var(--border-color)]/60">
                  &ldquo;{selectedTagForReview.friendComment}&rdquo;
                </p>
              </div>
            </div>

            {/* User Rating & Comment Form */}
            <form onSubmit={handleSaveTagReview} className="flex flex-col gap-4">
              
              {/* Star Rating Section */}
              <div className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] flex flex-col items-center justify-center gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  Your Personal Rating for &ldquo;{selectedTagForReview.movieTitle}&rdquo;
                </label>
                <div className="scale-110 py-1">
                  <StarRating
                    rating={userTagRating}
                    maxRating={5}
                    size="lg"
                    interactive={true}
                    onRatingChange={(val) => setUserTagRating(val)}
                  />
                </div>
                <span className="text-[11px] font-black font-mono px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  {userTagRating.toFixed(1)} out of 5.0 Stars
                </span>
              </div>

              {/* Comment & Diary Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center justify-between">
                  <span>Your Review & Thoughts</span>
                  <span className="text-[10px] font-normal text-[var(--text-muted)]">(Required for Diary Log)</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={userTagComment}
                  onChange={(e) => setUserTagComment(e.target.value)}
                  placeholder={`What did you think when watching with ${selectedTagForReview.friendName}? Write your thoughts here...`}
                  className="w-full p-3.5 rounded-2xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] focus:bg-[var(--surface-card)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-hidden focus:ring-2 focus:ring-[var(--accent-sakura-text)] transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Date Watched Input */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)]">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  Date Watched Together:
                </label>
                <input
                  type="date"
                  value={userTagDate}
                  onChange={(e) => setUserTagDate(e.target.value)}
                  className="px-3 py-1 rounded-xl bg-[var(--surface-card)] border border-[var(--border-color)] text-xs font-black font-mono text-[var(--text-primary)] outline-hidden cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setSelectedTagForReview(null)}
                  className="px-5 py-2.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] font-black text-xs transition-colors cursor-pointer border border-[var(--border-color)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-xs shadow-md hover:shadow-lg transition-transform hover:scale-102 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center gap-2 border border-white/40"
                >
                  <span>✿</span>
                  <span>Save Review to Diary</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
