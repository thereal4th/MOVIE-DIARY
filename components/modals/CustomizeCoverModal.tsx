"use client";
import React, { useState } from 'react';
import { useMovieDiary, FONT_OPTIONS } from '../../context/MovieDiaryContext';
import { X, Palette, Type, Check, RotateCcw, Sticker as StickerIcon, Wand2, Plus, Trash2 } from 'lucide-react';

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
  { label: 'Crisp Platinum White', value: '#FFFFFF', bgClass: 'bg-white border-zinc-300 dark:border-white/30' },
  { label: 'Ruby Strawberry Red', value: '#C42643', bgClass: 'bg-[#C42643] border-white/40' },
  { label: 'Matte Charcoal Black', value: '#1E1C24', bgClass: 'bg-[#1E1C24] border-white/40' },
  { label: 'Cherry Blossom Pink', value: '#EC4899', bgClass: 'bg-[#EC4899] border-white/40' },
  { label: 'Botanical Jade Green', value: '#059669', bgClass: 'bg-[#059669] border-white/40' },
  { label: 'Royal Velvet Amethyst', value: '#7C3AED', bgClass: 'bg-[#7C3AED] border-white/40' },
  { label: 'Honey Champagne Amber', value: '#D97706', bgClass: 'bg-[#D97706] border-white/40' },
  { label: 'Sapphire Midnight Blue', value: '#1E40AF', bgClass: 'bg-[#1E40AF] border-white/40' },
];

const STICKER_CATALOG = [
  { id: 'cartoon_girl', label: 'Girl Doodle (Head Only)', src: '/images/cartoon_girl_sticker.png' },
  { id: 'cartoon_boy', label: 'Boy Doodle (Head Only)', src: '/images/cartoon_boy_sticker.png' },
  { id: 'ramen_doodle', label: 'Ramen Bowl Doodle', src: '/images/ramen_sticker.png' },
];

