/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Sparkles, Star, Bookmark, Check, Plus, Popcorn, Heart, Filter, Film, Play, Clock, Calendar, Users, Flame, Trophy, Gem, SlidersHorizontal, ArrowRight, X, Clapperboard, Monitor, CheckCircle2 } from 'lucide-react';

// Extended internal types for the 4 interactive hubs
interface SmartWatchlistItem {
  id: string;
  title: string;
  posterPath: string;
  director: string;
  releaseYear: number;
  runtimeMinutes: number;
  genre: string;
  provider: 'Netflix' | 'Mubi' | 'Criterion' | 'HBO Max' | 'Apple TV+';
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

  // Navigation state between the 4 discovery hubs
  const [activeHub, setActiveHub] = useState<'for_you' | 'watchlist' | 'taste_mixer' | 'curated'>('for_you');

  // --- HUB 1: FOR YOU (Because You Liked X) ---
  // Identify user movies rated 4.0 or higher
  const topLikedDiaryMovies = useMemo(() => {
    const highRated = movies.filter((m) => m.userRating >= 4.0);
    return highRated.length > 0 ? highRated.slice(0, 3) : movies.slice(0, 2);
  }, [movies]);

  // Sample recommendations mapped to liked movie titles
  const becauseYouLikedData: Record<string, any[]> = {
    "Amélie": [
      { id: 'rec-1', title: 'Chocolat', director: 'Lasse Hallström', year: 2000, runtime: 121, rating: '4.7 ★', poster: '/images/posters/little_women.jpg', reason: 'Whimsical French town warmth, enchanting color grading, and magical realism.', provider: 'Criterion' },
      { id: 'rec-2', title: 'The French Dispatch', director: 'Wes Anderson', year: 2021, runtime: 107, rating: '4.5 ★', poster: '/images/posters/lala_land.jpg', reason: 'Metaphysical symmetry, quaint romantic humor, and dazzling artistic production design.', provider: 'Disney+' },
      { id: 'rec-3', title: 'Midnight in Paris', director: 'Woody Allen', year: 2011, runtime: 94, rating: '4.6 ★', poster: '/images/posters/past_lives.jpg', reason: 'Nostalgic European wanderlust with nocturnal jazz aesthetics.', provider: 'Netflix' },
    ],
    "My Neighbor Totoro": [
      { id: 'rec-4', title: 'Kiki\'s Delivery Service', director: 'Hayao Miyazaki', year: 1989, runtime: 103, rating: '4.9 ★', poster: '/images/posters/totoro.jpg', reason: 'Gentle coming-of-age spirit, lush hand-painted landscapes, and comforting orchestral score.', provider: 'HBO Max' },
      { id: 'rec-5', title: 'Ponyo', director: 'Hayao Miyazaki', year: 2008, runtime: 101, rating: '4.7 ★', poster: '/images/posters/little_women.jpg', reason: 'Childlike innocence, watercolor oceanic wonder, and heartwarming friendship.', provider: 'HBO Max' },
      { id: 'rec-6', title: 'Spirited Away', director: 'Hayao Miyazaki', year: 2001, runtime: 125, rating: '5.0 ★', poster: '/images/posters/totoro.jpg', reason: 'Breathtaking world-building and folklore-inspired comforting fantasy.', provider: 'HBO Max' },
    ],
    "Little Women": [
      { id: 'rec-7', title: 'Pride & Prejudice', director: 'Joe Wright', year: 2005, runtime: 129, rating: '4.8 ★', poster: '/images/posters/little_women.jpg', reason: 'Misty morning English romanticism, stirring piano melodies, and sharp sisterhood dialogue.', provider: 'Netflix' },
      { id: 'rec-8', title: 'Lady Bird', director: 'Greta Gerwig', year: 2017, runtime: 94, rating: '4.6 ★', poster: '/images/posters/past_lives.jpg', reason: 'Greta Gerwig\'s authentic directorial warmth and tender familial bonds.', provider: 'Apple TV+' },
      { id: 'rec-9', title: 'Emma.', director: 'Autumn de Wilde', year: 2020, runtime: 124, rating: '4.5 ★', poster: '/images/posters/lala_land.jpg', reason: 'Pastel confectionary aesthetics, witty romance, and joyful period costume elegance.', provider: 'Criterion' },
    ]
  };

