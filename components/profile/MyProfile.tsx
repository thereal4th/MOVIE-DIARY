/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Movie, Friend } from '../../types/diary';
import { Award, Users, PenTool, Film, Star, Clock, Calendar, Sparkles, Popcorn, Glasses, Clapperboard, Trophy, Share2, Globe } from 'lucide-react';

export const MyProfile: React.FC = () => {
  const { userProfile, movies, friends, setIsLogModalOpen, setEditingMovie, setPrefillMovie } = useMovieDiary();

  // Mascot cosmetic state & animations
  const [mascotSkin, setMascotSkin] = useState<'default' | '3d' | 'director' | 'golden'>('3d');
  const [isMascotBouncing, setIsMascotBouncing] = useState(false);

  // Dynamic Mascot Commentary based on user's real-time diary state
  const mascotCommentary = useMemo(() => {
    const total = movies.length;
    if (total === 0) return "Welcome to your cinephile sanctuary! Log your very first film to get started!";
    const favCount = movies.filter(m => m.favorite).length;
    if (mascotSkin === 'director') return `Directing your archive! You have ${favCount} 5★ masterpieces logged in your hall of fame!`;
    if (mascotSkin === 'golden') return `A true academy veteran! You've logged ${total} incredible film treasures!`;
    return `Cozy cinema vibes! You've recorded ${total} movies in your diary. Got tea ready for another tonight?`;
  }, [movies, mascotSkin]);

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

  // Calculate Top 3 Favorite Film Treasures from Watched Library (Highest rated or marked favorites!)
  const topThreeMovies = useMemo(() => {
    const favorites = movies.filter((m) => m.favorite);
    const sortedByRating = [...(favorites.length >= 3 ? favorites : movies)].sort((a, b) => b.userRating - a.userRating);
    return sortedByRating.slice(0, 3);
  }, [movies]);

  // Calculate Best Movie Buddy (The Friend Tagged the Most across all watched movies!)
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
    return null;
  }, [movies, friends]);

  const handleMascotInteract = () => {
    setIsMascotBouncing(true);
    setTimeout(() => setIsMascotBouncing(false), 1000);
  };

  return (
    <div className="flex flex-col h-full min-h-0 space-y-6 pb-4 max-w-5xl mx-auto w-full overflow-hidden">
      
      {/* 🔒 FIXED HEADER & IDENTITY BLOCK (Custom Banner, Overlapping Circular Avatar, Mascot, & Quick Stats Strip) */}
      <section className="shrink-0 rounded-3xl overflow-hidden border-2 border-[var(--border-color)] shadow-sm bg-[var(--surface-card)] relative">
        
        {/* 1. Custom High-Res Background Banner */}
        <div className="h-32 sm:h-44 w-full relative overflow-hidden bg-slate-950">
          <img
            src={userProfile.bannerUrl || "/images/posters/past_lives.jpg"}
            alt="Cinematic Banner"
            className="w-full h-full object-cover object-center opacity-80 filter brightness-95 transform scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[var(--surface-card)] via-transparent to-black/30"></div>
          <div className="washi-strip washi-gold right-8 top-4"></div>
        </div>

        {/* 2. Main Identity & Movie Buddy Mascot Area */}
        <div className="px-6 pb-6 pt-0 sm:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Overlapping Circular Avatar & User Info Layout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 -mt-12 sm:-mt-14 w-full lg:w-auto flex-1 min-w-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[var(--surface-card)] shadow-2xl shrink-0 bg-white relative z-20">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            </div>

            <div className="pt-2 sm:pt-14 w-full sm:w-auto space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-sans tracking-tight">
                  {userProfile.name}
                </h2>
                <span className="text-[11px] font-black px-3 py-0.5 rounded-full bg-pink-500 text-white uppercase tracking-wide flex items-center gap-1 shadow-xs">
                  <span>VIP Auteur</span>
                  <PenTool className="w-3 h-3 stroke-[2.5]" />
                </span>
              </div>
              <p className="text-xs font-extrabold text-[var(--accent-sakura-text)] font-mono">@{userProfile.handle}</p>
              <p className="text-xs text-[var(--text-muted)] italic font-serif leading-relaxed max-w-lg">
                "{userProfile.bio}"
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
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
                {userProfile.socialLinks?.website && (
                  <a href={userProfile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border-color)] flex items-center gap-1 transition-colors">
                    <Globe className="w-3 h-3 text-amber-500 stroke-[2.5]" />
                    <span>Blog</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 3. Movie Buddy Mascot Slot & Dynamic Speech Bubble */}
          <div className="w-full lg:w-96 bg-linear-to-r from-[var(--surface-subtle)] to-[var(--surface-card)] p-4 rounded-2xl border border-[var(--border-color)] shadow-inner flex items-start gap-3.5 shrink-0 relative overflow-hidden mt-2 lg:mt-6">
            <div
              onClick={handleMascotInteract}
              title="Click Popcorn to cuddle and cheer!"
              className={`w-16 h-16 rounded-2xl bg-linear-to-tr from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-slate-900 flex flex-col items-center justify-center shrink-0 shadow-md border-2 border-white cursor-pointer select-none transition-transform ${
                isMascotBouncing ? 'scale-110 rotate-12 animate-bounce' : 'hover:scale-105'
              }`}
            >
              {mascotSkin === '3d' ? (
                <Glasses className="w-8 h-8 stroke-[2.5]" />
              ) : mascotSkin === 'director' ? (
                <Clapperboard className="w-8 h-8 stroke-[2.5] text-rose-700" />
              ) : mascotSkin === 'golden' ? (
                <Trophy className="w-8 h-8 stroke-[2.5] text-amber-700" />
              ) : (
                <Popcorn className="w-8 h-8 stroke-[2] text-amber-800" />
              )}
              <span className="text-[8px] font-black uppercase tracking-tight bg-white/90 px-1.5 py-0.5 rounded-md mt-0.5 shadow-2xs">
                Buddy 🍿
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="relative bg-[var(--surface-card)] p-2.5 rounded-xl border border-[var(--border-color)] shadow-xs">
                <div className="absolute top-4 -left-1.5 w-2.5 h-2.5 bg-[var(--surface-card)] border-l border-b border-[var(--border-color)] transform -translate-y-1/2 rotate-45"></div>
                <p className="text-[11px] font-bold text-[var(--text-primary)] leading-snug relative z-10 italic">
                  "{mascotCommentary}"
                </p>
              </div>

              {/* Equippable Cosmetic Props */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[9px] font-black uppercase text-[var(--text-muted)] mr-0.5">Props:</span>
                <button
                  onClick={() => setMascotSkin('default')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-all cursor-pointer ${mascotSkin === 'default' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}
                >
                  🍿 Popcorn
                </button>
                <button
                  onClick={() => setMascotSkin('3d')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-all cursor-pointer ${mascotSkin === '3d' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}
                >
                  🕶️ 3D Specs
                </button>
                <button
                  onClick={() => setMascotSkin('director')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-all cursor-pointer ${mascotSkin === 'director' ? 'bg-rose-500 text-white shadow-2xs' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}
                >
                  🎬 Beret
                </button>
                <button
                  onClick={() => setMascotSkin('golden')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase transition-all cursor-pointer ${mascotSkin === 'golden' ? 'bg-amber-500 text-white shadow-2xs' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}
                >
                  🏆 Trophy
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Horizontal Quick Stats Strip */}
        <div className="px-6 py-3 sm:px-8 bg-[var(--surface-subtle)] border-t border-[var(--border-color)]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-color)]/60">
          <div className="text-center pt-2 sm:pt-0">
            <div className="flex items-center justify-center gap-1.5">
              <Film className="w-4 h-4 text-pink-500 stroke-[2.5]" />
              <span className="text-lg font-black text-[var(--text-primary)]">{quickStats.totalFilms}</span>
            </div>
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block mt-0.5">Total Films Watched</span>
          </div>

          <div className="text-center pt-2 sm:pt-0 sm:pl-4">
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500 stroke-[2.5]" />
              <span className="text-lg font-black text-[var(--text-primary)]">{quickStats.totalHours} hrs</span>
              <span className="text-[10px] font-extrabold text-[var(--text-muted)]">({quickStats.totalDays} days)</span>
            </div>
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block mt-0.5">Time Spent Watching</span>
          </div>

          <div className="text-center pt-2 sm:pt-0 sm:pl-4">
            <div className="flex items-center justify-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
              <span className="text-lg font-black text-[var(--text-primary)]">{quickStats.loggedThisYear}</span>
            </div>
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block mt-0.5">Logged This Year (2026)</span>
          </div>

          <div className="text-center pt-2 sm:pt-0 sm:pl-4">
            <div className="flex items-center justify-center gap-1.5">
              <Users className="w-4 h-4 text-purple-500 stroke-[2.5]" />
              <span className="text-sm font-black text-[var(--text-primary)]">{quickStats.followers} Followers</span>
              <span className="text-xs text-[var(--text-muted)]">•</span>
              <span className="text-sm font-black text-[var(--text-secondary)]">{quickStats.following} Following</span>
            </div>
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block mt-0.5">Community Network</span>
          </div>
        </div>
      </section>

      {/* 📜 SCROLLABLE OVERFLOW AREA: Only this section scrolls when content exceeds notebook height! */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Best Movie Buddy Tag Award (Person tagged the most!) */}
          <div className="md:col-span-1">
            <section className="polaroid-card card-tint-mint rounded-3xl p-6 border-2 border-[var(--border-color)] shadow-sm h-full flex flex-col justify-between relative group">
              <div className="washi-strip washi-mint left-1/2"></div>
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] shadow-xs">
                    <Users className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-wide">
                      Best Movie Buddy
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-bold">Your #1 Most Tagged Screening Partner</p>
                  </div>
                </div>

                {bestMovieBuddy ? (
                  <div className="p-5 rounded-2xl bg-white/90 dark:bg-black/50 border-2 border-[var(--border-color)] text-center space-y-3 shadow-sm transform group-hover:scale-102 transition-transform">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-green-500 shadow-md relative">
                      <img src={bestMovieBuddy.friend.avatar} alt={bestMovieBuddy.friend.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-[var(--text-primary)]">{bestMovieBuddy.friend.name}</h4>
                      <p className="text-xs font-extrabold text-[var(--accent-matcha-text)] mt-0.5 flex items-center justify-center gap-1">
                        <Film className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Tagged in {bestMovieBuddy.count} Screenings Together!</span>
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] italic font-serif mt-2">
                        "Your shared cinema taste matches effortlessly!"
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-block text-[10px] font-black uppercase px-3 py-1 rounded-full bg-linear-to-r from-green-400 to-emerald-500 text-white shadow-2xs">
                        ✦ Official Watch-Buddy
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] text-center py-8">No friends tagged yet! Tag besties in your diary notes.</p>
                )}
              </div>
            </section>
          </div>

          {/* Top 3 Favorite Film Treasures Podium */}
          <div className="md:col-span-2">
            <section className="polaroid-card card-tint-lilac rounded-3xl p-6 border-2 border-[var(--border-color)] shadow-sm relative h-full flex flex-col justify-between">
              <div className="washi-strip washi-lilac right-1/4"></div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[var(--accent-lavender)] text-[var(--accent-lavender-text)] shadow-xs">
                      <Award className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-wide">
                        Top 3 Film Treasures
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] font-bold">Your highest rated all-time cinematic masterpieces</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-2xs">
                    5.0 ★ Masterpieces
                  </span>
                </div>

                {topThreeMovies.length === 0 ? (
                  <div className="text-center py-12 text-sm text-[var(--text-muted)] font-bold">
                    Log and favorite some movies to populate your top podium!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {topThreeMovies.map((movie, index) => {
                      const medals = ['#1 Favorite', '#2 Favorite', '#3 Favorite'];
                      const badgeColors = ['bg-yellow-500 text-white', 'bg-slate-400 text-white', 'bg-amber-700 text-white'];

                      return (
                        <div
                          key={movie.id}
                          onClick={() => {
                            setEditingMovie(movie);
                            setPrefillMovie(null);
                            setIsLogModalOpen(true);
                          }}
                          className="group flex flex-col items-center bg-white/80 dark:bg-black/40 p-4 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer"
                        >
                          {/* Medal badge */}
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-2 shadow-xs flex items-center gap-1 ${badgeColors[index] || 'bg-pink-500 text-white'}`}>
                            <Award className="w-3 h-3 stroke-[2.5]" />
                            <span>{medals[index]}</span>
                          </span>

                          {/* Poster miniature */}
                          <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-xs relative mb-3">
                            <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                          </div>

                          {/* Title & Rating */}
                          <h4 className="font-black text-xs sm:text-sm text-[var(--text-primary)] text-center line-clamp-1 group-hover:text-pink-500 transition-colors">
                            {movie.title}
                          </h4>
                          <span className="text-xs font-extrabold text-amber-500 mt-1 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-500 inline" />
                            <span>{movie.userRating.toFixed(1)}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};
