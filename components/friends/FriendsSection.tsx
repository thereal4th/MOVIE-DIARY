/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Friend } from '../../types/diary';
import { StarRating } from '../rating/StarRating';
import { DualPaneNotebook } from '../layout/DualPaneNotebook';
import { Users, Clock, PlusCircle, Heart, MessageSquare, Bookmark, Search, Sparkles, Flame, Share2, Film, Smartphone, Camera, Lock, ArrowRight, Check, RotateCcw } from 'lucide-react';

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
    ],
    'log-2': [
      { id: 'c2', handle: '@cozy_cineast', avatar: '/images/avatars/maya.jpg', text: 'Zimmer created absolute perfection with this IMAX soundscape!', time: '30m ago' }
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
      reviewText: "Nothing heals a long tiring week quite like watching Totoro in the rain under an umbrella. Essential comfort therapy.",
      timestamp: '2 days ago',
      likes: 42,
      commentsCount: 8,
      isFavorite: true,
      venue: 'Midnight Bed Screening',
    }
  ];

  const toggleLike = (logId: string) => {
    setLikedLogs(prev => ({ ...prev, [logId]: !prev[logId] }));
  };

  const toggleBookmark = (logId: string) => {
    setBookmarkedLogs(prev => ({ ...prev, [logId]: !prev[logId] }));
  };

  const handleAddComment = (logId: string) => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      handle: userProfile?.handle ? `@${userProfile.handle}` : '@me',
      avatar: userProfile?.avatar || '/images/avatars/maya.jpg',
      text: commentInput.trim(),
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

  const suggestedCinephiles = [
    { id: 'retro-1', name: 'Julian Vance', handle: '@vance_cinema', avatar: '/images/avatars/alex.jpg', match: 94, bio: '35mm print archivist & Neo-Noir admirer', commonTags: ['Noir', 'Criterion', '1970s'] },
    { id: 'dreamer-2', name: 'Elena Rostova', handle: '@elena_reels', avatar: '/images/avatars/sarah.jpg', match: 91, bio: 'Chantal Akerman & Agnès Varda admirer', commonTags: ['French New Wave', '5★ Drama'] },
    { id: 'velvet-3', name: 'Marcus Thorne', handle: '@thorne_dune', avatar: '/images/avatars/maya.jpg', match: 88, bio: 'Sci-Fi brutalism & IMAX obsessive', commonTags: ['Sci-Fi', 'Dune', 'IMAX'] },
  ].filter(c => c.name.toLowerCase().includes(searchHandle.toLowerCase()) || c.handle.toLowerCase().includes(searchHandle.toLowerCase()) || c.commonTags.some(t => t.toLowerCase().includes(searchHandle.toLowerCase())));

  /* ========================================================================= */
  /* 📖 LEFT PAGE: Reverse-Chronological Activity Feed                         */
  /* ========================================================================= */
  const leftPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-hidden">
      
      {/* Locked Header */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b-2 border-[var(--border-color)]/70">
        <div>
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500 stroke-[2.5]" />
            <span>Friends Activity Stream</span>
          </h3>
          <p className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wide">
            Reverse-chronological logs & screening reviews from followed cinephiles
          </p>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] uppercase shadow-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3 stroke-[2.5]" />
          <span>Live Feed</span>
        </span>
      </div>

      {/* Internal Micro-Scrolling Activity Stream */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-6">
        {initialLogs.map((log) => {
          const isLiked = likedLogs[log.id] || false;
          const isBookmarked = bookmarkedLogs[log.id] || false;
          const currentLikes = log.likes + (isLiked ? 1 : 0);
          const comments = commentsByLog[log.id] || [];
          const isCommentOpen = activeCommentLogId === log.id;

          return (
            <div key={log.id} className="p-5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow relative space-y-4">
              
              {/* Friend identity row */}
              <div className="flex items-center justify-between gap-3">
                <div onClick={() => setSelectedFriend(log.friend)} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-purple-400 shadow-sm shrink-0">
                    <img src={log.friend.avatar} alt={log.friend.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {log.friend.isOnline && <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[var(--text-primary)] group-hover:text-pink-500 transition-colors flex items-center gap-1.5">
                      <span>{log.friend.name}</span>
                      <span className="text-xs font-mono text-[var(--accent-sakura-text)] font-extrabold">{log.friend.handle}</span>
                    </h4>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Watched {log.timestamp} • {log.venue}</span>
                    </span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[11px] font-black text-emerald-600 dark:text-emerald-400 shadow-2xs shrink-0">
                  {log.friend.compatibilityScore}% Taste Match
                </div>
              </div>

              {/* Shared Experience Highlight Indicator */}
              {log.sharedExperience && (
                <div className="p-2.5 rounded-xl bg-linear-to-r from-amber-500/15 via-rose-500/10 to-[var(--surface-subtle)] border border-amber-500/30 flex items-center gap-2 text-xs font-black text-[var(--text-primary)]">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500 animate-pulse" />
                  <span className="leading-tight">{log.sharedExperience}</span>
                </div>
              )}

              {/* Movie info & review body */}
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[var(--surface-subtle)]/70 border border-[var(--border-color)]/60">
                <img
                  src={log.posterPath}
                  alt={log.movieTitle}
                  onClick={() => { setPrefillMovie({ title: log.movieTitle, releaseYear: parseInt(log.releaseYear) || 2024, posterPath: log.posterPath }); setIsLogModalOpen(true); }}
                  className="w-20 aspect-[2/3] rounded-xl object-cover border border-[var(--border-color)] shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
                  title="Click to Log This Movie to Your Diary!"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-black text-base text-[var(--text-primary)] truncate">{log.movieTitle}</h5>
                      <span className="text-xs text-[var(--text-muted)] font-extrabold">({log.releaseYear})</span>
                      {log.isFavorite && <Heart className="w-4 h-4 text-pink-500 fill-pink-500 inline ml-1" />}
                    </div>
                    <StarRating rating={log.rating} size="sm" interactive={false} showTooltip={false} />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] italic font-serif leading-relaxed">
                    "{log.reviewText}"
                  </p>
                  <button
                    onClick={() => { setPrefillMovie({ title: log.movieTitle, releaseYear: parseInt(log.releaseYear) || 2024, posterPath: log.posterPath }); setIsLogModalOpen(true); }}
                    className="text-[11px] font-black text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Log this film to your diary</span>
                  </button>
                </div>
              </div>

              {/* Quick Action Engagement Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]/60 text-xs font-black text-[var(--text-secondary)]">
                <button
                  onClick={() => toggleLike(log.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    isLiked ? 'text-pink-500 bg-pink-500/10 scale-105 shadow-2xs font-black' : 'hover:bg-[var(--surface-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                  <span>{currentLikes} Likes</span>
                </button>

                <button
                  onClick={() => setActiveCommentLogId(isCommentOpen ? null : log.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    isCommentOpen ? 'bg-[var(--surface-subtle)] text-[var(--text-primary)]' : 'hover:bg-[var(--surface-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{comments.length} Comments</span>
                </button>

                <button
                  onClick={() => toggleBookmark(log.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    isBookmarked ? 'text-amber-500 bg-amber-500/10 scale-105 shadow-2xs font-black' : 'hover:bg-[var(--surface-subtle)] text-[var(--text-muted)]'
                  }`}
                  title="Bookmark friend's review for future watching!"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                </button>
              </div>

              {/* Expandable Comments Drawer */}
              {isCommentOpen && (
                <div className="pt-3 border-t border-dashed border-[var(--border-color)]/60 space-y-3 animate-fadeIn">
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {comments.map(c => (
                      <div key={c.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--surface-subtle)] text-xs">
                        <img src={c.avatar} alt={c.handle} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[var(--text-primary)]">{c.handle}</span>
                            <span className="text-[9px] text-[var(--text-muted)]">{c.time}</span>
                          </div>
                          <p className="text-[var(--text-secondary)] mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write a warm cinema comment..."
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment(log.id)}
                      className="flex-1 px-3.5 py-1.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-xs font-bold outline-hidden"
                    />
                    <button
                      onClick={() => handleAddComment(log.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs cursor-pointer shadow-xs"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );

  /* ========================================================================= */
  /* 📖 RIGHT PAGE: Social Discovery & Shared Watching Chemistry               */
  /* ========================================================================= */
  const rightPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-hidden">
      
      {/* Locked Header */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b-2 border-[var(--border-color)]/70">
        <div>
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 stroke-[2.5]" />
            <span>Social Discovery & Chemistry</span>
          </h3>
          <p className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wide">
            Suggested cinephiles, shared watching overlap, & contacts sync
          </p>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-pink-500 text-white uppercase shadow-xs">
          96% Avg Match
        </span>
      </div>

      {/* Internal Micro-Scrolling Sidebar Widgets */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-6">
        
        {/* WIDGET 1: FRIEND SEARCH & CONTACT IMPORT TOOLS */}
        <div className="p-5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm space-y-4">
          <h4 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
            <Search className="w-4 h-4 text-emerald-500" />
            <span>Find Cinephiles & Sync Contacts</span>
          </h4>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search @handle, name, or taste tag (e.g. Noir, Dune)..."
              value={searchHandle}
              onChange={e => setSearchHandle(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] focus:bg-[var(--surface-card)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] outline-hidden transition-all shadow-inner"
            />
          </div>

          <div className="space-y-2 pt-1">
            <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Sync Cinema Network:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: 'letterboxd', label: 'Letterboxd', icon: <Film className="w-3.5 h-3.5 text-emerald-500" /> },
                { key: 'instagram', label: 'Instagram', icon: <Camera className="w-3.5 h-3.5 text-pink-500" /> },
                { key: 'contacts', label: 'Contacts', icon: <Smartphone className="w-3.5 h-3.5 text-blue-500" /> },
              ].map((platform) => {
                const status = syncState[platform.key];
                return (
                  <button
                    key={platform.key}
                    onClick={() => handleSync(platform.key)}
                    disabled={status === 'syncing'}
                    className={`p-2.5 rounded-xl border font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      status === 'synced' ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs' : status === 'syncing' ? 'bg-amber-500 text-white border-amber-600 animate-pulse' : 'bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--border-color)]'
                    }`}
                  >
                    {status === 'synced' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : platform.icon}
                    <span className="truncate">{status === 'synced' ? 'Synced!' : status === 'syncing' ? 'Syncing...' : `Import ${platform.label}`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* WIDGET 2: SHARED WATCHING WIDGET (Overlapping dates & weekends) */}
        <div className="p-5 rounded-3xl bg-linear-to-tr from-[var(--surface-card)] via-[var(--accent-honey)]/20 to-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm space-y-3 relative overflow-hidden">
          <div className="washi-strip washi-gold right-6 top-3"></div>
          
          <h4 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Shared Watching Overlays</span>
          </h4>
          <p className="text-xs text-[var(--text-secondary)] font-serif italic leading-relaxed">
            "You and <span className="font-sans font-extrabold text-purple-600 dark:text-purple-400">@sarah_filmtea</span> logged films on the same date 4 times this month! Your mutual favorite decade is the <span className="font-sans font-extrabold text-amber-600 dark:text-amber-400">2010s</span>."
          </p>
          <div className="p-3 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-color)] flex items-center justify-between shadow-xs text-xs font-black">
            <div className="flex items-center gap-2">
              <img src="/images/posters/little_women.jpg" alt="Little Women" className="w-9 h-12 rounded-lg object-cover shadow-2xs" />
              <div>
                <p className="text-[var(--text-primary)]">Little Women (2019)</p>
                <span className="text-[10px] font-extrabold text-emerald-600">Both watched last Sunday!</span>
              </div>
            </div>
            <button
              onClick={() => { setPrefillMovie({ title: "Little Women", releaseYear: 2019, posterPath: "/images/posters/little_women.jpg" }); setIsLogModalOpen(true); }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-black text-[11px] uppercase cursor-pointer hover:bg-amber-600"
            >
              Log Rewatch
            </button>
          </div>
        </div>

        {/* WIDGET 3: SUGGESTED CINEPHILES (Based on shared taste match scores) */}
        <div className="p-5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm space-y-4">
          <h4 className="text-sm font-black text-[var(--text-primary)] flex items-center justify-between uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-500" />
              <span>Suggested Cinephiles</span>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-muted)]">By Taste DNA</span>
          </h4>

          <div className="space-y-3">
            {suggestedCinephiles.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic py-4 text-center">No cinephiles matched your search query "{searchHandle}".</p>
            ) : (
              suggestedCinephiles.map(cinephile => {
                const isFollowing = followingMap[cinephile.id] || false;
                return (
                  <div key={cinephile.id} className="p-3.5 rounded-2xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <img src={cinephile.avatar} alt={cinephile.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-xs sm:text-sm text-[var(--text-primary)] truncate">{cinephile.name}</span>
                          <span className="text-[11px] font-mono text-[var(--accent-sakura-text)] font-bold">{cinephile.handle}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] italic font-serif truncate mt-0.5">
                          "{cinephile.bio}"
                        </p>
                        <div className="flex flex-wrap items-center gap-1 mt-1.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                            {cinephile.match}% Match
                          </span>
                          {cinephile.commonTags.map(t => (
                            <span key={t} className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-muted)]">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setFollowingMap(prev => ({ ...prev, [cinephile.id]: !prev[cinephile.id] }))}
                      className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase shrink-0 transition-all cursor-pointer ${
                        isFollowing ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'bg-pink-500 hover:bg-pink-600 text-white shadow-md'
                      }`}
                    >
                      {isFollowing ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );

  return <DualPaneNotebook leftPage={leftPageContent} rightPage={rightPageContent} />;
};