  const defaultCarousel = [
    { id: 'def-1', title: 'Past Lives', director: 'Celine Song', year: 2023, runtime: 106, rating: '4.9 ★', poster: '/images/posters/past_lives.jpg', reason: 'Poetic meditations on destiny, tender glances, and breathtaking modern romance.', provider: 'Mubi' },
    { id: 'def-2', title: 'La La Land', director: 'Damien Chazelle', year: 2016, runtime: 128, rating: '4.8 ★', poster: '/images/posters/lala_land.jpg', reason: 'Vibrant musical cinema magic, Technicolor passion, and bittersweet dreams.', provider: 'Apple TV+' },
    { id: 'def-3', title: 'Little Women', director: 'Greta Gerwig', year: 2019, runtime: 135, rating: '4.9 ★', poster: '/images/posters/little_women.jpg', reason: 'Cozy fireplace storytelling and everlasting sisterly affection.', provider: 'Netflix' },
  ];


  // --- HUB 2: SMART WATCHLIST STATE & FILTERS ---
  const [watchlistItems, setWatchlistItems] = useState<SmartWatchlistItem[]>([
    { id: 'w-1', title: 'Before Sunrise', posterPath: '/images/posters/past_lives.jpg', director: 'Richard Linklater', releaseYear: 1995, runtimeMinutes: 101, genre: 'Romance', provider: 'Criterion', matchScore: 98, decade: '1990s', savedToWatchlist: true },
    { id: 'w-2', title: 'Portrait of a Lady on Fire', posterPath: '/images/posters/little_women.jpg', director: 'Céline Sciamma', releaseYear: 2019, runtimeMinutes: 122, genre: 'Romance', provider: 'Hulu' as any, matchScore: 97, decade: '2010s', savedToWatchlist: true },
    { id: 'w-3', title: 'In the Mood for Love', posterPath: '/images/posters/lala_land.jpg', director: 'Wong Kar-wai', releaseYear: 2000, runtimeMinutes: 98, genre: 'Drama', provider: 'Mubi', matchScore: 99, decade: '2000s', savedToWatchlist: true },
    { id: 'w-4', title: 'Frances Ha', posterPath: '/images/posters/past_lives.jpg', director: 'Noah Baumbach', releaseYear: 2012, runtimeMinutes: 86, genre: 'Indie', provider: 'Criterion', matchScore: 93, decade: '2010s', savedToWatchlist: true },
    { id: 'w-5', title: 'Aftersun', posterPath: '/images/posters/totoro.jpg', director: 'Charlotte Wells', releaseYear: 2022, runtimeMinutes: 102, genre: 'Drama', provider: 'Mubi', matchScore: 96, decade: '2020s', savedToWatchlist: true },
    { id: 'w-6', title: 'Petite Maman', posterPath: '/images/posters/little_women.jpg', director: 'Céline Sciamma', releaseYear: 2021, runtimeMinutes: 72, genre: 'Fantasy', provider: 'Mubi', matchScore: 95, decade: '2020s', savedToWatchlist: true },
    { id: 'w-7', title: 'Whisper of the Heart', posterPath: '/images/posters/totoro.jpg', director: 'Yoshifusa Kondo', releaseYear: 1995, runtimeMinutes: 111, genre: 'Animation', provider: 'HBO Max', matchScore: 94, decade: '1990s', savedToWatchlist: true },
  ]);

  const [providerFilter, setProviderFilter] = useState<string>('All');
  const [runtimeFilter, setRuntimeFilter] = useState<string>('All');
  const [genreFilter, setGenreFilter] = useState<string>('All');
  const [decadeFilter, setDecadeFilter] = useState<string>('All');

  const filteredWatchlist = useMemo(() => {
    return watchlistItems.filter((item) => {
      if (!item.savedToWatchlist) return false;
      if (providerFilter !== 'All' && item.provider !== providerFilter) return false;
      if (genreFilter !== 'All' && item.genre !== genreFilter) return false;
      if (decadeFilter !== 'All' && item.decade !== decadeFilter) return false;
      if (runtimeFilter === '< 90 mins' && item.runtimeMinutes >= 90) return false;
      if (runtimeFilter === '90-120 mins' && (item.runtimeMinutes < 90 || item.runtimeMinutes > 120)) return false;
      if (runtimeFilter === '120+ mins' && item.runtimeMinutes < 120) return false;
      return true;
    });
  }, [watchlistItems, providerFilter, runtimeFilter, genreFilter, decadeFilter]);


  // --- HUB 3: TASTE MIXER ("Find a Movie for Two") STATE ---
  const [selectedMixerFriendId, setSelectedMixerFriendId] = useState<string>(friends[0]?.id || 'f-1');
  const selectedMixerFriend = useMemo(() => friends.find(f => f.id === selectedMixerFriendId) || friends[0], [friends, selectedMixerFriendId]);

