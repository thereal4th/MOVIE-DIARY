/* eslint-disable @next/next/no-img-element */
 
/* eslint-disable react-hooks/set-state-in-effect */
 
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { MoodTag, WatchFormat, Movie } from '../../types/diary';
import { StarRating } from '../rating/StarRating';

export const LogMovieModal: React.FC = () => {
  const { isLogModalOpen, setIsLogModalOpen, addMovie, updateMovie, editingMovie, prefillMovie, friends } = useMovieDiary();

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
      setDateWatched(new Date().toISOString().split('T')[0]);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                {editingMovie ? 'Edit Journal Entry' : prefillMovie ? 'Rate Recommendation' : 'Log a Movie Adventure'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">Record your thoughts, moods, and companions</p>
            </div>
          </div>
          <button
            onClick={() => setIsLogModalOpen(false)}
            className="w-10 h-10 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-bold text-lg transition-transform hover:scale-110"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Title, Director & Favorite */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Movie Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. My Neighbor Totoro"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] focus:border-[var(--accent-blush-text)] text-sm font-extrabold text-[var(--text-primary)] outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Director</label>
              <input
                type="text"
                placeholder="e.g. Hayao Miyazaki"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-sm font-semibold text-[var(--text-primary)] outline-hidden"
              />
            </div>
          </div>

          {/* Row 2: Interactive Half-Star Rating & Favorite Switch */}
          <div className="p-5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-1.5">Your 5-Star Rating (Half-star supported)</span>
              <StarRating rating={userRating} interactive={true} size="lg" onRatingChange={(val) => setUserRating(val)} />
            </div>
            <button
              type="button"
              onClick={() => setFavorite(!favorite)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                favorite ? 'bg-pink-500 text-white shadow-md' : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-color)]'
              }`}
            >
              <span className="text-base">{favorite ? '♥' : '♡'}</span>
              <span>{favorite ? 'Marked Favorite!' : 'Add to Favorites'}</span>
            </button>
          </div>

          {/* Row 3: Watch Date & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Date Watched</label>
              <input
                type="date"
                value={dateWatched}
                onChange={(e) => setDateWatched(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase">Viewing Format & Vibe</label>
              <select
                value={watchFormat}
                onChange={(e) => setWatchFormat(e.target.value as WatchFormat)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)] outline-hidden cursor-pointer"
              >
                {availableFormats.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Review Notes Critique */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase flex items-center justify-between">
              <span>Diary Review & Thoughts</span>
              <span className="text-xs text-[var(--text-muted)] font-normal">What stirred your soul in this film?</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Curling up on the couch during the rainy campfire scene brought absolute serenity..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] outline-hidden focus:border-[var(--accent-blush-text)] leading-relaxed"
            />
          </div>

          {/* Row 5: Mood Tags Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block">Select Viewing Mood Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableMoods.map((mood) => {
                const selected = moodTags.includes(mood);
                return (
                  <button
                    type="button"
                    key={mood}
                    onClick={() => toggleMood(mood)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selected ? 'bg-[var(--accent-sage)] text-[var(--accent-sage-text)] shadow-xs border-2 border-[var(--accent-sage-text)]/40 scale-105' : 'bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                    }`}
                  >
                    {selected ? `✓ ${mood}` : mood}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: Tag Friends Watched With */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block">Who Did You Watch This With? (Tag Friends)</label>
            <div className="flex flex-wrap gap-2.5">
              {friends.map((friend) => {
                const selected = taggedFriendIds.includes(friend.id);
                return (
                  <button
                    type="button"
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selected ? 'bg-[var(--accent-blush)] text-[var(--accent-blush-text)] border-2 border-[var(--accent-blush-text)]/40 shadow-xs scale-105' : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <img src={friend.avatar} alt={friend.name} className="w-5 h-5 rounded-full object-cover" />
                    <span>{selected ? `✓ @${friend.name.split(' ')[0]}` : `@${friend.name.split(' ')[0]}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 7: Poster Artwork Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block">Cover Artwork</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {posterChoices.map((p) => (
                <button
                  type="button"
                  key={p.path}
                  onClick={() => setPosterPath(p.path)}
                  className={`group relative rounded-xl overflow-hidden aspect-[2/3] border-2 transition-all ${
                    posterPath === p.path ? 'border-[var(--accent-star)] shadow-md scale-105 ring-2 ring-[var(--accent-star)]/50' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={p.label}
                >
                  <img src={p.path} alt={p.label} className="w-full h-full object-cover" />
                  {posterPath === p.path && (
                    <span className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xl font-black">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="px-6 py-3 rounded-2xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-linear-to-r from-[var(--accent-blush)] via-[var(--accent-honey)] to-[var(--accent-sage)] text-[var(--text-primary)] font-black text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 border border-white/40"
            >
              <span>✿</span>
              <span>{editingMovie ? 'Save Updates' : 'Save to Movie Diary'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
