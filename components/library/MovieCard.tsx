/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { Movie } from '../../types/diary';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { StarRating } from '../rating/StarRating';
import { Heart, RotateCcw, MapPin, Calendar, Pencil, Trash2 } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onEdit?: (movie: Movie) => void;
  index?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onEdit, index = 0 }) => {
  const { toggleFavorite, updateRating, deleteMovie, getTaggedFriends, setSelectedFriend } = useMovieDiary();
  const taggedFriends = getTaggedFriends(movie.taggedFriendIds);

  // Rotate colorful washi tape strips and card background tints based on movie index for variety!
  const washiStyles = ['washi-pink', 'washi-mint', 'washi-lilac', 'washi-gold'];
  const tintStyles = ['card-tint-pink', 'card-tint-mint', 'card-tint-lilac', 'card-tint-gold'];
  
  const selectedWashi = washiStyles[index % washiStyles.length];
  const selectedTint = tintStyles[index % tintStyles.length];

  return (
    <article className={`polaroid-card ${selectedTint} p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden relative group`}>
      {/* Decorative Washi Tape holding down the Polaroid */}
      <div className={`washi-strip ${selectedWashi}`}></div>

      {/* Top Artwork & Overlay Badges */}
      <div>
        <div className="relative overflow-hidden rounded-2xl aspect-[2/3] w-full bg-[var(--surface-subtle)] border-2 border-[var(--border-color)] shadow-inner mb-3 mt-1">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/posters/totoro.jpg';
            }}
          />
          
          {/* Favorite Heart Badge */}
          <button
            onClick={() => toggleFavorite(movie.id)}
            aria-label={movie.favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/60 text-white transition-all transform hover:scale-110 active:scale-95 border border-white/30 shadow-md cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                movie.favorite ? 'text-pink-400 fill-pink-400 scale-110' : 'text-white/80 hover:text-pink-200'
              }`}
            />
          </button>

          {/* Rewatch Badge Overlay */}
          {movie.isRewatch && (
            <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full backdrop-blur-md bg-[var(--accent-sakura)] text-[var(--accent-sakura-text)] font-black text-[9px] border border-white/40 shadow-md uppercase tracking-wider flex items-center gap-1">
              <RotateCcw className="w-3 h-3 stroke-[2.5]" />
              <span>Rewatch</span>
            </span>
          )}

          {/* Viewing Venue / Format Badge overlay */}
          {(movie.venue || movie.watchFormat) && (
            <span className="absolute bottom-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full backdrop-blur-md bg-black/70 text-white font-black text-[10px] border border-white/20 shadow-md flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
              <span>{movie.venue || movie.watchFormat}</span>
            </span>
          )}
        </div>

        {/* Concise Title & Director Metadata */}
        <div className="space-y-0.5 mb-2.5">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="font-extrabold text-base text-[var(--text-primary)] leading-tight tracking-tight hover:text-[var(--accent-sakura-text)] transition-colors cursor-pointer line-clamp-1" onClick={() => onEdit && onEdit(movie)}>
              {movie.title}
            </h3>
            <span className="date-stamp text-[10px] font-bold text-[var(--text-secondary)] bg-white/70 dark:bg-black/40 shrink-0 shadow-2xs py-0 px-1.5">
              {movie.releaseYear}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-bold truncate">
            Dir. <span className="text-[var(--text-secondary)]">{movie.director}</span> • {movie.runtimeMinutes}m
          </p>
        </div>

        {/* Compact Interactive Star Rating WITHOUT rating quote text! */}
        <div className="mb-2.5 pb-2 border-b border-[var(--border-color)]/70 flex items-center justify-between">
          <StarRating
            rating={movie.userRating}
            interactive={true}
            size="sm"
            showTooltip={false}
            onRatingChange={(newVal) => updateRating(movie.id, newVal)}
          />
          <span className="text-xs font-black text-[var(--accent-star)]">{movie.userRating.toFixed(1)}</span>
        </div>

        {/* Compact Contextual Badges: Custom Hashtags & Mood Tags */}
        {(movie.hashtags && movie.hashtags.length > 0 || movie.moodTags && movie.moodTags.length > 0) && (
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.hashtags && movie.hashtags.map((tag) => (
              <span
                key={tag}
                className="journal-pill text-[9px] font-black px-2 py-0.5 rounded-md bg-[var(--accent-honey)] text-[var(--accent-honey-text)] border border-black/10 shadow-2xs uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
            {movie.moodTags && movie.moodTags.map((tag) => (
              <span
                key={tag}
                className="journal-pill text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-color)] shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Date Watched Stamp & Tagged Friends (@user handle format) */}
      <div className="pt-2 border-t border-[var(--border-color)]/80 flex flex-col gap-1.5 text-xs mt-1">
        <div className="flex items-center justify-between">
          <span className="date-stamp font-extrabold text-[9px] text-[var(--text-muted)] bg-[var(--surface-card)] flex items-center gap-1 shadow-2xs px-2 py-0.5">
            <Calendar className="w-2.5 h-2.5 stroke-[2.5] text-[var(--text-secondary)]" />
            <span>{movie.dateWatched}</span>
          </span>

          {/* Edit/Delete Trigger Menu */}
          <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit && onEdit(movie)}
              className="p-1.5 rounded-lg bg-white/60 dark:bg-black/30 hover:bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-color)]/50 cursor-pointer"
              title="Edit Diary Entry"
            >
              <Pencil className="w-3 h-3 stroke-[2.5]" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Remove "${movie.title}" from your movie diary?`)) {
                  deleteMovie(movie.id);
                }
              }}
              className="p-1.5 rounded-lg bg-white/60 dark:bg-black/30 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors border border-[var(--border-color)]/50 cursor-pointer"
              title="Delete Entry"
            >
              <Trash2 className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Tagged Friends Pills with @user handle format */}
        {taggedFriends.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 pt-0.5">
            <span className="text-[9px] text-[var(--text-muted)] font-black uppercase">With:</span>
            {taggedFriends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                title={`View ${friend.name}'s profile and movie shelf`}
                className="journal-pill flex items-center gap-1 pr-2 pl-1 py-0.5 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)] font-extrabold text-[10px] shadow-2xs transition-all cursor-pointer"
              >
                <img src={friend.avatar} alt={friend.name} className="w-3 h-3 rounded-full object-cover border border-white" />
                <span className="font-mono text-[9px] text-[var(--accent-sakura-text)]">{friend.handle}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
