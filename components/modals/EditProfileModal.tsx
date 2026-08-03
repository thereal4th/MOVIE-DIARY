/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { Edit3, Sparkles, X } from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileModalOpen } = useMovieDiary();

  if (!isEditProfileModalOpen) return null;

  return <EditProfileModalContent />;
};

const EditProfileModalContent: React.FC = () => {
  const { setIsEditProfileModalOpen, userProfile, updateUserProfile } = useMovieDiary();

  const [editForm, setEditForm] = useState({
    name: userProfile?.name || "",
    handle: userProfile?.handle || "",
    avatar: userProfile?.avatar || "/images/avatars/default.png",
    bannerUrl: userProfile?.bannerUrl || "/images/posters/past_lives.jpg",
    bio: userProfile?.bio ?? "",
    tastePhilosophy: userProfile?.tastePhilosophy ?? "",
    favoriteQuote: userProfile?.favoriteQuote ?? "",
    favoriteQuoteMovie: userProfile?.favoriteQuoteMovie ?? "",
    favoriteQuoteCharacter: userProfile?.favoriteQuoteCharacter ?? ""
  });

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setEditForm((prev) => ({ ...prev, bannerUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setEditForm((prev) => ({ ...prev, avatar: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editForm.name,
      handle: editForm.handle,
      avatar: editForm.avatar,
      bannerUrl: editForm.bannerUrl,
      bio: editForm.bio,
      tastePhilosophy: editForm.tastePhilosophy,
      favoriteQuote: editForm.favoriteQuote,
      favoriteQuoteMovie: editForm.favoriteQuoteMovie,
      favoriteQuoteCharacter: editForm.favoriteQuoteCharacter
    });
    setIsEditProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl p-6 w-full max-w-lg shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[var(--border-color)]/70 pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-honey)] text-[var(--accent-honey-text)] flex items-center justify-center shrink-0 shadow-md">
              <Edit3 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-wide font-serif">
                Edit Profile
              </h3>
              <p className="text-[11px] font-extrabold text-[var(--text-muted)]">
                Customize your name, cover photo, avatar, & cinema philosophy
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileModalOpen(false)}
            className="theme-x-btn w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-bold text-[var(--text-primary)]">
          
          {/* X / Twitter App Style Header Banner & Overlapping Circular Avatar */}
          <div className="relative mb-14 sm:mb-16 pt-1">
            {/* Cover Photo Header Banner */}
            <label 
              className="block h-36 w-full rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-950 relative shadow-inner cursor-pointer group select-none"
              title="Change Cover Photo Header"
            >
              <img
                src={editForm.bannerUrl || "/images/posters/past_lives.jpg"}
                alt="Cover photo preview"
                className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/posters/past_lives.jpg"; }}
              />
              {/* Center Edit Icon Badge on Hover Only */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-black/75 text-white flex items-center justify-center backdrop-blur-xs shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200 border border-white/25">
                  <Edit3 className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
            </label>

            {/* Overlapping Circular Profile Picture */}
            <div className="absolute -bottom-[46px] left-5 z-10">
              <label 
                className="block w-[92px] h-[92px] rounded-full overflow-hidden border-4 border-[var(--surface-card)] bg-[var(--surface-subtle)] relative shadow-2xl cursor-pointer group select-none"
                title="Change Profile Picture"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={editForm.avatar || "/images/avatars/default.png"}
                  alt="Profile picture preview"
                  className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"; }}
                />
                {/* Center Edit Icon Badge on Hover Only */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-black/75 text-white flex items-center justify-center backdrop-blur-xs shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200 border border-white/25">
                    <Edit3 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>


          {/* Display Name & Username Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Display Name
              </label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)]"
                placeholder="Fourth & Sheena's Cinema"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[var(--text-muted)] font-mono">@</span>
                <input
                  type="text"
                  required
                  value={editForm.handle}
                  onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)]"
                  placeholder="fourth_and_sheena"
                />
              </div>
            </div>
          </div>

          {/* Auteur Quote / Bio */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              Auteur Bio / Cinema Quote
            </label>
            <textarea
              rows={2}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] font-serif italic focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] resize-none"
              placeholder="Tell us about your cinematic style..."
            />
          </div>

          {/* Favorite Movie Quote Section */}
          <div className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-subtle)]/50 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--accent-honey-text)] dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Favorite Movie Quote</span>
            </span>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                The Quote
              </label>
              <textarea
                rows={2}
                value={editForm.favoriteQuote}
                onChange={(e) => setEditForm({ ...editForm, favoriteQuote: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-serif italic focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] resize-none text-xs"
                placeholder="In another life, I would have really liked..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                  Character Name
                </label>
                <input
                  type="text"
                  value={editForm.favoriteQuoteCharacter}
                  onChange={(e) => setEditForm({ ...editForm, favoriteQuoteCharacter: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] text-xs"
                  placeholder="e.g. Waymond Wang"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                  Movie Title (& Year)
                </label>
                <input
                  type="text"
                  value={editForm.favoriteQuoteMovie}
                  onChange={(e) => setEditForm({ ...editForm, favoriteQuoteMovie: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent-honey)] text-xs"
                  placeholder="e.g. Everything Everywhere All at Once"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[var(--border-color)]/70 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-[var(--accent-honey)] text-[var(--accent-honey-text)] shadow-md hover:scale-105 transition-all border border-[var(--border-color)] cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save Profile</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
