/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Friend } from '../../types/diary';
import { StarRating } from '../rating/StarRating';
import { Users, Clock, PlusCircle, Heart, MessageSquare, Bookmark, Search, Sparkles, Flame, Share2, Film, Smartphone, Camera, Lock, ArrowRight, Check } from 'lucide-react';

interface FriendLog {
  id: string;
  friend: Friend;
  movieTitle: string;
  posterPath: string;
  releaseYear: string;
  rating: number;
  reviewText: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  isFavorite: boolean;
  venue: string;
  sharedExperience?: string;
}

export const FriendsSection: React.FC = () => {
  const { friends, setSelectedFriend, userProfile, setPrefillMovie, setIsLogModalOpen } = useMovieDiary();

  // Local interaction state for likes and bookmarked logs
  const [likedLogs, setLikedLogs] = useState<{ [key: string]: boolean }>({});
  const [bookmarkedLogs, setBookmarkedLogs] = useState<{ [key: string]: boolean }>({});
  
  // Comment drawer open state & live new comments
  const [activeCommentLogId, setActiveCommentLogId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [commentsByLog, setCommentsByLog] = useState<{ [key: string]: { id: string; handle: string; avatar: string; text: string; time: string }[] }>({
    'log-1': [
      { id: 'c1', handle: '@alex_films', avatar: '/images/avatars/alex.jpg', text: 'The matcha aesthetic in that Parisian cafe scene was unreal!', time: '1h ago' }
    ]
  });

  // Search input for discovery sidebar
  const [searchHandle, setSearchHandle] = useState<string>('');
  
  // Followed cinephiles state
  const [followingMap, setFollowingMap] = useState<{ [key: string]: boolean }>({
    'retro-1': false,
    'dreamer-2': true,
    'velvet-3': false,
  });

  // Sync state for contacts/letterboxd/instagram
  const [syncState, setSyncState] = useState<{ [key: string]: 'idle' | 'syncing' | 'synced' }>({
    letterboxd: 'idle',
    contacts: 'idle',
    instagram: 'idle',
  });

  // Sample Reverse-Chronological Friends Activity Feed
  const initialLogs: FriendLog[] = [
    {
      id: 'log-1',
      friend: friends[0] || ({ id: '1', name: 'Sarah Jenkins', handle: '@sarah_filmtea', avatar: '/images/avatars/sarah.jpg', bio: 'Matcha & Amelie enthusiast', favoriteGenres: ['Romance', 'Indie'], compatibilityScore: 96, isOnline: true, watchedLibrary: [], recentActivities: [] } as Friend),
      movieTitle: 'Amélie',
      posterPath: '/images/posters/amelie.jpg',
      releaseYear: '2001',
      rating: 5,
      reviewText: "Re-watched on rainy Saturday morning with matcha latte. Audrey Tautou's smile remains unbeatable. That gnome subplot gets funnier every time!",
      timestamp: '3 hours ago',
      likes: 14,
      commentsCount: 2,
      isFavorite: true,
      venue: 'At Home on Couch',
      sharedExperience: 'You and @sarah_filmtea watched this on the exact same rainy weekend!'
    },
    {
      id: 'log-2',
      friend: friends[1] || ({ id: '2', name: 'Alex Rivera', handle: '@alex_films', avatar: '/images/avatars/alex.jpg', bio: 'Denis Villeneuve defender', favoriteGenres: ['Sci-Fi'], compatibilityScore: 91, isOnline: false, watchedLibrary: [], recentActivities: [] } as Friend),
      movieTitle: 'Dune: Part Two',
      posterPath: '/images/posters/dune.jpg',
      releaseYear: '2024',
      rating: 4.5,
      reviewText: "The sound design during the worm-riding sequence literally shook my ribcage. Zimmer's score reaches ancient religious fervor here.",
      timestamp: 'Yesterday at 9:45 PM',
      likes: 29,
      commentsCount: 5,
      isFavorite: false,
      venue: 'IMAX 70mm',
      sharedExperience: 'You and @alex_films both rated this an emotional 4.5★ masterpiece!'
    },
    {
      id: 'log-3',
      friend: friends[2] || ({ id: '3', name: 'Maya Lin', handle: '@cozy_cineast', avatar: '/images/avatars/maya.jpg', bio: 'Studio Ghibli aesthetic perfectionist', favoriteGenres: ['Animation'], compatibilityScore: 89, isOnline: true, watchedLibrary: [], recentActivities: [] } as Friend),
      movieTitle: 'My Neighbor Totoro',
      posterPath: '/images/posters/totoro.jpg',
      releaseYear: '1988',
      rating: 5,
      reviewText: "The definitive comfort movie. Nothing dangerous happens for 86 minutes and it feels like drinking warm honey tea on a chilly evening.",
      timestamp: '3 days ago',
      likes: 41,
      commentsCount: 8,
      isFavorite: true,
      venue: '35mm Revival Screening',
      sharedExperience: 'You and @cozy_cineast both marked this as an all-time cozy favorite!'
    }
  ];

  const suggestedCinephiles = [
    { id: 'retro-1', name: 'Julian Vance', handle: '@retro_auteur', avatar: '/images/avatars/alex.jpg', matchScore: '98%', bio: '70s American new wave & vinyl collector' },
    { id: 'dreamer-2', name: 'Elena Rostova', handle: '@studio_dreamer', avatar: '/images/avatars/maya.jpg', matchScore: '94%', bio: 'Anime art director & watercolor storyboarder' },
    { id: 'velvet-3', name: 'Marcus Thorne', handle: '@velvet_cinema', avatar: '/images/avatars/sarah.jpg', matchScore: '91%', bio: 'Noir shadow architecture & Criterion obsessively' },
  ];

  const toggleLike = (logId: string) => {
    setLikedLogs(prev => ({ ...prev, [logId]: !prev[logId] }));
  };

  const toggleBookmark = (logId: string) => {
    setBookmarkedLogs(prev => ({ ...prev, [logId]: !prev[logId] }));
  };

  const handlePostComment = (logId: string) => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      handle: userProfile ? userProfile.handle : '@my_diary',
      avatar: userProfile ? userProfile.avatar : '/images/avatars/maya.jpg',
      text: commentInput,
      time: 'Just now'
    };
    setCommentsByLog(prev => ({
      ...prev,
      [logId]: [...(prev[logId] || []), newComment]
    }));
    setCommentInput('');
  };

  const handleSync = (platform: string) => {
    setSyncState(prev => ({ ...prev, [platform]: 'syncing' }));
    setTimeout(() => {
      setSyncState(prev => ({ ...prev, [platform]: 'synced' }));
    }, 1200);
  };

  const handleQuickLog = (movieTitle: string) => {
    setPrefillMovie({ title: movieTitle, userRating: 4.5 });
    setIsLogModalOpen(true);
  };

  const filteredLogs = initialLogs.filter(log => {
    if (!searchHandle) return true;
    return log.friend.handle.toLowerCase().includes(searchHandle.toLowerCase()) ||
           log.friend.name.toLowerCase().includes(searchHandle.toLowerCase()) ||
           log.movieTitle.toLowerCase().includes(searchHandle.toLowerCase());
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-0 pb-2 overflow-hidden">
      
      {/* 🌟 LEFT: Reverse-Chronological Activity Feed */}
      <div className="flex-1 flex flex-col h-full min-h-0 space-y-6 overflow-hidden">
        
        {/* 🔒 FIXED HEADER TITLE BAR (Never scrolls!) */}
        <div className="shrink-0 bg-[var(--surface-card)] border-2 border-[var(--border-color)] p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2.5">
              <Users className="w-7 h-7 text-[var(--accent-matcha-text)] stroke-[2.5]" />
              <span>Cinephile Community Feed</span>
            </h2>
            <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider mt-1">
              Live updates, star ratings, and written keepsakes from your circle
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] font-black text-xs uppercase tracking-wide border border-[var(--accent-matcha-text)]/20 shadow-xs">
            Live Stream
          </span>
        </div>

        {/* 📜 SCROLLABLE FEED STREAM AREA */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-8">
          {filteredLogs.map((log, index) => {
            const isLiked = likedLogs[log.id];
            const isBookmarked = bookmarkedLogs[log.id];
            const logComments = commentsByLog[log.id] || [];
            const isCommentDrawerOpen = activeCommentLogId === log.id;

            const washiStyles = ['washi-pink', 'washi-mint', 'washi-lilac', 'washi-gold'];
            const tintStyles = ['card-tint-pink', 'card-tint-mint', 'card-tint-lilac', 'card-tint-gold'];

            return (
              <article key={log.id} className={`polaroid-card ${tintStyles[index % tintStyles.length]} rounded-3xl p-6 sm:p-8 relative shadow-lg space-y-6`}>
                {/* Decorative Washi Tape */}
                <div className={`washi-strip ${washiStyles[index % washiStyles.length]}`}></div>

                {/* 🌟 Shared Experience Indicator Top Banner */}
                {log.sharedExperience && (
                  <div className="px-4 py-2 rounded-2xl bg-linear-to-r from-[var(--accent-sakura)]/80 via-[var(--accent-honey)]/80 to-[var(--accent-matcha)]/80 border border-white/60 text-[var(--text-primary)] font-black text-xs uppercase tracking-wide flex items-center gap-2 shadow-inner">
                    <Sparkles className="w-4 h-4 text-[var(--text-primary)] stroke-[2.5]" />
                    <span>{log.sharedExperience}</span>
                  </div>
                )}

                {/* Friend Header & Timestamp */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]/60">
                  <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setSelectedFriend(log.friend)}>
                    <img src={log.friend.avatar} alt={log.friend.name} className="w-12 h-12 rounded-full object-cover border-2 border-[var(--border-color)] shadow-md group-hover:scale-105 transition-transform" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-[var(--text-primary)] group-hover:text-[var(--accent-sakura-text)] transition-colors">
                          {log.friend.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[var(--accent-sakura-text)] bg-[var(--accent-sakura)] px-2 py-0.5 rounded-md">
                          {log.friend.handle}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] font-extrabold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 stroke-[2.5]" />
                        <span>Logged {log.timestamp} • {log.venue}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quick Log Integration Button: High contrast in both day & night mode! */}
                  <button
                    onClick={() => handleQuickLog(log.movieTitle)}
                    className="journal-pill flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface-card)] hover:bg-slate-900 hover:text-white dark:hover:bg-[#1A181C] dark:hover:text-[#F7ECD9] text-[var(--text-primary)] border border-[var(--border-color)] font-black text-xs uppercase tracking-wider shadow-sm transition-all transform active:scale-95 cursor-pointer"
                    title="Open log movie modal prefilled with this film"
                  >
                    <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                    <span className="hidden sm:inline">Log This Too!</span>
                  </button>
                </div>

                {/* Film Content & Review */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-28 sm:w-36 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-md">
                    <img src={log.posterPath} alt={log.movieTitle} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                          {log.movieTitle} <span className="text-sm font-bold text-[var(--text-secondary)]">({log.releaseYear})</span>
                        </h3>
                        {log.isFavorite && <span title="Friend's All-Time Favorite"><Heart className="w-5 h-5 text-pink-500 fill-pink-500 inline" /></span>}
                      </div>

                      {/* Clean Star Rating WITHOUT quote text! */}
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={log.rating} interactive={false} size="sm" showTooltip={false} />
                        <span className="text-xs font-black text-[var(--accent-star)]">{log.rating} ★</span>
                      </div>
                    </div>

                    {/* Full Written Review inside elegant notebook paper border */}
                    <blockquote className="p-4 rounded-2xl bg-[var(--surface-card)]/90 border border-[var(--border-color)]/80 text-sm font-serif italic text-[var(--text-primary)] leading-relaxed shadow-2xs">
                      "{log.reviewText}"
                    </blockquote>
                  </div>
                </div>

                {/* 💬 ENGAGEMENT CONTROLS: Like, Comment, Bookmark - Zero Dark-on-Dark! */}
                <div className="pt-4 border-t border-[var(--border-color)]/70 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    
                    {/* Like Action Toggle */}
                    <button
                      onClick={() => toggleLike(log.id)}
                      className={`journal-pill flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-2xs cursor-pointer ${
                        isLiked ? 'bg-rose-500 text-white border-rose-600 scale-105' : 'bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'stroke-[2.5]'}`} />
                      <span>{isLiked ? 'Liked' : 'Like'} ({log.likes + (isLiked ? 1 : 0)})</span>
                    </button>

                    {/* Comment Drawer Action Toggle: Uses high-contrast active styling! */}
                    <button
                      onClick={() => setActiveCommentLogId(isCommentDrawerOpen ? null : log.id)}
                      className={`journal-pill flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-2xs cursor-pointer ${
                        isCommentDrawerOpen
                          ? 'bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] border-2 border-[var(--accent-sakura-text)] shadow-md scale-102 ring-1 ring-white'
                          : 'bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)]'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                      <span>Comment ({logComments.length})</span>
                    </button>
                  </div>

                  {/* Bookmark Recommendation Toggle */}
                  <button
                    onClick={() => toggleBookmark(log.id)}
                    className={`journal-pill flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-2xs cursor-pointer ${
                      isBookmarked ? 'bg-amber-500 text-white border-amber-600' : 'bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white text-white' : 'stroke-[2.5]'}`} />
                    <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                </div>

                {/* Unfolded Comment Discussion Section */}
                {isCommentDrawerOpen && (
                  <div className="pt-4 border-t border-dashed border-[var(--border-color)] space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Discussion ({logComments.length} Notes)</span>
                    </h4>

                    {/* Comment Items */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {logComments.map((c) => (
                        <div key={c.id} className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)]/60">
                          <img src={c.avatar} alt={c.handle} className="w-8 h-8 rounded-full object-cover border border-white" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-black text-[var(--accent-sakura-text)]">{c.handle}</span>
                              <span className="text-[10px] font-bold text-[var(--text-muted)]">{c.time}</span>
                            </div>
                            <p className="text-xs font-bold text-[var(--text-primary)] mt-1 leading-normal">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input to Post Comment */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add a friendly movie note..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePostComment(log.id)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] text-xs font-extrabold text-[var(--text-primary)] outline-hidden shadow-inner"
                      />
                      <button
                        onClick={() => handlePostComment(log.id)}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-[#1A181C] dark:text-[#F7ECD9] dark:border dark:border-[#D1BEA5] font-black text-xs uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* 🌟 RIGHT: Discovery Sidebar (Independently scrollable!) */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col h-full min-h-0 space-y-6 overflow-y-auto pr-1 pb-6">
        
        {/* User Handle Search Box */}
        <div className="bg-[var(--surface-card)] p-6 rounded-3xl border-2 border-[var(--border-color)] shadow-md space-y-4 shrink-0">
          <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 stroke-[2.5] text-[var(--text-primary)]" />
            <span>Find Cinephiles</span>
          </h3>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-[var(--text-muted)] stroke-[2.5]" />
            </span>
            <input
              type="text"
              placeholder="Search @handle or title..."
              value={searchHandle}
              onChange={(e) => setSearchHandle(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] outline-hidden shadow-inner"
            />
            {searchHandle && (
              <button onClick={() => setSearchHandle('')} className="absolute inset-y-0 right-0 pr-3 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Suggested Cinephiles based on Shared Taste Scores */}
        <div className="bg-[var(--surface-card)] p-6 rounded-3xl border-2 border-[var(--border-color)] shadow-md space-y-6">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-sakura-text)] stroke-[2.5]" />
              <span>Suggested Cinephiles</span>
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] font-extrabold uppercase mt-1">
              Curated by AI cinema taste algorithms
            </p>
          </div>

          <div className="space-y-5">
            {suggestedCinephiles.map((c) => {
              const isFollowing = followingMap[c.id];
              return (
                <div key={c.id} className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--border-color)]/60 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)]" />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-black text-[var(--accent-sakura-text)]">{c.handle}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 font-black text-[10px] uppercase flex items-center gap-0.5">
                          <span>{c.matchScore} Match</span>
                          <Flame className="w-3 h-3 text-orange-500 fill-orange-500 stroke-[2]" />
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-[var(--text-secondary)] line-clamp-1 mt-0.5">{c.bio}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setFollowingMap(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                    className={`journal-pill px-3 py-1 rounded-xl font-black text-[11px] uppercase tracking-wide transition-all shrink-0 cursor-pointer ${
                      isFollowing
                        ? 'bg-[var(--surface-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]'
                        : 'bg-slate-900 text-white dark:bg-[#1A181C] dark:text-[#F7ECD9] dark:border dark:border-[#D1BEA5] shadow-sm hover:opacity-90'
                    }`}
                  >
                    {isFollowing ? '✓ Following' : '＋ Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connect Your Existing Circles */}
        <div className="bg-linear-to-b from-[var(--surface-card)] via-[var(--accent-lavender)]/30 to-[var(--surface-card)] p-6 rounded-3xl border-2 border-[var(--border-color)] shadow-md space-y-5">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-500 stroke-[2.5]" />
              <span>Connect Your Circle</span>
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] font-extrabold uppercase mt-1">
              Import contacts or connect accounts
            </p>
          </div>

          <div className="space-y-3">
            {/* Letterboxd Sync */}
            <button
              onClick={() => handleSync('letterboxd')}
              disabled={syncState.letterboxd !== 'idle'}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] transition-all font-black text-xs text-[var(--text-primary)] shadow-2xs group cursor-pointer disabled:cursor-default"
            >
              <span className="flex items-center gap-2.5">
                <Film className="w-4 h-4 stroke-[2.5] text-amber-500" />
                <span>Letterboxd Import</span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 ${
                syncState.letterboxd === 'synced' ? 'bg-emerald-500 text-white' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
              }`}>
                {syncState.letterboxd === 'idle' && 'Connect'}
                {syncState.letterboxd === 'syncing' && 'Syncing...'}
                {syncState.letterboxd === 'synced' && (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Synced</span>
                  </>
                )}
              </span>
            </button>

            {/* Phone Contacts Sync */}
            <button
              onClick={() => handleSync('contacts')}
              disabled={syncState.contacts !== 'idle'}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] transition-all font-black text-xs text-[var(--text-primary)] shadow-2xs group cursor-pointer disabled:cursor-default"
            >
              <span className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 stroke-[2.5] text-emerald-500" />
                <span>Phone Contacts</span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 ${
                syncState.contacts === 'synced' ? 'bg-emerald-500 text-white' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
              }`}>
                {syncState.contacts === 'idle' && 'Find Friends'}
                {syncState.contacts === 'syncing' && 'Matching...'}
                {syncState.contacts === 'synced' && (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Matched (4)</span>
                  </>
                )}
              </span>
            </button>

            {/* Instagram Sync */}
            <button
              onClick={() => handleSync('instagram')}
              disabled={syncState.instagram !== 'idle'}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] transition-all font-black text-xs text-[var(--text-primary)] shadow-2xs group cursor-pointer disabled:cursor-default"
            >
              <span className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 stroke-[2.5] text-pink-500" />
                <span>Instagram Sync</span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 ${
                syncState.instagram === 'synced' ? 'bg-emerald-500 text-white' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
              }`}>
                {syncState.instagram === 'idle' && 'Connect'}
                {syncState.instagram === 'syncing' && 'Syncing...'}
                {syncState.instagram === 'synced' && (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Connected</span>
                  </>
                )}
              </span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-[var(--text-muted)] font-extrabold uppercase tracking-wide flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 stroke-[2.5]" />
              <span>We never post without explicit permission</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
