/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { DualPaneNotebook } from '../layout/DualPaneNotebook';
import { Sparkles, Star, Bookmark, Check, Plus, Popcorn, Heart, Filter, Film, Play, Clock, Calendar, Users, Flame, Trophy, Gem, SlidersHorizontal, ArrowRight, X, Clapperboard, Monitor, CheckCircle2 } from 'lucide-react';

interface SmartWatchlistItem {
  id: string;
  title: string;
  posterPath: string;
  director: string;
  releaseYear: number;
  runtimeMinutes: number;
  genre: string;
  provider: 'Netflix' | 'Mubi' | 'Criterion' | 'HBO Max' | 'Apple TV+' | 'Hulu' | 'Disney+';
  matchScore: number;
  decade: '2020s' | '2010s' | '2000s' | '1990s';
  savedToWatchlist: boolean;
}

interface TasteMixerMatch {
  title: string;
  posterPath: string;
  director: string;
  year: number;
  overlapPercentage: number;
  reason: string;
  streamingOn: string;
  runtime: number;
}

export const RecommendationsSection: React.FC = () => {
  const { movies, friends, setPrefillMovie, setIsLogModalOpen, setSelectedFriend, userProfile } = useMovieDiary();

  // --- LEFT PAGE: FOR YOU (Because You Liked X) & WATCHLIST STATE ---
  const topLikedDiaryMovies = useMemo(() => {
    const highRated = movies.filter((m) => m.userRating >= 4.0);
    return highRated.length > 0 ? highRated.slice(0, 3) : movies.slice(0, 2);
  }, [movies]);

  const becauseYouLikedData: Record<string, any[]> = {
    "Amélie": [
      { id: 'rec-1', title: 'Chocolat', director: 'Lasse Hallström', year: 2000, runtime: 121, rating: '4.7 ★', poster: '/images/posters/little_women.jpg', reason: 'Whimsical French town warmth, enchanting color grading, and magical realism.', provider: 'Criterion' },
      { id: 'rec-2', title: 'The French Dispatch', director: 'Wes Anderson', year: 2021, runtime: 107, rating: '4.5 ★', poster: '/images/posters/lala_land.jpg', reason: 'Metaphysical symmetry, quaint romantic humor, and dazzling artistic production design.', provider: 'Disney+' },
      { id: 'rec-3', title: 'Midnight in Paris', director: 'Woody Allen', year: 2011, runtime: 94, rating: '4.6 ★', poster: '/images/posters/past_lives.jpg', reason: 'Nostalgic European wanderlust with nocturnal jazz aesthetics.', provider: 'Netflix' },
    ],
    "My Neighbor Totoro": [
      { id: 'rec-4', title: "Kiki's Delivery Service", director: 'Hayao Miyazaki', year: 1989, runtime: 103, rating: '4.9 ★', poster: '/images/posters/totoro.jpg', reason: 'Gentle coming-of-age spirit, lush hand-painted landscapes, and comforting orchestral score.', provider: 'HBO Max' },
      { id: 'rec-5', title: 'Ponyo', director: 'Hayao Miyazaki', year: 2008, runtime: 101, rating: '4.7 ★', poster: '/images/posters/little_women.jpg', reason: 'Childlike innocence, watercolor oceanic wonder, and heartwarming friendship.', provider: 'HBO Max' },
      { id: 'rec-6', title: 'Spirited Away', director: 'Hayao Miyazaki', year: 2001, runtime: 125, rating: '5.0 ★', poster: '/images/posters/totoro.jpg', reason: 'Breathtaking world-building and folklore-inspired comforting fantasy.', provider: 'HBO Max' },
    ],
    "Little Women": [
      { id: 'rec-7', title: 'Pride & Prejudice', director: 'Joe Wright', year: 2005, runtime: 129, rating: '4.8 ★', poster: '/images/posters/little_women.jpg', reason: 'Misty morning English romanticism, stirring piano melodies, and sharp sisterhood dialogue.', provider: 'Netflix' },
      { id: 'rec-8', title: 'Lady Bird', director: 'Greta Gerwig', year: 2017, runtime: 94, rating: '4.6 ★', poster: '/images/posters/past_lives.jpg', reason: "Greta Gerwig's authentic directorial warmth and tender familial bonds.", provider: 'Apple TV+' },
      { id: 'rec-9', title: 'Emma.', director: 'Autumn de Wilde', year: 2020, runtime: 124, rating: '4.5 ★', poster: '/images/posters/lala_land.jpg', reason: 'Pastel confectionary aesthetics, witty romance, and joyful period costume elegance.', provider: 'Criterion' },
    ]
  };

  const defaultCarousel = [
    { id: 'def-1', title: 'Past Lives', director: 'Celine Song', year: 2023, runtime: 106, rating: '4.9 ★', poster: '/images/posters/past_lives.jpg', reason: 'Poetic meditations on destiny, tender glances, and breathtaking modern romance.', provider: 'Mubi' },
    { id: 'def-2', title: 'La La Land', director: 'Damien Chazelle', year: 2016, runtime: 128, rating: '4.8 ★', poster: '/images/posters/lala_land.jpg', reason: 'Vibrant musical cinema magic, Technicolor passion, and bittersweet dreams.', provider: 'Apple TV+' },
    { id: 'def-3', title: 'Little Women', director: 'Greta Gerwig', year: 2019, runtime: 135, rating: '4.9 ★', poster: '/images/posters/little_women.jpg', reason: 'Cozy fireplace storytelling and everlasting sisterly affection.', provider: 'Netflix' },
  ];

  const [watchlistItems, setWatchlistItems] = useState<SmartWatchlistItem[]>([
    { id: 'w-1', title: 'Before Sunrise', posterPath: '/images/posters/past_lives.jpg', director: 'Richard Linklater', releaseYear: 1995, runtimeMinutes: 101, genre: 'Romance', provider: 'Criterion', matchScore: 98, decade: '1990s', savedToWatchlist: true },
    { id: 'w-2', title: 'Portrait of a Lady on Fire', posterPath: '/images/posters/little_women.jpg', director: 'Céline Sciamma', releaseYear: 2019, runtimeMinutes: 122, genre: 'Romance', provider: 'Hulu', matchScore: 97, decade: '2010s', savedToWatchlist: true },
    { id: 'w-3', title: 'In the Mood for Love', posterPath: '/images/posters/lala_land.jpg', director: 'Wong Kar-wai', releaseYear: 2000, runtimeMinutes: 98, genre: 'Drama', provider: 'Mubi', matchScore: 99, decade: '2000s', savedToWatchlist: true },
    { id: 'w-4', title: 'Frances Ha', posterPath: '/images/posters/past_lives.jpg', director: 'Noah Baumbach', releaseYear: 2012, runtimeMinutes: 86, genre: 'Indie', provider: 'Criterion', matchScore: 93, decade: '2010s', savedToWatchlist: true },
    { id: 'w-5', title: 'Aftersun', posterPath: '/images/posters/totoro.jpg', director: 'Charlotte Wells', releaseYear: 2022, runtimeMinutes: 102, genre: 'Drama', provider: 'Mubi', matchScore: 96, decade: '2020s', savedToWatchlist: true },
    { id: 'w-6', title: 'Petite Maman', posterPath: '/images/posters/little_women.jpg', director: 'Céline Sciamma', releaseYear: 2021, runtimeMinutes: 72, genre: 'Fantasy', provider: 'Mubi', matchScore: 95, decade: '2020s', savedToWatchlist: true },
  ]);

  const [providerFilter, setProviderFilter] = useState<string>('All');
  const [runtimeFilter, setRuntimeFilter] = useState<string>('All');
  const [genreFilter, setGenreFilter] = useState<string>('All');

  const filteredWatchlist = useMemo(() => {
    return watchlistItems.filter((item) => {
      if (!item.savedToWatchlist) return false;
      if (providerFilter !== 'All' && item.provider !== providerFilter) return false;
      if (genreFilter !== 'All' && item.genre !== genreFilter) return false;
      if (runtimeFilter === '< 90 mins' && item.runtimeMinutes >= 90) return false;
      if (runtimeFilter === '90-120 mins' && (item.runtimeMinutes < 90 || item.runtimeMinutes > 120)) return false;
      if (runtimeFilter === '120+ mins' && item.runtimeMinutes < 120) return false;
      return true;
    });
  }, [watchlistItems, providerFilter, runtimeFilter, genreFilter]);

  // --- RIGHT PAGE: TASTE MIXER ("Find a Movie for Two") STATE ---
  const [selectedMixerFriendId, setSelectedMixerFriendId] = useState<string>(friends[0]?.id || 'f-1');
  const selectedMixerFriend = useMemo(() => friends.find(f => f.id === selectedMixerFriendId) || friends[0] || ({ name: "Sarah Jenkins", handle: "@sarah_filmtea", avatar: "/images/avatars/sarah.jpg" }), [friends, selectedMixerFriendId]);

  const tasteMixerResults: Record<string, { compatibility: number; sharedVibes: string[]; matches: TasteMixerMatch[] }> = {
    'f-1': {
      compatibility: 97,
      sharedVibes: ['Poetic Cinematography', 'Bittersweet Romance', 'French Cinema'],
      matches: [
        { title: 'Portrait of a Lady on Fire', year: 2019, director: 'Céline Sciamma', runtime: 122, streamingOn: 'Criterion', overlapPercentage: 99, posterPath: '/images/posters/past_lives.jpg', reason: 'You both gave 5.0★ to contemplative romantic dramas this year!' },
        { title: 'Before Sunset', year: 2004, director: 'Richard Linklater', runtime: 80, streamingOn: 'HBO Max', overlapPercentage: 96, posterPath: '/images/posters/lala_land.jpg', reason: 'Sarah rated Before Sunrise 5.0★ and your diary celebrates dialogue-driven romantic real-time escapades.' },
      ]
    },
    'f-2': {
      compatibility: 91,
      sharedVibes: ['Aesthetic Marvels', 'Sci-Fi Worldbuilding', 'Bold Direction'],
      matches: [
        { title: 'Dune: Part Two', year: 2024, director: 'Denis Villeneuve', runtime: 166, streamingOn: 'HBO Max', overlapPercentage: 95, posterPath: '/images/posters/dune.jpg', reason: 'You share a mutual awe for IMAX cinematic scale and titanic acoustic sound design.' },
        { title: 'Blade Runner 2049', year: 2017, director: 'Denis Villeneuve', runtime: 163, streamingOn: 'Netflix', overlapPercentage: 92, posterPath: '/images/posters/lala_land.jpg', reason: 'Listed in their Top 3 Film Treasures and matches your taste affinity for cyberpunk noir.' }
      ]
    },
    'f-3': {
      compatibility: 94,
      sharedVibes: ['Cozy Comfort Watches', 'Ghibli Magic', 'Indie Whimsically'],
      matches: [
        { title: 'Whisper of the Heart', year: 1995, director: 'Yoshifusa Kondo', runtime: 111, streamingOn: 'HBO Max', overlapPercentage: 98, posterPath: '/images/posters/totoro.jpg', reason: 'You gave Totoro 5.0★ and Maya leads your friend circle in comforting anime hours.' },
        { title: 'Fantastic Mr. Fox', year: 2009, director: 'Wes Anderson', runtime: 87, streamingOn: 'Disney+', overlapPercentage: 93, posterPath: '/images/posters/little_women.jpg', reason: 'Stop-motion autumn warmth that hits both of your comfort screening formulas.' }
      ]
    }
  };

  const activeMixerData = tasteMixerResults[selectedMixerFriendId] || tasteMixerResults['f-1'] || { compatibility: 95, sharedVibes: ['Cinema Magic'], matches: [] };

  // --- RIGHT PAGE: TRENDING & CURATED HUBS ---
  const [selectedSeasonHub, setSelectedSeasonHub] = useState<'awards' | 'summer' | 'gems'>('awards');
  const curatedHubsData = {
    awards: [
      { id: 'cur-1', title: 'Anatomy of a Fall', director: 'Justine Triet', year: 2023, rating: '4.8 ★', poster: '/images/posters/past_lives.jpg', badge: "Palme d'Or Winner" },
      { id: 'cur-2', title: 'The Zone of Interest', director: 'Jonathan Glazer', year: 2023, rating: '4.7 ★', poster: '/images/posters/totoro.jpg', badge: 'Best Sound Design' },
    ],
    summer: [
      { id: 'cur-4', title: 'Challengers', director: 'Luca Guadagnino', year: 2024, rating: '4.7 ★', poster: '/images/posters/little_women.jpg', badge: 'Adrenaline Score' },
      { id: 'cur-5', title: 'Hit Man', director: 'Richard Linklater', year: 2024, rating: '4.6 ★', poster: '/images/posters/past_lives.jpg', badge: 'Witty Crowd-Pleaser' },
    ],
    gems: [
      { id: 'cur-7', title: 'Rye Lane', director: 'Raine Allen-Miller', year: 2023, rating: '4.9 ★', poster: '/images/posters/little_women.jpg', badge: 'Hidden Masterpiece' },
      { id: 'cur-8', title: 'Robot Dreams', director: 'Pablo Berger', year: 2023, rating: '5.0 ★', poster: '/images/posters/past_lives.jpg', badge: 'Tearjerker Treasure' },
    ]
  };

  const handleLogRecommendation = (title: string, director?: string, year?: number, poster?: string) => {
    setPrefillMovie({ title, director: director || 'Unknown', releaseYear: year || 2024, posterPath: poster || '/images/posters/totoro.jpg', userRating: 4.5 });
    setIsLogModalOpen(true);
  };

  const toggleWatchlistRemoval = (id: string) => {
    setWatchlistItems(prev => prev.map(m => m.id === id ? { ...m, savedToWatchlist: !m.savedToWatchlist } : m));
  };

  /* ========================================================================= */
  /* 📖 LEFT PAGE: Personalized Recommendations & Smart Watchlist                */
  /* ========================================================================= */
  const leftPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-hidden">
      
      {/* Locked Header */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b-2 border-[var(--border-color)]/70">
        <div>
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 stroke-[2.5]" />
            <span>Personalized & Smart Watchlist</span>
          </h3>
          <p className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wide">
            Inspired by your 4+★ diary logs & filtered watchlist jewels
          </p>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-pink-500 text-white uppercase shadow-xs flex items-center gap-1">
          <Bookmark className="w-3 h-3 fill-current" />
          <span>{watchlistItems.filter(w => w.savedToWatchlist).length} Saved</span>
        </span>
      </div>

      {/* Internal Micro-Scrolling Hubs */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-6">
        
        {/* MODULE 1: "BECAUSE YOU LIKED..." CAROUSEL */}
        <div className="space-y-4">
          {topLikedDiaryMovies.slice(0, 2).map((likedMovie) => {
            const recs = becauseYouLikedData[likedMovie.title] || defaultCarousel;
            return (
              <div key={likedMovie.id} className="p-4 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-color)]/50 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-current text-pink-500" />
                    <span>Because You Liked <strong className="text-[var(--text-primary)] font-bold">"{likedMovie.title}"</strong> ({likedMovie.userRating.toFixed(1)}★)</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-[var(--text-muted)]">AI Match DNA</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recs.map((rec: any) => (
                    <div key={rec.id} className="p-2.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] flex flex-col justify-between space-y-2 group">
                      <div className="flex items-start gap-2.5">
                        <img src={rec.poster || '/images/posters/totoro.jpg'} alt={rec.title} onClick={() => handleLogRecommendation(rec.title, rec.director, rec.year, rec.poster)} className="w-12 h-16 rounded-xl object-cover shadow-xs shrink-0 cursor-pointer group-hover:scale-105 transition-transform" title="Log to Diary" />
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-xs text-[var(--text-primary)] truncate group-hover:text-pink-500 cursor-pointer" onClick={() => handleLogRecommendation(rec.title, rec.director, rec.year, rec.poster)}>{rec.title}</p>
                          <span className="text-[10px] text-amber-500 font-bold block">{rec.rating} • {rec.provider}</span>
                          <p className="text-[10px] text-[var(--text-secondary)] italic font-serif line-clamp-2 leading-tight mt-1">
                            "{rec.reason}"
                          </p>
                        </div>
                      </div>
                      <button onClick={() => handleLogRecommendation(rec.title, rec.director, rec.year, rec.poster)} className="w-full py-1 rounded-lg bg-[var(--accent-matcha)] hover:brightness-105 text-[var(--accent-matcha-text)] font-black text-[10px] uppercase shadow-2xs cursor-pointer flex items-center justify-center gap-1">
                        <Plus className="w-3 h-3 stroke-[3]" />
                        <span>Log Movie</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* MODULE 2: SMART WATCHLIST FILTERS */}
        <div className="p-5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
              <Filter className="w-4 h-4 text-purple-500" />
              <span>Smart Watchlist Quick Filters</span>
            </h4>
            
            {/* Provider Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Netflix', 'Criterion', 'Mubi', 'HBO Max'].map(p => (
                <button
                  key={p}
                  onClick={() => setProviderFilter(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all shrink-0 cursor-pointer ${
                    providerFilter === p ? 'bg-purple-600 text-white shadow-xs scale-102' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Runtime & Genre Sub-filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-color)]/50 pt-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--text-muted)] mr-1" />
              {['All', '< 90 mins', '90-120 mins', '120+ mins'].map(r => (
                <button
                  key={r}
                  onClick={() => setRuntimeFilter(r)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${runtimeFilter === r ? 'bg-amber-500 text-white font-black' : 'bg-[var(--surface-subtle)] text-[var(--text-muted)]'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              {['All', 'Romance', 'Drama', 'Indie', 'Animation'].map(g => (
                <button
                  key={g}
                  onClick={() => setGenreFilter(g)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${genreFilter === g ? 'bg-[var(--accent-sakura-text)] text-white font-black' : 'bg-[var(--surface-subtle)] text-[var(--text-muted)]'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Filtered Watchlist Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {filteredWatchlist.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic py-4 text-center col-span-2">No active watchlist titles match selected streaming filters.</p>
            ) : (
              filteredWatchlist.map(item => (
                <div key={item.id} className="p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.posterPath} alt={item.title} onClick={() => handleLogRecommendation(item.title, item.director, item.releaseYear, item.posterPath)} className="w-11 h-16 rounded-lg object-cover shadow-xs shrink-0 cursor-pointer group-hover:scale-105 transition-transform" />
                    <div className="min-w-0">
                      <p onClick={() => handleLogRecommendation(item.title, item.director, item.releaseYear, item.posterPath)} className="font-black text-xs text-[var(--text-primary)] truncate hover:text-pink-500 cursor-pointer">{item.title} ({item.releaseYear})</p>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block">Dir. {item.director} • {item.runtimeMinutes}m</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          {item.provider}
                        </span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          {item.matchScore}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleLogRecommendation(item.title, item.director, item.releaseYear, item.posterPath)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] font-black text-[10px] uppercase cursor-pointer hover:brightness-105"
                    >
                      + Log
                    </button>
                    <button
                      onClick={() => toggleWatchlistRemoval(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-black text-[10px] uppercase cursor-pointer flex items-center justify-center gap-1"
                      title="Check off watchlist"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );

  /* ========================================================================= */
  /* 📖 RIGHT PAGE: Taste Mixer & Curated Seasonal Hubs                        */
  /* ========================================================================= */
  const rightPageContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-hidden">
      
      {/* Locked Header */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b-2 border-[var(--border-color)]/70">
        <div>
          <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500 stroke-[2]" />
            <span>Taste Mixer & Curated Hubs</span>
          </h3>
          <p className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wide">
            Interactive "Find a Movie for Two" blender & community gems
          </p>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-linear-to-r from-rose-500 to-amber-500 text-white uppercase shadow-xs">
          Live Blender
        </span>
      </div>

      {/* Internal Micro-Scrolling Right Sidebar */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-6">
        
        {/* MODULE 1: INTERACTIVE TASTE MIXER ("Find a Movie for Two") */}
        <div className="p-5 rounded-3xl bg-linear-to-tr from-[var(--surface-card)] via-rose-500/10 to-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm space-y-4 relative overflow-hidden">
          <div className="washi-strip washi-pink right-6 top-3"></div>
          
          <div>
            <h4 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-1.5 uppercase tracking-wide">
              <Users className="w-4 h-4 text-rose-500" />
              <span>Taste Mixer • Find a Movie for Two</span>
            </h4>
            <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
              Select a friend to blend your diary DNA and generate overlapping watchlist treasures!
            </p>
          </div>

          {/* Friend Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {friends.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedMixerFriendId(f.id)}
                className={`p-2 rounded-2xl border flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  selectedMixerFriendId === f.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-102 border-rose-500' : 'bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--border-color)]'
                }`}
              >
                <img src={f.avatar} alt={f.name} className="w-6 h-6 rounded-full object-cover border border-white" />
                <span className="font-black text-xs">{f.name.split(' ')[0]}</span>
                <span className="text-[10px] font-mono text-pink-500 dark:text-pink-400 font-black">{f.compatibilityScore || 95}%</span>
              </button>
            ))}
          </div>

          {/* Chemistry Breakdown Card */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-color)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-black">
              <div className="flex items-center gap-2">
                <span className="text-rose-500">Shared Vibe DNA:</span>
                <div className="flex flex-wrap gap-1">
                  {activeMixerData.sharedVibes.map(v => (
                    <span key={v} className="px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-[var(--text-primary)] text-[10px]">#{v}</span>
                  ))}
                </div>
              </div>
              <span className="text-emerald-500 font-bold">{activeMixerData.compatibility}% Match</span>
            </div>

            {/* Overlapping Film Recommendations */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {activeMixerData.matches.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)]/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={m.posterPath} alt={m.title} onClick={() => handleLogRecommendation(m.title, m.director, m.year, m.posterPath)} className="w-10 h-14 rounded-lg object-cover shadow-2xs shrink-0 cursor-pointer hover:scale-105 transition-transform" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-xs text-[var(--text-primary)] truncate">{m.title}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-600 dark:text-pink-300">{m.overlapPercentage}% Overlap</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">Streaming on {m.streamingOn} • {m.runtime}m</span>
                      <p className="text-[10px] text-[var(--text-secondary)] italic font-serif leading-tight mt-0.5">
                        "{m.reason}"
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleLogRecommendation(m.title, m.director, m.year, m.posterPath)} className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] uppercase shrink-0 shadow-xs cursor-pointer">
                    Log Both
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODULE 2: TRENDING & CURATED SEASONAL COLLECTIONS */}
        <div className="p-5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Curated Community Hubs</span>
            </h4>

            {/* Season Switcher */}
            <div className="flex items-center gap-1 bg-[var(--surface-subtle)] p-1 rounded-xl border border-[var(--border-color)]">
              {[
                { key: 'awards', label: 'Award Season', icon: <Trophy className="w-3 h-3 text-amber-500" /> },
                { key: 'summer', label: 'Summer Blockbusters', icon: <Flame className="w-3 h-3 text-rose-500" /> },
                { key: 'gems', label: 'Hidden Gems', icon: <Gem className="w-3 h-3 text-emerald-500" /> },
              ].map(hub => (
                <button
                  key={hub.key}
                  onClick={() => setSelectedSeasonHub(hub.key as any)}
                  className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase flex items-center gap-1 transition-all cursor-pointer ${
                    selectedSeasonHub === hub.key ? 'bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-xs scale-102' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {hub.icon}
                  <span className="truncate">{hub.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Curated Hub Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {(curatedHubsData[selectedSeasonHub] || curatedHubsData.awards).map(item => (
              <div key={item.id} className="p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.poster} alt={item.title} onClick={() => handleLogRecommendation(item.title, item.director, item.year, item.poster)} className="w-12 h-16 rounded-xl object-cover shadow-xs shrink-0 cursor-pointer group-hover:scale-105 transition-transform" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[var(--accent-sakura-text)] block">{item.badge}</span>
                    <p onClick={() => handleLogRecommendation(item.title, item.director, item.year, item.poster)} className="font-black text-xs text-[var(--text-primary)] truncate hover:text-pink-500 cursor-pointer">{item.title}</p>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold block">Dir. {item.director} • {item.rating}</span>
                  </div>
                </div>

                <button onClick={() => handleLogRecommendation(item.title, item.director, item.year, item.poster)} className="p-2 rounded-xl bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] font-black shadow-xs hover:scale-105 transition-transform cursor-pointer" title="Log to Diary">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return <DualPaneNotebook leftPage={leftPageContent} rightPage={rightPageContent} />;
};