  const tasteMixerResults: Record<string, { compatibility: number; sharedVibes: string[]; matches: TasteMixerMatch[] }> = {
    'f-1': { // Sarah (@sarah_filmtea)
      compatibility: 97,
      sharedVibes: ['Poetic Cinematography', 'Bittersweet Romance', 'French Cinema'],
      matches: [
        { title: 'Portrait of a Lady on Fire', year: 2019, director: 'Céline Sciamma', runtime: 122, streamingOn: 'Criterion', overlapPercentage: 99, posterPath: '/images/posters/past_lives.jpg', reason: 'You both gave 5.0★ to contemplative emotional romantic dramas this season. Both of you bookmarked this film in June!' },
        { title: 'Before Sunset', year: 2004, director: 'Richard Linklater', runtime: 80, streamingOn: 'HBO Max', overlapPercentage: 96, posterPath: '/images/posters/lala_land.jpg', reason: 'Sarah rated Before Sunrise 5.0★ and your diary notes repeatedly celebrate dialogue-driven romantic real-time wanderings.' },
      ]
    },
    'f-2': { // Alex (@alex_reviews)
      compatibility: 91,
      sharedVibes: ['Aesthetic Marvels', 'Sci-Fi Worldbuilding', 'Bold Direction'],
      matches: [
        { title: 'Dune: Part Two', year: 2024, director: 'Denis Villeneuve', runtime: 166, streamingOn: 'HBO Max', overlapPercentage: 95, posterPath: '/images/posters/totoro.jpg', reason: 'You and @alex_reviews share a deep appreciation for IMAX cinematic scope and epic monumental sound design.' },
        { title: 'Blade Runner 2049', year: 2017, director: 'Denis Villeneuve', runtime: 163, streamingOn: 'Netflix', overlapPercentage: 92, posterPath: '/images/posters/lala_land.jpg', reason: 'Alex listed this in their Top 3 Film Treasures and your visual taste scores align with neon cyberpunk noir.' }
      ]
    },
    'f-3': { // Maya (@maya_cineaste)
      compatibility: 94,
      sharedVibes: ['Cozy Comfort Watches', 'Ghibli Magic', 'Indie Whimsical'],
      matches: [
        { title: 'Whisper of the Heart', year: 1995, director: 'Yoshifusa Kondo', runtime: 111, streamingOn: 'HBO Max', overlapPercentage: 98, posterPath: '/images/posters/totoro.jpg', reason: 'You gave Totoro 4.5★ and Maya leads your friend circle in hand-drawn comforting Japanese animation hours.' },
        { title: 'Fantastic Mr. Fox', year: 2009, director: 'Wes Anderson', runtime: 87, streamingOn: 'Disney+', overlapPercentage: 93, posterPath: '/images/posters/little_women.jpg', reason: 'Stop-motion autumn warmth that hits both of your comfort comfort screening formulas.' }
      ]
    }
  };

  const activeMixerData = tasteMixerResults[selectedMixerFriendId] || tasteMixerResults['f-1'];


  // --- HUB 4: TRENDING & CURATED HUBS ---
  const [selectedSeasonHub, setSelectedSeasonHub] = useState<'awards' | 'summer' | 'gems'>('awards');

  const curatedHubsData = {
    awards: [
      { id: 'cur-1', title: 'Anatomy of a Fall', director: 'Justine Triet', year: 2023, rating: '4.8 ★', poster: '/images/posters/past_lives.jpg', badge: 'Palme d\'Or Winner', communityLogs: 420 },
      { id: 'cur-2', title: 'The Zone of Interest', director: 'Jonathan Glazer', year: 2023, rating: '4.7 ★', poster: '/images/posters/totoro.jpg', badge: 'Best Sound Design', communityLogs: 310 },
      { id: 'cur-3', title: 'Poor Things', director: 'Yorgos Lanthimos', year: 2023, rating: '4.6 ★', poster: '/images/posters/lala_land.jpg', badge: 'Visual Wonder', communityLogs: 540 },
    ],
    summer: [
      { id: 'cur-4', title: 'Challengers', director: 'Luca Guadagnino', year: 2024, rating: '4.7 ★', poster: '/images/posters/little_women.jpg', badge: 'Adrenaline Score', communityLogs: 610 },
      { id: 'cur-5', title: 'Hit Man', director: 'Richard Linklater', year: 2024, rating: '4.6 ★', poster: '/images/posters/past_lives.jpg', badge: 'Witty Crowd-Pleaser', communityLogs: 390 },
      { id: 'cur-6', title: 'Top Gun: Maverick', director: 'Joseph Kosinski', year: 2022, rating: '4.9 ★', poster: '/images/posters/lala_land.jpg', badge: 'Pure Spectacle', communityLogs: 880 },
    ],
    gems: [
      { id: 'cur-7', title: 'Rye Lane', director: 'Raine Allen-Miller', year: 2023, rating: '4.9 ★', poster: '/images/posters/little_women.jpg', badge: 'Hidden Masterpiece', communityLogs: 84 },
      { id: 'cur-8', title: 'Hundreds of Beavers', director: 'Mike Cheslik', year: 2023, rating: '4.8 ★', poster: '/images/posters/totoro.jpg', badge: 'Slapstick Genius', communityLogs: 62 },
      { id: 'cur-9', title: 'Robot Dreams', director: 'Pablo Berger', year: 2023, rating: '5.0 ★', poster: '/images/posters/past_lives.jpg', badge: 'Tearjerker Treasure', communityLogs: 115 },
    ]
  };

