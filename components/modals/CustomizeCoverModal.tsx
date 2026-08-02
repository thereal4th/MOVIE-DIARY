"use client";
import React, { useState } from 'react';
import { useMovieDiary } from '../../context/MovieDiaryContext';
import { X, Palette, Type, Check, RotateCcw, Sticker as StickerIcon, Wand2 } from 'lucide-react';

const COLOR_OPTIONS = [
  { label: 'Gingham Theme Match', value: 'default', colorClass: 'bg-linear-to-r from-red-600 via-rose-500 to-zinc-900' },
  { label: 'Ruby Strawberry Red', value: '#C42643', colorClass: 'bg-[#C42643]' },
  { label: 'Matte Charcoal Black', value: '#1E1C24', colorClass: 'bg-[#1E1C24]' },
  { label: 'Cherry Blossom Pink', value: '#EC4899', colorClass: 'bg-[#EC4899]' },
  { label: 'Botanical Jade Green', value: '#059669', colorClass: 'bg-[#059669]' },
  { label: 'Royal Velvet Amethyst', value: '#7C3AED', colorClass: 'bg-[#7C3AED]' },
  { label: 'Honey Champagne Amber', value: '#D97706', colorClass: 'bg-[#D97706]' },
  { label: 'Sapphire Midnight Blue', value: '#1E40AF', colorClass: 'bg-[#1E40AF]' },
];

const TEXT_COLOR_OPTIONS = [
  { label: 'Crisp Platinum White', value: '#FFFFFF', bgClass: 'bg-white border-zinc-300' },
  { label: 'Warm Vintage Cream', value: '#F7ECD9', bgClass: 'bg-[#F7ECD9] border-amber-300' },
  { label: 'Champagne Gold', value: '#FCD34D', bgClass: 'bg-amber-300 border-amber-500' },
  { label: 'Obsidian Velvet Black', value: '#111114', bgClass: 'bg-[#111114] border-zinc-700' },
];

const STICKER_CATALOG = [
  '🍿', '🎬', '🎟️', '🎞️', '⭐', '💖', '🍓', '🌸', 
  '🎥', '🥤', '🍦', '🧸', '🎶', '🥂', '🌻', '👑', '✨', '🔥'
];

export const CustomizeCoverModal: React.FC = () => {
  const { isCustomizeCoverModalOpen, setIsCustomizeCoverModalOpen, coverCustomization, setCoverCustomization } = useMovieDiary();
  const [activeTab, setActiveTab] = useState<'color' | 'text' | 'stickers'>('color');

  if (!isCustomizeCoverModalOpen) return null;

  const handleSelectColor = (colorValue: string) => {
    setCoverCustomization((prev) => ({ ...prev, color: colorValue }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverCustomization((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleTitleColorChange = (textColorValue: string) => {
    setCoverCustomization((prev) => ({ ...prev, titleColor: textColorValue }));
  };

  const handleToggleSticker = (sticker: string) => {
    setCoverCustomization((prev) => {
      const exists = prev.stickers.includes(sticker);
      if (exists) {
        return { ...prev, stickers: prev.stickers.filter((s) => s !== sticker) };
      } else {
        return { ...prev, stickers: [...prev.stickers, sticker] };
      }
    });
  };

  const handleReset = () => {
    setCoverCustomization({
      color: 'default',
      title: '',
      titleColor: '#FFFFFF',
      stickers: [],
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--surface-card)] border-2 border-[var(--border-color)] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--surface-subtle)]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center text-white shadow-md border border-white/40">
              <Palette className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wide text-[var(--text-primary)] uppercase">
                Customize Cover
              </h3>
              <p className="text-xs font-bold text-[var(--text-muted)]">
                Design your diary cover & pick picnic aesthetics
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCustomizeCoverModalOpen(false)}
            className="w-9 h-9 rounded-full bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border-color)] bg-[var(--surface-subtle)]/30 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('color')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'color'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Cover Color</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Custom Text</span>
          </button>

          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'stickers'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            <StickerIcon className="w-4 h-4" />
            <span>Stickers</span>
            {coverCustomization.stickers.length > 0 && (
              <span className="px-1.5 py-0.5 bg-white/20 text-white rounded-full text-[10px]">
                {coverCustomization.stickers.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Tab 1: Color Picker */}
          {activeTab === 'color' && (
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] block">
                Choose Hardcover Solid Tone
              </label>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_OPTIONS.map((opt) => {
                  const isSelected = coverCustomization.color === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectColor(opt.value)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer select-none text-left ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 shadow-md ring-2 ring-purple-400/30'
                          : 'border-[var(--border-color)] hover:border-purple-400/50 bg-[var(--surface-subtle)]/40 hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl shrink-0 shadow-sm border border-white/40 flex items-center justify-center ${opt.colorClass}`}>
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-sm" />}
                      </div>
                      <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Custom Text */}
          {activeTab === 'text' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] block">
                  Book Cover Title Inscription
                </label>
                <input
                  type="text"
                  placeholder="e.g., Fourth & Sheena's Movie Log"
                  value={coverCustomization.title || ''}
                  onChange={handleTitleChange}
                  maxLength={40}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--surface-subtle)]/50 text-[var(--text-primary)] font-serif font-bold text-lg placeholder:text-[var(--text-muted)] focus:outline-hidden focus:border-purple-500 transition-colors shadow-inner"
                />
                <p className="text-[11px] font-semibold text-[var(--text-muted)]">
                  Leave empty for a perfectly minimalist, clean solid cover.
                </p>
              </div>

              {coverCustomization.title && (
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] block">
                    Inscription Foil Color
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {TEXT_COLOR_OPTIONS.map((tOpt) => {
                      const isSelected = coverCustomization.titleColor === tOpt.value;
                      return (
                        <button
                          key={tOpt.value}
                          onClick={() => handleTitleColorChange(tOpt.value)}
                          className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500/10 shadow-sm'
                              : 'border-[var(--border-color)] hover:bg-[var(--surface-hover)]'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 ${tOpt.bgClass} shadow-xs flex items-center justify-center shrink-0`}>
                            {isSelected && <Check className={`w-3.5 h-3.5 ${tOpt.value === '#FFFFFF' || tOpt.value === '#F7ECD9' || tOpt.value === '#FCD34D' ? 'text-black' : 'text-white'} stroke-[3]`} />}
                          </div>
                          <span className="text-xs font-extrabold text-[var(--text-primary)]">
                            {tOpt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Stickers */}
          {activeTab === 'stickers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] block">
                  Click to Add or Remove Stickers
                </label>
                <span className="text-[11px] font-bold text-purple-500">
                  {coverCustomization.stickers.length} selected
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2.5">
                {STICKER_CATALOG.map((stk) => {
                  const isSelected = coverCustomization.stickers.includes(stk);
                  return (
                    <button
                      key={stk}
                      onClick={() => handleToggleSticker(stk)}
                      className={`h-12 rounded-2xl border-2 text-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 select-none ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/20 shadow-md transform -translate-y-0.5'
                          : 'border-[var(--border-color)] bg-[var(--surface-subtle)]/40 hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      {stk}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--surface-subtle)]/70 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface-card)] hover:bg-rose-500/10 hover:border-rose-500/30 text-[var(--text-secondary)] hover:text-rose-600 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Default</span>
          </button>

          <button
            onClick={() => setIsCustomizeCoverModalOpen(false)}
            className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Wand2 className="w-4 h-4 stroke-[2.5]" />
            <span>Save & View Cover</span>
          </button>
        </div>

      </div>
    </div>
  );
};