export const CustomizeCoverModal: React.FC = () => {
  const { isCustomizeCoverModalOpen, setIsCustomizeCoverModalOpen, coverCustomization, setCoverCustomization, activeCoverItem, setActiveCoverItem } = useMovieDiary();
  const [activeTab, setActiveTab] = useState<'color' | 'text' | 'stickers'>('color');

  if (!isCustomizeCoverModalOpen) return null;

  const isCustomColor = !COLOR_OPTIONS.some((opt) => opt.value === coverCustomization.color);
  const isCustomTextColor = !TEXT_COLOR_OPTIONS.some((tOpt) => tOpt.value === coverCustomization.titleColor);

  const handleSelectColor = (colorValue: string) => {
    setCoverCustomization((prev) => ({ ...prev, color: colorValue }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverCustomization((prev) => ({ ...prev, title: e.target.value }));
    if (e.target.value.trim().length > 0) {
      setActiveCoverItem('title');
    }
  };

  const handleTitleColorChange = (textColorValue: string) => {
    setCoverCustomization((prev) => ({ ...prev, titleColor: textColorValue }));
  };

  const handleTitleFontChange = (fontValue: string) => {
    setCoverCustomization((prev) => ({ ...prev, titleFont: fontValue }));
  };

  const addSticker = (imagePath: string) => {
    setCoverCustomization((prev) => {
      const exists = prev.stickers.includes(imagePath);
      if (exists) {
        setActiveCoverItem(null);
        return { ...prev, stickers: prev.stickers.filter((s) => s !== imagePath) };
      } else {
        const idx = prev.stickers.length;
        const defaultX = 25 + ((idx * 22) % 55);
        const defaultY = 65 + ((idx * 15) % 25);
        const defaultRot = (idx % 2 === 0 ? 1 : -1) * ((idx * 6) % 18);
        const existingPos = prev.stickerPos?.[imagePath];
        const updatedPos = {
          ...(prev.stickerPos || {}),
          [imagePath]: existingPos || { x: defaultX, y: defaultY, rot: defaultRot, scale: 1 },
        };
        setActiveCoverItem(imagePath);
        return { ...prev, stickers: [...prev.stickers, imagePath], stickerPos: updatedPos };
      }
    });
  };

  const handleAddCustomText = () => {
    const newId = `text_${Date.now()}`;
    const count = coverCustomization.customTexts?.length || 0;
    const newText = {
      id: newId,
      text: 'New Text',
      color: coverCustomization.titleColor || '#FFFFFF',
      font: coverCustomization.titleFont || 'serif',
      x: 50,
      y: Math.min(85, 52 + count * 12),
      rot: (count % 2 === 0 ? 1 : -1) * 4,
      scale: 0.75,
    };
    setCoverCustomization((prev) => ({
      ...prev,
      customTexts: [...(prev.customTexts || []), newText],
    }));
    setActiveCoverItem(newId);
  };

  const handleUpdateCustomText = (id: string, text: string) => {
    setCoverCustomization((prev) => ({
      ...prev,
      customTexts: (prev.customTexts || []).map((t) => (t.id === id ? { ...t, text } : t)),
    }));
  };

  const handleUpdateCustomTextColor = (id: string, color: string) => {
    setCoverCustomization((prev) => ({
      ...prev,
      customTexts: (prev.customTexts || []).map((t) => (t.id === id ? { ...t, color } : t)),
    }));
  };

  const handleUpdateCustomTextFont = (id: string, font: string) => {
    setCoverCustomization((prev) => ({
      ...prev,
      customTexts: (prev.customTexts || []).map((t) => (t.id === id ? { ...t, font } : t)),
    }));
  };

  const handleDeleteCustomText = (id: string) => {
    if (activeCoverItem === id) setActiveCoverItem(null);
    setCoverCustomization((prev) => ({
      ...prev,
      customTexts: (prev.customTexts || []).filter((t) => t.id !== id),
    }));
  };

  const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const newSticker = {
          id: `custom_sticker_${Date.now()}`,
          label: file.name.replace(/\.[^/.]+$/, "") || "Custom Sticker",
          src: dataUrl,
        };
        setCoverCustomization((prev) => ({
          ...prev,
          customStickers: [...(prev.customStickers || []), newSticker],
        }));
        addSticker(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCustomSticker = (e: React.MouseEvent, stickerPath: string, stickerId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeCoverItem === stickerPath) setActiveCoverItem(null);
    setCoverCustomization((prev) => ({
      ...prev,
      stickers: (prev.stickers || []).filter((s) => s !== stickerPath),
      customStickers: (prev.customStickers || []).filter(
        (s) => s.src !== stickerPath && s.id !== stickerId
      ),
    }));
  };

  const handleReset = () => {
    setActiveCoverItem(null);
    setCoverCustomization({
      color: 'default',
      title: '',
      titleColor: '#FFFFFF',
      titleFont: 'serif',
      stickers: [],
      titlePos: { x: 50, y: 35, rot: 0, scale: 1 },
      stickerPos: {},
      customTexts: [],
      customStickers: [],
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
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {COLOR_OPTIONS.map((opt) => {
                  const isSelected = coverCustomization.color === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectColor(opt.value)}
                      title={opt.label}
                      className={`w-12 h-12 rounded-full border-2 transition-all cursor-pointer select-none flex items-center justify-center shadow-md hover:scale-110 active:scale-95 ${opt.colorClass} ${
                        isSelected
                          ? 'border-white ring-4 ring-purple-500/60 scale-105'
                          : 'border-white/60 hover:border-white'
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-5 h-5 text-white stroke-[3] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                      )}
                    </button>
                  );
                })}

                {/* + Custom Color Wheel Trigger */}
                <div className="relative">
                  <label
                    title="Choose Custom Hex Color from Color Wheel"
                    className={`w-12 h-12 rounded-full border-2 border-dashed border-[var(--text-primary)]/50 hover:border-[var(--text-primary)] bg-linear-to-tr from-red-500 via-green-500 to-blue-500 p-0.5 flex items-center justify-center cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all select-none ${
                      isCustomColor
                        ? 'ring-4 ring-purple-500/60 scale-105 border-solid border-white'
                        : ''
                    }`}
                  >
                    <div 
                      className="w-full h-full rounded-full flex items-center justify-center bg-[var(--surface-card)] overflow-hidden"
                      style={isCustomColor ? { backgroundColor: coverCustomization.color } : {}}
                    >
                      {isCustomColor ? (
                        <Check className="w-5 h-5 text-white stroke-[3] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                      ) : (
                        <Plus className="w-6 h-6 text-[var(--text-primary)] stroke-[2.5]" />
                      )}
                    </div>
                    <input
                      type="color"
                      value={isCustomColor ? coverCustomization.color : '#C42643'}
                      onChange={(e) => handleSelectColor(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </label>
                </div>
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
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    {TEXT_COLOR_OPTIONS.map((tOpt) => {
                      const isSelected = coverCustomization.titleColor === tOpt.value;
                      const isLight = tOpt.value === '#FFFFFF' || tOpt.value === '#F7ECD9' || tOpt.value === '#FCD34D';
                      return (
                        <button
                          key={tOpt.value}
                          onClick={() => handleTitleColorChange(tOpt.value)}
                          title={tOpt.label}
                          className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer select-none flex items-center justify-center shadow-md hover:scale-110 active:scale-95 ${tOpt.bgClass} ${
                            isSelected
                              ? 'ring-4 ring-purple-500/60 scale-105 border-zinc-900 dark:border-white'
                              : 'hover:border-purple-400'
                          }`}
                        >
                          {isSelected && (
                            <Check className={`w-4 h-4 ${isLight ? 'text-black' : 'text-white'} stroke-[3] filter drop-shadow-xs`} />
                          )}
                        </button>
                      );
                    })}

                    {/* + Custom Text Foil Color Wheel Trigger */}
                    <div className="relative">
                      <label
                        title="Choose Custom Foil Tone from Color Wheel"
                        className={`w-10 h-10 rounded-full border-2 border-dashed border-[var(--text-primary)]/50 hover:border-[var(--text-primary)] bg-linear-to-tr from-yellow-400 via-rose-400 to-purple-500 p-0.5 flex items-center justify-center cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all select-none ${
                          isCustomTextColor
                            ? 'ring-4 ring-purple-500/60 scale-105 border-solid border-white'
                            : ''
                        }`}
                      >
                        <div 
                          className="w-full h-full rounded-full flex items-center justify-center bg-[var(--surface-card)] overflow-hidden"
                          style={isCustomTextColor ? { backgroundColor: coverCustomization.titleColor } : {}}
                        >
                          {isCustomTextColor ? (
                            <Check className="w-4 h-4 text-white stroke-[3] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                          ) : (
                            <Plus className="w-5 h-5 text-[var(--text-primary)] stroke-[2.5]" />
                          )}
                        </div>
                        <input
                          type="color"
                          value={isCustomTextColor ? coverCustomization.titleColor : '#FCD34D'}
                          onChange={(e) => handleTitleColorChange(e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] block">
                      Inscription Typography Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FONT_OPTIONS.map((fOpt) => {
                        const isSelected = (coverCustomization.titleFont || 'serif') === fOpt.value;
                        return (
                          <button
                            key={fOpt.value}
                            onClick={() => handleTitleFontChange(fOpt.value)}
                            style={{ fontFamily: fOpt.fontFamily }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer select-none truncate ${
                              isSelected
                                ? 'border-purple-500 bg-purple-500/15 text-purple-500 dark:text-purple-300 shadow-sm scale-[1.02]'
                                : 'border-[var(--border-color)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:border-purple-400'
                            }`}
                          >
                            {fOpt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Textboxes Section */}
              <div className="pt-4 border-t border-[var(--border-color)]/70 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Additional Text Inscriptions
                  </label>
                  <button
                    onClick={handleAddCustomText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Add More Text
                  </button>
                </div>

                {coverCustomization.customTexts && coverCustomization.customTexts.length > 0 && (
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {coverCustomization.customTexts.map((txt) => (
                      <div key={txt.id} className="p-3.5 rounded-2xl bg-[var(--surface-subtle)]/70 border border-[var(--border-color)] space-y-2.5 shadow-xs">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={txt.text}
                            onChange={(e) => {
                              handleUpdateCustomText(txt.id, e.target.value);
                              if (activeCoverItem !== txt.id) setActiveCoverItem(txt.id);
                            }}
                            placeholder="Type additional text..."
                            maxLength={50}
                            className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-[var(--border-color)] bg-[var(--surface-card)] text-[var(--text-primary)] font-serif font-semibold text-base focus:outline-hidden focus:border-purple-500 shadow-inner"
                          />
                          <button
                            onClick={() => handleDeleteCustomText(txt.id)}
                            title="Delete this text box"
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 hover:border hover:border-rose-500/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Quick Foil Color Selector for this Textbox */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1 px-1">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] mr-1">Color:</span>
                          {TEXT_COLOR_OPTIONS.map((tOpt) => {
                            const isSelected = txt.color === tOpt.value;
                            return (
                              <button
                                key={tOpt.value}
                                onClick={() => handleUpdateCustomTextColor(txt.id, tOpt.value)}
                                title={tOpt.label}
                                className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer select-none flex items-center justify-center shadow-sm hover:scale-125 active:scale-95 ${tOpt.bgClass} ${
                                  isSelected ? 'ring-2 ring-purple-500 scale-110 border-zinc-900 dark:border-white' : 'hover:border-purple-400'
                                }`}
                              >
                                {isSelected && (
                                  <Check className={`w-3.5 h-3.5 ${tOpt.value === '#FFFFFF' ? 'text-black' : 'text-white'} stroke-[3] filter drop-shadow-xs`} />
                                )}
                              </button>
                            );
                          })}

                          {/* + Custom Text Color Wheel Trigger */}
                          {(() => {
                            const isCustomTxtColor = !TEXT_COLOR_OPTIONS.some(o => o.value === txt.color);
                            return (
                              <div className="relative">
                                <label
                                  title="Choose Custom Color from Color Wheel"
                                  className={`w-7 h-7 rounded-full border-2 border-dashed border-[var(--text-primary)]/50 hover:border-[var(--text-primary)] bg-linear-to-tr from-yellow-400 via-rose-400 to-purple-500 p-0.5 flex items-center justify-center cursor-pointer shadow-sm hover:scale-125 active:scale-95 transition-all select-none ${
                                    isCustomTxtColor
                                      ? 'ring-2 ring-purple-500 scale-110 border-solid border-white'
                                      : ''
                                  }`}
                                >
                                  <div 
                                    className="w-full h-full rounded-full flex items-center justify-center bg-[var(--surface-card)] overflow-hidden"
                                    style={isCustomTxtColor ? { backgroundColor: txt.color } : {}}
                                  >
                                    {isCustomTxtColor ? (
                                      <Check className="w-3.5 h-3.5 text-white stroke-[3] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                                    ) : (
                                      <Plus className="w-4 h-4 text-[var(--text-primary)] stroke-[2.5]" />
                                    )}
                                  </div>
                                  <input
                                    type="color"
                                    value={isCustomTxtColor ? txt.color : '#FCD34D'}
                                    onChange={(e) => handleUpdateCustomTextColor(txt.id, e.target.value)}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                  />
                                </label>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Typography selector for this additional textbox */}
                        <div className="flex items-center gap-2 px-1 pt-1 overflow-x-auto no-scrollbar">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] shrink-0">Font:</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {FONT_OPTIONS.map((fOpt) => {
                              const isSelected = (txt.font || 'serif') === fOpt.value;
                              return (
                                <button
                                  key={fOpt.value}
                                  onClick={() => handleUpdateCustomTextFont(txt.id, fOpt.value)}
                                  style={{ fontFamily: fOpt.fontFamily }}
                                  className={`px-2.5 py-1 rounded-lg text-xs border transition-all cursor-pointer whitespace-nowrap select-none ${
                                    isSelected
                                      ? 'border-purple-500 bg-purple-600 text-white font-black shadow-xs'
                                      : 'border-[var(--border-color)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:border-purple-400 font-semibold'
                                  }`}
                                >
                                  {fOpt.label.split(' ')[0]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Stickers (#sticker-menu) */}
          {activeTab === 'stickers' && (
            <div id="sticker-menu" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] block">
                    Die-Cut Sticker Sheet
                  </label>
                  <span className="text-[11px] text-[var(--text-secondary)] font-semibold">Click to stamp onto cover</span>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer select-none">
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Upload Sticker</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleStickerUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] font-extrabold text-purple-500 px-2 py-0.5 bg-purple-500/10 rounded-lg">
                    {coverCustomization.stickers.length} stamped
                  </span>
                </div>
              </div>
              
              {/* Sticker Sheet Grid Container */}
              <div className="sticker-sheet-grid p-4 sm:p-5 grid grid-cols-3 sm:grid-cols-4 gap-3.5 max-h-[360px] overflow-y-auto">
                {[...STICKER_CATALOG, ...(coverCustomization.customStickers || [])].map((stk, index) => {
                  const isSelected = coverCustomization.stickers.includes(stk.src);
                  const isCustom = !STICKER_CATALOG.some(c => c.id === stk.id);

                  return (
                    <div
                      key={`${stk.id}_${index}`}
                      className={`group relative p-2.5 rounded-2xl transition-all select-none flex flex-col items-center justify-between border-2 shadow-xs hover:shadow-md ${
                        isSelected
                          ? 'bg-purple-500/25 border-purple-500 ring-4 ring-purple-500/40 shadow-lg'
                          : 'bg-white/40 dark:bg-black/40 border-white/70 hover:border-white'
                      }`}
                    >
                      {/* Stamp Trigger Area */}
                      <div
                        onClick={() => addSticker(stk.src)}
                        title={`${stk.label} (Click to add/remove)`}
                        className="w-full flex-1 flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform py-1"
                      >
                        <img 
                          src={stk.src} 
                          alt={stk.label} 
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-[2px_3px_5px_rgba(0,0,0,0.25)] group-hover:drop-shadow-[3px_5px_8px_rgba(0,0,0,0.35)] transition-all pointer-events-none" 
                        />
                        <span className="text-[9px] font-extrabold text-[var(--text-secondary)] truncate w-full text-center mt-1 opacity-85 group-hover:opacity-100">
                          {stk.label}
                        </span>
                      </div>

                      {/* Top-Left Icon Delete Button for Uploaded Stickers */}
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomSticker(e, stk.src, stk.id)}
                          title="Delete uploaded sticker"
                          className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white z-20 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      )}

                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md border-2 border-white pointer-events-none">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
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