  const handleLogRecommendation = (title: string, director?: string, year?: number, poster?: string) => {
    setPrefillMovie({ title, director: director || 'Unknown', releaseYear: year || 2024, posterPath: poster || '/images/posters/totoro.jpg', userRating: 4.5 });
    setIsLogModalOpen(true);
  };

  const toggleWatchlistRemoval = (id: string) => {
    setWatchlistItems(prev => prev.map(m => m.id === id ? { ...m, savedToWatchlist: !m.savedToWatchlist } : m));
  };

  return (
    <div className="flex flex-col h-full min-h-0 space-y-6 overflow-hidden pb-2">
      
      {/* 🔒 FIXED HEADER BANNER & 4-HUB SWITCHER (Never scrolls!) */}
      <section className="shrink-0 bg-[var(--surface-card)] p-5 sm:p-7 rounded-3xl border-2 border-[var(--border-color)] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
              <Sparkles className="w-7 h-7 text-[var(--accent-matcha-text)] stroke-[2.5]" />
              <span>Discover & Curated Watchlist Hub</span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-2xs uppercase tracking-wide">
                AI Taste Algorithms
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1 max-w-2xl">
              Explore custom recommendations inspired by your 4+★ diary logs, filter your smart watchlist by provider or runtime, or blend tastes with friends in the Taste Mixer!
            </p>
          </div>

          {/* Quick Stats Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-right">
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase block tracking-wider">Active Watchlist</span>
              <span className="text-lg font-black text-pink-500 flex items-center gap-1 justify-end">
                <Bookmark className="w-4 h-4 fill-current inline" />
                <span>{watchlistItems.filter(w => w.savedToWatchlist).length} titles</span>
              </span>
            </div>
          </div>
        </div>

        {/* 🌟 4-TAB DISCOVERY SWITCHER BAR (High contrast colors in night mode!) */}
        <div className="flex items-center p-1.5 bg-[var(--surface-subtle)] rounded-2xl border-2 border-[var(--border-color)] shadow-inner overflow-x-auto gap-1.5">
          
          <button
            onClick={() => setActiveHub('for_you')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeHub === 'for_you'
                ? 'bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] shadow-md scale-102 ring-2 ring-white/60'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 stroke-[2.5]" />
            <span>Personalized ("Because You Liked...")</span>
          </button>

          <button
            onClick={() => setActiveHub('watchlist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeHub === 'watchlist'
                ? 'bg-pink-500 text-white shadow-md scale-102'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current stroke-[2.5]" />
            <span>Smart Watchlist Filters ({watchlistItems.filter(w => w.savedToWatchlist).length})</span>
          </button>

          <button
            onClick={() => setActiveHub('taste_mixer')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeHub === 'taste_mixer'
                ? 'bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] shadow-md scale-102 ring-2 ring-white/60'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
            <span>Taste Mixer (Movie for Two)</span>
          </button>

          <button
            onClick={() => setActiveHub('curated')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeHub === 'curated'
                ? 'bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-md scale-102 ring-2 ring-white/60'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 stroke-[2.5]" />
            <span>Trending & Curated Hubs</span>
          </button>
        </div>
      </section>


      {/* 📜 SCROLLABLE DISCOVERY CONTENT AREA: Only the active tab content scrolls! */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-8 space-y-10">
        
        {/* ========================================================================= */}
        {/* 🌟 HUB 1: PERSONALIZED RECOMMENDATIONS ("Because You Liked [Movie Title]") */}
        {/* ========================================================================= */}
        {activeHub === 'for_you' && (
          <div className="space-y-10 pt-1">
            {topLikedDiaryMovies.length === 0 && (
              <div className="text-center py-12 bg-[var(--surface-card)] rounded-3xl border border-[var(--border-color)] p-6">
                <Popcorn className="w-12 h-12 mx-auto text-[var(--accent-sakura-text)] mb-3 stroke-[2]" />
                <h3 className="text-lg font-black text-[var(--text-primary)]">No 4+ ★ ratings logged yet!</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Here is a default high-rated circle curation while you build your personal journal:</p>
              </div>
            )}

            {topLikedDiaryMovies.map((likedMovie, idx) => {
              const recList = becauseYouLikedData[likedMovie.title] || defaultCarousel;
              const badgeColors = ['bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)]', 'bg-[var(--accent-honey)] text-[var(--accent-honey-text)]', 'bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)]'];

              return (
                <div key={likedMovie.id} className="space-y-4 bg-[var(--surface-card)]/60 p-6 rounded-3xl border-2 border-[var(--border-color)]/80 shadow-xs relative">
                  
                  {/* Section Title Banner: Because You Liked... */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)]/60">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs ${badgeColors[idx % badgeColors.length]}`}>
                        Because You Liked
                      </span>
                      <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                        {likedMovie.title} ({likedMovie.userRating.toFixed(1)} ★)
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold text-[var(--text-muted)] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Based on cinematic tone, themes & taste score</span>
                    </span>
                  </div>

                  {/* Horizontal Carousel Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {recList.map((rec) => (
                      <article key={rec.id} className="polaroid-card rounded-2xl p-4 flex flex-col justify-between space-y-4 bg-white/90 dark:bg-[#1C1A1E] border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all">
                        <div>
                          <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-[var(--border-color)] shadow-sm">
                            <img src={rec.poster} alt={rec.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20">
                              {rec.provider}
                            </span>
                            <span className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                              {rec.rating}
                            </span>
                          </div>

                          <div className="mt-3">
                            <h4 className="font-black text-base text-[var(--text-primary)] line-clamp-1">{rec.title}</h4>
                            <p className="text-[11px] text-[var(--text-muted)] font-extrabold">
                              Dir. {rec.director} • {rec.year} • {rec.runtime} mins
                            </p>
                            <p className="mt-2.5 p-3 rounded-xl bg-[var(--surface-subtle)] text-xs text-[var(--text-secondary)] font-serif italic leading-relaxed border border-[var(--border-color)]/60 shadow-inner">
                              "{rec.reason}"
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 border-t border-[var(--border-color)]/60 flex items-center gap-2">
                          <button
                            onClick={() => handleLogRecommendation(rec.title, rec.director, rec.year, rec.poster)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-white dark:bg-[#28252C] dark:text-[#F7ECD9] dark:border dark:border-[#D1BEA5] text-xs font-black uppercase tracking-wider hover:opacity-90 transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                            <span>I've Watched This!</span>
                          </button>
                          <button
                            onClick={() => {
                              const exists = watchlistItems.some(w => w.title === rec.title);
                              if (!exists) {
                                setWatchlistItems(prev => [...prev, {
                                  id: `w-${Date.now()}`,
                                  title: rec.title,
                                  posterPath: rec.poster,
                                  director: rec.director,
                                  releaseYear: rec.year,
                                  runtimeMinutes: rec.runtime,
                                  genre: 'Drama',
                                  provider: rec.provider as any,
                                  matchScore: 96,
                                  decade: '2020s',
                                  savedToWatchlist: true
                                }]);
                              }
                            }}
                            title="Add to Watchlist"
                            className="p-2.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)] cursor-pointer"
                          >
                            <Bookmark className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {/* ========================================================================= */}
        {/* 🌟 HUB 2: SMART WATCHLIST FILTERS (Provider, Runtime < 90m, Genre, Decade) */}
        {/* ========================================================================= */}
        {activeHub === 'watchlist' && (
          <div className="space-y-6 pt-1">
            
            {/* Smart Filter Toolbar Box */}
            <div className="bg-[var(--surface-card)] p-6 rounded-3xl border-2 border-[var(--border-color)] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]/60">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Filter className="w-4 h-4 stroke-[2.5] text-pink-500" />
                  <span>Smart Watchlist Refine & Filter</span>
                </h3>
                <button
                  onClick={() => { setProviderFilter('All'); setRuntimeFilter('All'); setGenreFilter('All'); setDecadeFilter('All'); }}
                  className="text-xs font-extrabold text-[var(--accent-sakura-text)] hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>

              {/* Filter Row 1: Streaming Providers */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-24 text-xs font-black text-[var(--text-muted)] flex items-center gap-1 uppercase">
                  <Monitor className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Provider:</span>
                </span>
                {['All', 'Netflix', 'Mubi', 'Criterion', 'HBO Max', 'Apple TV+'].map(prov => (
                  <button
                    key={prov}
                    onClick={() => setProviderFilter(prov)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      providerFilter === prov ? 'bg-pink-500 text-white shadow-sm scale-105' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>

              {/* Filter Row 2: Runtimes (< 90 mins Highlight!) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-24 text-xs font-black text-[var(--text-muted)] flex items-center gap-1 uppercase">
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Runtime:</span>
                </span>
                {['All', '< 90 mins', '90-120 mins', '120+ mins'].map(rt => (
                  <button
                    key={rt}
                    onClick={() => setRuntimeFilter(rt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      runtimeFilter === rt ? 'bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] border border-[var(--accent-matcha-text)]/30 shadow-sm scale-105' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {rt === '< 90 mins' ? '⚡ < 90 mins (Short & Sweet)' : rt}
                  </button>
                ))}
              </div>

              {/* Filter Row 3: Genres & Decades */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--border-color)]/40">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-24 text-xs font-black text-[var(--text-muted)] uppercase">Genre:</span>
                  {['All', 'Romance', 'Drama', 'Animation', 'Indie', 'Fantasy'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGenreFilter(g)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        genreFilter === g ? 'bg-[var(--accent-honey)] text-[var(--accent-honey-text)] font-black' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[var(--text-muted)] uppercase">Decade:</span>
                  <select
                    value={decadeFilter}
                    onChange={(e) => setDecadeFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-xs font-extrabold text-[var(--text-primary)] cursor-pointer"
                  >
                    <option value="All">All Decades</option>
                    <option value="2020s">2020s (New)</option>
                    <option value="2010s">2010s</option>
                    <option value="2000s">2000s</option>
                    <option value="1990s">1990s</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filtered Watchlist Grid */}
            {filteredWatchlist.length === 0 ? (
              <div className="text-center py-16 bg-[var(--surface-card)] rounded-3xl border border-[var(--border-color)] p-8">
                <Bookmark className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3 opacity-50" />
                <h3 className="text-lg font-black text-[var(--text-primary)]">No saved titles match these exact smart filters</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Try relaxing your runtime or provider filters above!</p>
                <button
                  onClick={() => { setProviderFilter('All'); setRuntimeFilter('All'); setGenreFilter('All'); setDecadeFilter('All'); }}
                  className="mt-5 px-5 py-2.5 rounded-xl font-bold text-xs bg-pink-500 text-white shadow-md hover:opacity-90 cursor-pointer"
                >
                  Show Full Watchlist
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredWatchlist.map((item) => (
                  <article key={item.id} className="polaroid-card p-5 rounded-3xl bg-white/90 dark:bg-[#1A181C] border-2 border-[var(--border-color)] shadow-sm flex flex-col justify-between space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-28 aspect-[2/3] rounded-2xl overflow-hidden border border-[var(--border-color)] shrink-0 relative shadow-md">
                        <img src={item.posterPath} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-[var(--accent-honey)] text-[var(--accent-honey-text)] text-[10px] font-black uppercase tracking-wide">
                            {item.provider}
                          </span>
                          <span className="text-xs font-black text-amber-500">{item.matchScore}% Match</span>
                        </div>
                        <h4 className="font-black text-lg text-[var(--text-primary)] leading-tight pt-1">{item.title}</h4>
                        <p className="text-xs font-bold text-[var(--text-muted)]">
                          Dir. {item.director} • {item.releaseYear}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          <span className="px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-[var(--text-secondary)] text-[11px] font-bold border border-[var(--border-color)] flex items-center gap-1">
                            <Clock className="w-3 h-3 stroke-[2.5]" />
                            <span>{item.runtimeMinutes} mins</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-[var(--text-secondary)] text-[11px] font-bold border border-[var(--border-color)]">
                            {item.genre}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-color)]/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLogRecommendation(item.title, item.director, item.releaseYear, item.posterPath)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-linear-to-r from-[var(--accent-sakura)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-xs uppercase tracking-wider shadow-sm hover:opacity-90 flex items-center justify-center gap-1.5 border border-white/40 cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Log Watch</span>
                      </button>
                      <button
                        onClick={() => toggleWatchlistRemoval(item.id)}
                        title="Remove from Watchlist"
                        className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-extrabold text-xs border border-rose-500/30 cursor-pointer"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}


        {/* ========================================================================= */}
        {/* 🌟 HUB 3: TASTE MIXER ("Find a Movie for Two") INTERACTIVE BLENDER */}
        {/* ========================================================================= */}
        {activeHub === 'taste_mixer' && (
          <div className="space-y-8 pt-1">
            
            {/* Friend Selection Header Box */}
            <div className="bg-linear-to-r from-[var(--accent-matcha)]/30 via-[var(--surface-card)] to-[var(--accent-sakura)]/30 p-7 rounded-3xl border-3 border-[var(--border-color)] shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]/70">
                <div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
                    <SlidersHorizontal className="w-7 h-7 text-[var(--accent-sakura-text)] stroke-[2.5]" />
                    <span>Taste Mixer: Find a Movie for Two</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-extrabold mt-1">
                    Select a bestie below to analyze both of your diaries and generate high-probability overlapping screening matches!
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-[var(--surface-card)] px-4 py-2.5 rounded-2xl border-2 border-[var(--border-color)] shadow-inner">
                  <span className="text-xs font-black uppercase text-[var(--text-muted)]">Compatibility:</span>
                  <span className="text-2xl font-black text-[var(--accent-sakura-text)] flex items-center gap-1">
                    <span>{activeMixerData.compatibility}%</span>
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                  </span>
                </div>
              </div>

              {/* Friend Selector Pills */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] block mb-3">
                  Select Screening Partner from your Circle:
                </span>
                <div className="flex flex-wrap gap-3">
                  {friends.map((friend) => {
                    const isSelected = selectedMixerFriendId === friend.id;
                    return (
                      <button
                        key={friend.id}
                        onClick={() => setSelectedMixerFriendId(friend.id)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-[#F7ECD9] dark:text-[#1A181C] border-[var(--accent-sakura-text)] shadow-lg scale-105'
                            : 'bg-[var(--surface-card)] text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--surface-hover)]'
                        }`}
                      >
                        <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full object-cover border border-white" />
                        <div className="text-left">
                          <p className="font-black text-sm leading-none">{friend.name}</p>
                          <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-[var(--accent-sakura)] dark:text-slate-700' : 'text-[var(--text-muted)]'}`}>{friend.handle}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 ml-1 stroke-[3] text-emerald-400 dark:text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shared Vibes Banner */}
              <div className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase text-[var(--text-primary)]">✨ Shared Taste Formula:</span>
                  {activeMixerData.sharedVibes.map(vibe => (
                    <span key={vibe} className="px-3 py-1 rounded-full text-xs font-black bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-2xs">
                      {vibe}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-extrabold text-[var(--text-muted)] italic">
                  "Guaranteed zero scrolling debates!"
                </span>
              </div>
            </div>

            {/* Overlapping Matches Display Grid */}
            <div className="space-y-4">
              <h4 className="text-base font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-matcha-text)] stroke-[2.5]" />
                <span>Suggested Double Feature Pairings with {selectedMixerFriend?.name}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeMixerData.matches.map((match, index) => (
                  <article key={index} className="polaroid-card card-tint-gold p-6 rounded-3xl border-2 border-[var(--border-color)] shadow-md flex flex-col justify-between relative group">
                    <div className="washi-strip washi-gold left-1/3"></div>

                    <div className="flex flex-col sm:flex-row gap-5 items-start mt-2">
                      <div className="w-full sm:w-40 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-lg shrink-0 relative">
                        <img src={match.posterPath} alt={match.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-[11px] shadow-md uppercase tracking-wider">
                          {match.overlapPercentage}% Overlap
                        </span>
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-sakura-text)] bg-[var(--accent-sakura)] px-2.5 py-0.5 rounded-md">
                            Streaming on {match.streamingOn}
                          </span>
                          <h3 className="text-2xl font-black text-[var(--text-primary)] mt-1.5">{match.title}</h3>
                          <p className="text-xs text-[var(--text-muted)] font-extrabold mt-0.5">
                            Dir. {match.director} • {match.year} • {match.runtime} mins
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] shadow-inner">
                          <span className="text-[10px] font-black text-[var(--accent-honey-text)] uppercase block mb-1">
                            🤖 Why You Will Both Adore This:
                          </span>
                          <p className="text-xs text-[var(--text-primary)] font-serif italic leading-relaxed">
                            "{match.reason}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[var(--border-color)]/70 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleLogRecommendation(match.title, match.director, match.year, match.posterPath)}
                        className="w-full py-3 px-5 rounded-2xl bg-slate-900 text-white dark:bg-[#1A181C] dark:text-[#F7ECD9] dark:border dark:border-[#D1BEA5] font-black text-xs uppercase tracking-wider hover:opacity-90 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
                      >
                        <Users className="w-4 h-4 stroke-[2.5]" />
                        <span>Log Watch Together with {selectedMixerFriend?.handle}</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* 🌟 HUB 4: TRENDING & CURATED HUBS (Top Friends, Seasons, Hidden Gems) */}
        {/* ========================================================================= */}
        {activeHub === 'curated' && (
          <div className="space-y-10 pt-1">
            
            {/* SUB-HUB 1: Top Among Friends Carousel Box */}
            <section className="bg-[var(--surface-card)] p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-color)] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]/60">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
                    <Users className="w-6 h-6 text-pink-500 stroke-[2.5]" />
                    <span>Top Among Friends Circle This Week</span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-wide mt-0.5">
                    Most frequently logged and debated films among your close followers
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-wide animate-pulse shadow-sm">
                  🔥 Highly Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                {[
                  { title: 'Challengers', director: 'Luca Guadagnino', year: 2024, rating: '4.8 ★', poster: '/images/posters/little_women.jpg', watchers: ['@sarah_filmtea', '@alex_reviews', '@maya'] },
                  { title: 'Anatomy of a Fall', director: 'Justine Triet', year: 2023, rating: '4.9 ★', poster: '/images/posters/past_lives.jpg', watchers: ['@cozy_cineast', '@sarah_filmtea'] },
                  { title: 'Past Lives', director: 'Celine Song', year: 2023, rating: '5.0 ★', poster: '/images/posters/lala_land.jpg', watchers: ['@maya_cineaste', '@alex_reviews', '@sam_v'] }
                ].map((item, i) => (
                  <article key={i} className="p-4 rounded-2xl bg-[var(--surface-subtle)] border-2 border-[var(--border-color)] flex flex-col justify-between space-y-4 hover:border-[var(--accent-sakura-text)] transition-colors">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-md">
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/20 text-center">
                        <p className="text-[10px] font-black uppercase text-amber-300">👥 Watched By:</p>
                        <p className="text-[11px] font-mono font-bold line-clamp-1">{item.watchers.join(' • ')}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-base text-[var(--text-primary)]">{item.title}</h4>
                        <span className="text-amber-500 font-black text-xs">{item.rating}</span>
                      </div>
                      <p className="text-[11px] font-bold text-[var(--text-muted)]">Dir. {item.director} ({item.year})</p>
                    </div>
                    <button
                      onClick={() => handleLogRecommendation(item.title, item.director, item.year, item.poster)}
                      className="w-full py-2.5 rounded-xl bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] font-black text-xs border border-[var(--border-color)] shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Log Your Review</span>
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* SUB-HUB 2: Seasonal Collections & Community Hidden Gems */}
            <section className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 bg-[var(--surface-card)] p-4 rounded-2xl border border-[var(--border-color)] shadow-xs">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500 stroke-[2.5]" />
                  <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-wider">
                    Curated Seasonal Collections & Gems
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSeasonHub('awards')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedSeasonHub === 'awards' ? 'bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-sm' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                    }`}
                  >
                    🏆 Award Season
                  </button>
                  <button
                    onClick={() => setSelectedSeasonHub('summer')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedSeasonHub === 'summer' ? 'bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] shadow-sm' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                    }`}
                  >
                    ☀️ Summer Blockbusters
                  </button>
                  <button
                    onClick={() => setSelectedSeasonHub('gems')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedSeasonHub === 'gems' ? 'bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] shadow-sm' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                    }`}
                  >
                    💎 Community Hidden Gems
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {curatedHubsData[selectedSeasonHub].map((item) => (
                  <article key={item.id} className="polaroid-card p-5 rounded-3xl bg-[var(--surface-card)] border-2 border-[var(--border-color)] shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-md mb-3">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900 text-amber-300 dark:bg-black font-black text-xs shadow-md border border-white/20">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="font-black text-lg text-[var(--text-primary)]">{item.title}</h4>
                      <p className="text-xs font-extrabold text-[var(--text-muted)]">Dir. {item.director} ({item.year})</p>
                      <div className="flex items-center justify-between mt-3 p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)]/60">
                        <span className="text-xs font-black text-amber-500">{item.rating}</span>
                        <span className="text-[11px] font-bold text-[var(--text-muted)] flex items-center gap-1">
                          <Gem className="w-3 h-3 text-cyan-400 stroke-[2.5]" />
                          <span>{item.communityLogs} community logs</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLogRecommendation(item.title, item.director, item.year, item.poster)}
                      className="w-full py-3 rounded-2xl bg-linear-to-r from-[var(--accent-sakura)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-xs uppercase tracking-wider shadow-sm hover:opacity-90 transition-transform active:scale-95 cursor-pointer border border-white/40"
                    >
                      Log to Personal Diary
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
};
