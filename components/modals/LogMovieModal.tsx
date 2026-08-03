/* eslint-disable @next/next/no-img-element */
 
/* eslint-disable react-hooks/set-state-in-effect */
 
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { MoodTag, WatchFormat, Movie } from '../../types/diary';
import { StarRating } from '../rating/StarRating';

export const LogMovieModal: React.FC = () => {
  const { isLogModalOpen, setIsLogModalOpen, addMovie, updateMovie, deleteMovie, editingMovie, prefillMovie, friends } = useMovieDiary();

  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [releaseYear, setReleaseYear] = useState(2024);
  const [runtimeMinutes, setRuntimeMinutes] = useState(120);
  const [genres, setGenres] = useState<string[]>(['Drama']);
  const [userRating, setUserRating] = useState(5.0);
  const [reviewNotes, setReviewNotes] = useState('');
  const [dateWatched, setDateWatched] = useState(new Date().toISOString().split('T')[0]);
  const [watchFormat, setWatchFormat] = useState<WatchFormat>('Cozy Couch 🛋️');
  const [moodTags, setMoodTags] = useState<MoodTag[]>(['☁️ Comfort Watch']);
  const [taggedFriendIds, setTaggedFriendIds] = useState<string[]>([]);
  const [posterPath, setPosterPath] = useState('/images/posters/totoro.jpg');
  const [favorite, setFavorite] = useState(false);

  const availableGenres = ['Animation', 'Romance', 'Drama', 'Sci-Fi', 'Fantasy', 'Indie', 'Family', 'Comedy', 'Thriller', 'Horror'];
  const availableMoods: MoodTag[] = [
    '🥺 Tearjerker',
    '☁️ Comfort Watch',
    '✨ Mind-Blowing',
    '🌸 Feel-Good',
    '🍿 Edge of Seat',
    '🎨 Aesthetic Gem',
    '🌙 Late Night Vibe'
  ];
  const availableFormats: WatchFormat[] = [
    'Cozy Couch 🛋️',
    'Cinema 🎟️',
    'IMAX 📽️',
    'Streaming 💻',
    'Outdoor Screen 🌌',
    'Projector 🎞️'
  ];
  const posterChoices = [
    { label: 'Totoro & Forest Spirit', path: '/images/posters/totoro.jpg' },
    { label: 'Past Lives Twilight', path: '/images/posters/past_lives.jpg' },
    { label: 'Little Women Autumn', path: '/images/posters/little_women.jpg' },
    { label: 'Dune Amber Desert', path: '/images/posters/dune.jpg' },
    { label: 'Amélie Paris Cafe', path: '/images/posters/amelie.jpg' },
    { label: 'La La Land Dancers', path: '/images/posters/lala_land.jpg' },
  ];

  useEffect(() => {
    if (editingMovie) {
      setTitle(editingMovie.title);
      setDirector(editingMovie.director);
      setReleaseYear(editingMovie.releaseYear);
      setRuntimeMinutes(editingMovie.runtimeMinutes);
      setGenres(editingMovie.genres);
      setUserRating(editingMovie.userRating);
      setReviewNotes(editingMovie.reviewNotes);
      setDateWatched(editingMovie.dateWatched);
      if (editingMovie.watchFormat) setWatchFormat(editingMovie.watchFormat);
      setMoodTags(editingMovie.moodTags || []);
      setTaggedFriendIds(editingMovie.taggedFriendIds || []);
      setPosterPath(editingMovie.posterPath);
      setFavorite(editingMovie.favorite || false);
    } else if (prefillMovie) {
      setTitle(prefillMovie.title || '');
      setDirector(prefillMovie.director || 'Curated Auteur');
      setReleaseYear(prefillMovie.releaseYear || 2024);
      setRuntimeMinutes(prefillMovie.runtimeMinutes || 115);
      setGenres(prefillMovie.genres || ['Indie', 'Romance']);
      setUserRating(prefillMovie.userRating || 5.0);
      setReviewNotes(prefillMovie.reviewNotes || 'An enchanting cinematic discovery! ✿');
      setDateWatched(prefillMovie.dateWatched || new Date().toISOString().split('T')[0]);
      setWatchFormat('Cozy Couch 🛋️');
      setMoodTags(prefillMovie.moodTags || ['☁️ Comfort Watch', '🎨 Aesthetic Gem']);
      setTaggedFriendIds([]);
      setPosterPath(prefillMovie.posterPath || '/images/posters/amelie.jpg');
      setFavorite(false);
    } else {
      // Defaults for brand new entry
      setTitle('');
      setDirector('');
      setReleaseYear(2024);
      setRuntimeMinutes(115);
      setGenres(['Drama', 'Romance']);
      setUserRating(5.0);
      setReviewNotes('');
      setDateWatched(new Date().toISOString().split('T')[0]);
      setWatchFormat('Cozy Couch 🛋️');
      setMoodTags(['☁️ Comfort Watch', '🌸 Feel-Good']);
      setTaggedFriendIds([]);
      setPosterPath('/images/posters/totoro.jpg');
      setFavorite(false);
    }
  }, [editingMovie, prefillMovie, isLogModalOpen]);

  if (!isLogModalOpen) return null;

  const toggleGenre = (genre: string) => {
    setGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
  };

  const toggleMood = (mood: MoodTag) => {
    setMoodTags((prev) => prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]);
  };

  const toggleFriend = (friendId: string) => {
    setTaggedFriendIds((prev) => prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a movie title for your diary! ✿');

    const movieData: Omit<Movie, 'id'> = {
      title: title.trim(),
      director: director.trim() || 'Film Auteur',
      releaseYear: Number(releaseYear) || 2024,
      runtimeMinutes: Number(runtimeMinutes) || 120,
      genres: genres.length > 0 ? genres : ['Cinema'],
      posterPath,
      userRating,
      reviewNotes: reviewNotes.trim() || 'A delightful watch logged in my personal movie diary! 🍵✨',
      dateWatched,
      watchFormat,
      moodTags,
      taggedFriendIds,
      favorite
    };

    if (editingMovie) {
      updateMovie({ id: editingMovie.id, ...movieData });
    } else {
      addMovie(movieData);
    }
    setIsLogModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn overflow-hidden">
      <div className="relative bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl p-5 sm:p-6 flex flex-col justify-between gap-4">
        
        {/* Compact Header Bar */}
        <div className="shrink-0 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📝</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-tight">
                {editingMovie ? 'Edit Journal Entry' : prefillMovie ? 'Rate Recommendation' : 'Log a Movie Adventure'}
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] font-extrabold uppercase tracking-wide">Record your thoughts, moods, and companions</p>
            </div>
          </div>
          <button
            onClick={() => setIsLogModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-bold text-base transition-transform hover:scale-110 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Non-Scrollable 2-Column Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden gap-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 min-h-0 overflow-hidden">
            
            {/* 📍 LEFT COLUMN: Core Metadata, Rating, & Cover Artwork */}
            <div className="flex flex-col justify-between min-h-0 gap-3.5 overflow-hidden">
              
              {/* Title & Director */}
              <div className="grid grid-cols-3 gap-2.5 shrink-0">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Movie Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Neighbor Totoro"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] focus:border-[var(--accent-sakura-text)] text-xs font-black text-[var(--text-primary)] outline-hidden shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Director</label>
                  <input
                    type="text"
                    placeholder="Miyazaki"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] outline-hidden shadow-inner"
                  />
                </div>
              </div>

              {/* Interactive Half-Star Rating & Favorite Switch */}
              <div className="p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] flex items-center justify-between gap-2 shrink-0 shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block mb-1">Your Rating</span>
                  <StarRating rating={userRating} interactive={true} size="md" showTooltip={false} onRatingChange={(val) => setUserRating(val)} />
                </div>
                <button
                  type="button"
                  onClick={() => setFavorite(!favorite)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer ${
                    favorite ? 'bg-pink-500 text-white shadow-sm scale-102' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <span className="text-sm">{favorite ? '♥' : '♡'}</span>
                  <span>{favorite ? 'Favorite!' : '+ Favorite'}</span>
                </button>
              </div>

              {/* Watch Date & Format */}
              <div className="grid grid-cols-2 gap-2.5 shrink-0">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Date Watched</label>
                  <input
                    type="date"
                    value={dateWatched}
                    onChange={(e) => setDateWatched(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider">Viewing Vibe</label>
                  <select
                    value={watchFormat}
                    onChange={(e) => setWatchFormat(e.target.value as WatchFormat)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] outline-hidden cursor-pointer"
                  >
                    {availableFormats.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Artwork Selection */}
              <div className="space-y-1.5 shrink-0">
                <label className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider block">Select Cover Artwork</label>
                <div className="grid grid-cols-6 gap-2">
                  {posterChoices.map((p) => (
                    <button
                      type="button"
                      key={p.path}
                      onClick={() => setPosterPath(p.path)}
                      className={`group relative rounded-xl overflow-hidden aspect-[2/3] border-2 transition-all cursor-pointer ${
                        posterPath === p.path ? 'border-amber-500 shadow-md scale-105 ring-1 ring-amber-500/50 z-10' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={p.label}
                    >
                      <img src={p.path} alt={p.label} className="w-full h-full object-cover" />
                      {posterPath === p.path && (
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-black">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* 📍 RIGHT COLUMN: Review Notes, Mood Tags, & Friend Companions */}
            <div className="flex flex-col justify-between min-h-0 gap-3.5 overflow-hidden">
              
              {/* Diary Review textarea */}
              <div className="flex-1 min-h-0 flex flex-col space-y-1">
                <label className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider flex items-center justify-between shrink-0">
                  <span>Diary Review & Thoughts</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">What stirred your soul?</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Curling up during the rainy campfire scene brought absolute serenity..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full flex-1 min-h-[68px] max-h-28 p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-xs font-serif italic text-[var(--text-primary)] outline-hidden focus:border-[var(--accent-sakura-text)] leading-relaxed shadow-inner resize-none"
                />
              </div>

              {/* Mood Tags Picker */}
              <div className="space-y-1.5 shrink-0">
                <label className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider block">Viewing Mood Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableMoods.map((mood) => {
                    const selected = moodTags.includes(mood);
                    return (
                      <button
                        type="button"
                        key={mood}
                        onClick={() => toggleMood(mood)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${
                          selected ? 'bg-[var(--accent-matcha)] text-[var(--accent-matcha-text)] shadow-2xs border border-[var(--accent-matcha-text)]/40 scale-102' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)]'
                        }`}
                      >
                        {selected ? `✓ ${mood}` : mood}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tag Friends Watched With */}
              <div className="space-y-1.5 shrink-0">
                <label className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider block">Who Did You Watch With? (Tag Friends)</label>
                <div className="flex flex-wrap gap-1.5">
                  {friends.map((friend) => {
                    const selected = taggedFriendIds.includes(friend.id);
                    return (
                      <button
                        type="button"
                        key={friend.id}
                        onClick={() => toggleFriend(friend.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                          selected ? 'bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] border border-[var(--accent-sakura-text)]/40 shadow-2xs scale-102' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)]'
                        }`}
                      >
                        <img src={friend.avatar} alt={friend.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                        <span className="truncate max-w-[80px]">{selected ? `✓ @${friend.name.split(' ')[0]}` : `@${friend.name.split(' ')[0]}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Compact Submit Footer */}
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[var(--border-color)]">
            <div>
              {editingMovie && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete "${editingMovie.title}" from your movie diary?`)) {
                      deleteMovie(editingMovie.id);
                      setIsLogModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 font-black text-xs transition-colors cursor-pointer border border-rose-500/30 flex items-center gap-1.5"
                  title="Delete this entry from your movie diary"
                >
                  <span>🗑️ Delete</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] font-black text-xs transition-colors cursor-pointer border border-[var(--border-color)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-linear-to-r from-[var(--accent-sakura)] via-[var(--accent-honey)] to-[var(--accent-matcha)] text-[var(--text-primary)] font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 border border-white/40 cursor-pointer uppercase tracking-wider active:scale-95"
              >
                <span>✿</span>
                <span>{editingMovie ? 'Save Updates' : 'Save to Diary'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
