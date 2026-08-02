/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { StarRating } from '../rating/StarRating';
import { MovieCard } from '../library/MovieCard';

export const FriendProfileModal: React.FC = () => {
  const { selectedFriend, setSelectedFriend, setPrefillMovie, setIsLogModalOpen } = useMovieDiary();

  if (!selectedFriend) return null;

  const handleCopyMovie = (movie: any) => {
    setPrefillMovie({
      title: movie.title,
      director: movie.director,
      releaseYear: movie.releaseYear,
      runtimeMinutes: movie.runtimeMinutes,
      genres: movie.genres,
      posterPath: movie.posterPath,
      reviewNotes: `Inspired to watch after exploring ${selectedFriend.name}'s cozy diary library! ✿`,
      userRating: 5.0,
    });
    setSelectedFriend(null);
    setIsLogModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header Bar & Close */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={selectedFriend.avatar}
              alt={selectedFriend.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[var(--accent-blush)] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-[var(--text-primary)]">{selectedFriend.name}</h2>
                {selectedFriend.isOnline && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wide">
                    Online
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[var(--accent-blush-text)]">{selectedFriend.handle}</p>
              <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 max-w-md italic">
                "{selectedFriend.bio}"
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setSelectedFriend(null)}
              className="w-10 h-10 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-bold text-lg transition-transform hover:scale-110"
            >
              ✕
            </button>
            <span className="text-xs font-black uppercase px-3 py-1 rounded-xl bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-2xs">
              {selectedFriend.compatibilityScore}% Taste Overlap
            </span>
          </div>
        </div>

        {/* Favorite Genres Bar */}
        <div className="mb-8 bg-[var(--surface-subtle)] p-4 rounded-2xl border border-[var(--border-color)] flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Favorite Genres:</span>
            {selectedFriend.favoriteGenres.map((g) => (
              <span key={g} className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-2xs">
                {g}
              </span>
            ))}
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-bold">
            🎞️ {selectedFriend.watchedLibrary.length} films recorded in diary
          </span>
        </div>

        {/* Friend's Watched Library Grid */}
        <div>
          <h3 className="text-lg font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span>📖 {selectedFriend.name}'s Watched Library</span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">(Click "Log to My Diary" to rate for yourself)</span>
          </h3>

          {selectedFriend.watchedLibrary.length === 0 ? (
            <div className="text-center py-12 bg-[var(--surface-subtle)] rounded-2xl text-[var(--text-muted)] font-medium">
              This friend is currently updating their personal movie collection! 🍃
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedFriend.watchedLibrary.map((movie) => (
                <div key={movie.id} className="polaroid-card rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 border border-[var(--border-color)]">
                      <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-base text-[var(--text-primary)] truncate">{movie.title}</h4>
                      <span className="text-[11px] font-bold text-[var(--text-muted)]">{movie.releaseYear}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mb-2">Dir. {movie.director}</p>
                    <StarRating rating={movie.userRating} interactive={false} size="sm" showTooltip={false} />
                    <p className="text-xs text-[var(--text-secondary)] italic mt-2 line-clamp-3 bg-[var(--surface-subtle)] p-2 rounded-lg border-l-2 border-[var(--accent-blush-text)]">
                      "{movie.reviewNotes}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[var(--text-muted)]">📅 {movie.dateWatched}</span>
                    <button
                      onClick={() => handleCopyMovie(movie)}
                      className="px-3 py-1.5 rounded-xl bg-[var(--accent-sage)] text-[var(--accent-sage-text)] font-bold text-xs hover:opacity-90 transition-transform active:scale-95 shadow-2xs"
                    >
                      + Log to My Diary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={() => setSelectedFriend(null)}
            className="px-6 py-2.5 rounded-2xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] font-extrabold text-xs text-[var(--text-primary)] border border-[var(--border-color)]"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
