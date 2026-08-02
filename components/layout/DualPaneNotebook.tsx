"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useMovieDiary, getFontFamily } from '../../context/MovieDiaryContext';
import { Film, BookOpen, Sparkles, X, Check, RotateCw, Maximize2 } from 'lucide-react';

interface DualPaneNotebookProps {
  leftPage: React.ReactNode;
  rightPage: React.ReactNode;
}

export const DualPaneNotebook: React.FC<DualPaneNotebookProps> = ({ leftPage, rightPage }) => {
  const { diaryState, setDiaryState, coverCustomization, setCoverCustomization, activeCoverItem, setActiveCoverItem } = useMovieDiary();
  const coverRef = useRef<HTMLDivElement>(null);
  
  const [dragState, setDragState] = useState<{
    item: string | null;
    type: 'move' | 'rotate' | 'resize' | null;
    centerX: number;
    centerY: number;
    initialAngle: number;
    startRot: number;
    initialDist: number;
    startScale: number;
  }>({ item: null, type: null, centerX: 0, centerY: 0, initialAngle: 0, startRot: 0, initialDist: 0, startScale: 1 });
  
  const [hasDragged, setHasDragged] = useState<boolean>(false);

  const isClosed = diaryState === 'closed' || diaryState === 'closing';

  const startMove = (e: React.MouseEvent | React.TouchEvent, itemId: string) => {
    e.stopPropagation();
    setActiveCoverItem(itemId);
    setHasDragged(false);
    setDragState({ item: itemId, type: 'move', centerX: 0, centerY: 0, initialAngle: 0, startRot: 0, initialDist: 0, startScale: 1 });
  };

  const startRotate = (e: React.MouseEvent | React.TouchEvent, itemId: string, currentRot: number) => {
    e.stopPropagation();
    setActiveCoverItem(itemId);
    setHasDragged(true);

    const target = e.currentTarget as HTMLElement;
    const box = target.closest('.cover-editable-box')?.getBoundingClientRect();
    if (!box) return;
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rad = Math.atan2(clientY - centerY, clientX - centerX);
    const initialAngle = rad * (180 / Math.PI);

    setDragState({
      item: itemId,
      type: 'rotate',
      centerX,
      centerY,
      initialAngle,
      startRot: currentRot,
      initialDist: 0,
      startScale: 1,
    });
  };

  const startResize = (e: React.MouseEvent | React.TouchEvent, itemId: string, currentScale: number) => {
    e.stopPropagation();
    setActiveCoverItem(itemId);
    setHasDragged(true);

    const target = e.currentTarget as HTMLElement;
    const box = target.closest('.cover-editable-box')?.getBoundingClientRect();
    if (!box) return;
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const initialDist = Math.hypot(clientX - centerX, clientY - centerY);

    setDragState({
      item: itemId,
      type: 'resize',
      centerX,
      centerY,
      initialAngle: 0,
      startRot: 0,
      initialDist: Math.max(15, initialDist),
      startScale: currentScale || 1,
    });
  };

  useEffect(() => {
    if (!dragState.item || !dragState.type) return;

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (dragState.type === 'move') {
        if (!coverRef.current) return;
        const rect = coverRef.current.getBoundingClientRect();
        const rawX = ((clientX - rect.left) / rect.width) * 100;
        const rawY = ((clientY - rect.top) / rect.height) * 100;

        const x = Math.max(5, Math.min(95, Math.round(rawX * 10) / 10));
        const y = Math.max(5, Math.min(95, Math.round(rawY * 10) / 10));

        setHasDragged(true);

        if (dragState.item === 'title') {
          setCoverCustomization((prev) => ({
            ...prev,
            titlePos: { ...(prev.titlePos || { x: 50, y: 35, rot: 0, scale: 1 }), x, y },
          }));
        } else if (dragState.item?.startsWith('text_')) {
          setCoverCustomization((prev) => ({
            ...prev,
            customTexts: (prev.customTexts || []).map((t) => (t.id === dragState.item ? { ...t, x, y } : t)),
          }));
        } else {
          setCoverCustomization((prev) => {
            const current = prev.stickerPos?.[dragState.item!] || { x, y, rot: 0, scale: 1 };
            return {
              ...prev,
              stickerPos: {
                ...(prev.stickerPos || {}),
                [dragState.item!]: { ...current, x, y },
              },
            };
          });
        }
      } else if (dragState.type === 'rotate') {
        const rad = Math.atan2(clientY - dragState.centerY, clientX - dragState.centerX);
        const currentAngle = rad * (180 / Math.PI);
        const deltaAngle = currentAngle - dragState.initialAngle;
        const newRot = Math.round((dragState.startRot + deltaAngle) % 360);

        setHasDragged(true);

        if (dragState.item === 'title') {
          setCoverCustomization((prev) => ({
            ...prev,
            titlePos: { ...(prev.titlePos || { x: 50, y: 35, scale: 1 }), rot: newRot },
          }));
        } else if (dragState.item?.startsWith('text_')) {
          setCoverCustomization((prev) => ({
            ...prev,
            customTexts: (prev.customTexts || []).map((t) => (t.id === dragState.item ? { ...t, rot: newRot } : t)),
          }));
        } else {
          setCoverCustomization((prev) => {
            const current = prev.stickerPos?.[dragState.item!] || { x: 50, y: 50, rot: 0, scale: 1 };
            return {
              ...prev,
              stickerPos: {
                ...(prev.stickerPos || {}),
                [dragState.item!]: { ...current, rot: newRot },
              },
            };
          });
        }
      } else if (dragState.type === 'resize') {
        const currentDist = Math.hypot(clientX - dragState.centerX, clientY - dragState.centerY);
        const ratio = currentDist / dragState.initialDist;
        const newScale = Math.max(0.35, Math.min(3.5, Math.round((dragState.startScale * ratio) * 100) / 100));

        setHasDragged(true);

        if (dragState.item === 'title') {
          setCoverCustomization((prev) => ({
            ...prev,
            titlePos: { ...(prev.titlePos || { x: 50, y: 35, rot: 0, scale: 1 }), scale: newScale },
          }));
        } else if (dragState.item?.startsWith('text_')) {
          setCoverCustomization((prev) => ({
            ...prev,
            customTexts: (prev.customTexts || []).map((t) => (t.id === dragState.item ? { ...t, scale: newScale } : t)),
          }));
        } else {
          setCoverCustomization((prev) => {
            const current = prev.stickerPos?.[dragState.item!] || { x: 50, y: 50, rot: 0, scale: 1 };
            return {
              ...prev,
              stickerPos: {
                ...(prev.stickerPos || {}),
                [dragState.item!]: { ...current, scale: newScale },
              },
            };
          });
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onEnd = () => {
      setDragState({ item: null, type: null, centerX: 0, centerY: 0, initialAngle: 0, startRot: 0, initialDist: 0, startScale: 1 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [dragState, setCoverCustomization]);

  const removeItem = (e: React.MouseEvent | React.TouchEvent, itemId: string) => {
    e.stopPropagation();
    setActiveCoverItem(null);
    if (itemId === 'title') {
      setCoverCustomization((prev) => ({ ...prev, title: '' }));
    } else if (itemId.startsWith('text_')) {
      setCoverCustomization((prev) => ({
        ...prev,
        customTexts: (prev.customTexts || []).filter((t) => t.id !== itemId),
      }));
    } else {
      setCoverCustomization((prev) => ({
        ...prev,
        stickers: prev.stickers.filter((s) => s !== itemId),
      }));
    }
  };

  const confirmItem = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveCoverItem(null);
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch h-full w-full min-h-0 overflow-visible relative">
      
      {/* 📖 LEFT PANEL 3D HINGE CONTAINER (pivots 180 degrees over to the right side around binder axis!) */}
      <div className="flex-1 min-h-0 min-w-0 flex flex-col w-full lg:w-[calc(50%-12px)] h-full z-40 relative">
        {/* Single 3D Card Wrapper (#left-panel controlled by .notebook-wrapper.closed #left-panel) */}
        <div id="left-panel" className="w-full h-full relative">
          
          {/* FRONT FACE (.page-front - Left Page Interior Table of Contents / Calendar) */}
          <div className={`page-front overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 diary-paper-texture bg-[var(--surface-card)] shadow-2xl rounded-l-3xl border-y-2 border-l-2 border-[var(--border-color)] flex flex-col ${isClosed ? 'pointer-events-none' : ''}`}>
            <div className="flex-1 min-h-0 flex flex-col w-full h-full overflow-hidden">
              {leftPage}
            </div>
          </div>

          {/* BACK FACE (.page-back - Solid Color Outer Notebook Cover with Edit Mode & Graphic Stickers!) */}
          <div 
            ref={coverRef}
            onClick={() => {
              if (activeCoverItem !== null) {
                setActiveCoverItem(null);
              } else if (isClosed && !hasDragged) {
                setDiaryState('open');
              }
            }}
            style={{
              backgroundColor: coverCustomization?.color && coverCustomization.color !== 'default'
                ? coverCustomization.color
                : undefined,
            }}
            title={activeCoverItem ? "Click background to deselect item" : "Click anywhere on empty cover to smoothly slide out and unfold diary"}
            className="page-back rounded-r-3xl rounded-l-md border-4 border-black/20 dark:border-white/10 shadow-[25px_25px_60px_rgba(0,0,0,0.65)] cursor-pointer overflow-hidden select-none relative"
          >
            {/* Primary Custom Title Inscription (w-fit so box is just the right size!) */}
            {coverCustomization?.title ? (() => {
              const pos = coverCustomization.titlePos || { x: 50, y: 35, rot: 0, scale: 1 };
              const isEditing = activeCoverItem === 'title';

              return (
                <div 
                  onMouseDown={(e) => startMove(e, 'title')}
                  onTouchStart={(e) => startMove(e, 'title')}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeCoverItem !== 'title') setActiveCoverItem('title');
                  }}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `translate(-50%, -50%) rotate(${pos.rot ?? 0}deg)`,
                  }}
                  className={`cover-editable-box absolute z-20 w-fit max-w-[90%] px-3.5 py-1.5 rounded-2xl transition-shadow cursor-move select-none ${
                    isEditing 
                      ? 'ring-2 ring-dashed ring-amber-400 dark:ring-amber-300 z-50' 
                      : 'hover:ring-1 hover:ring-dashed hover:ring-white/40'
                  }`}
                  title="Click to edit or drag to reposition title"
                >
                  {isEditing && (
                    <>
                      {/* Top-Right: X Delete Button */}
                      <button
                        onClick={(e) => removeItem(e, 'title')}
                        onTouchEnd={(e) => removeItem(e, 'title')}
                        title="Delete text"
                        className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-pointer"
                      >
                        <X className="w-4 h-4 stroke-[3]" />
                      </button>

                      {/* Top-Left: Check Confirm Button */}
                      <button
                        onClick={confirmItem}
                        onTouchEnd={confirmItem}
                        title="Done editing"
                        className="absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      {/* Bottom-Left: Size Adjuster / Resize Handle */}
                      <div
                        onMouseDown={(e) => startResize(e, 'title', pos.scale ?? 1)}
                        onTouchStart={(e) => startResize(e, 'title', pos.scale ?? 1)}
                        title="Hold corner and move mouse to adjust text size"
                        className="absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-nesw-resize active:cursor-nesw-resize"
                      >
                        <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                      </div>

                      {/* Bottom-Right: Rotate Handle */}
                      <div
                        onMouseDown={(e) => startRotate(e, 'title', pos.rot ?? 0)}
                        onTouchStart={(e) => startRotate(e, 'title', pos.rot ?? 0)}
                        title="Click and drag to rotate text"
                        className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-grab active:cursor-grabbing"
                      >
                        <RotateCw className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </>
                  )}

                  <h2 
                    style={{ 
                      color: coverCustomization.titleColor || '#FFFFFF', 
                      fontFamily: getFontFamily(coverCustomization.titleFont),
                      fontSize: `${Math.max(1, Math.min(6, Math.round((pos.scale ?? 1) * 2.2 * 10) / 10))}rem`,
                      lineHeight: 1.2,
                      pointerEvents: 'none' 
                    }}
                    className="font-black tracking-wide drop-shadow-md text-center whitespace-nowrap sm:whitespace-normal"
                  >
                    {coverCustomization.title}
                  </h2>
                </div>
              );
            })() : null}

            {/* Additional Custom Text Inscriptions (With Full Edit Mode, Resize, Move, & Rotate!) */}
            {coverCustomization?.customTexts && coverCustomization.customTexts.length > 0 ? (
              coverCustomization.customTexts.map((txt) => {
                const isEditing = activeCoverItem === txt.id;
                const scale = txt.scale ?? 0.75;

                return (
                  <div
                    key={txt.id}
                    onMouseDown={(e) => startMove(e, txt.id)}
                    onTouchStart={(e) => startMove(e, txt.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeCoverItem !== txt.id) setActiveCoverItem(txt.id);
                    }}
                    style={{
                      left: `${txt.x}%`,
                      top: `${txt.y}%`,
                      transform: `translate(-50%, -50%) rotate(${txt.rot ?? 0}deg)`,
                    }}
                    className={`cover-editable-box absolute z-20 w-fit max-w-[90%] px-3 sm:px-4 py-1.5 rounded-2xl transition-shadow cursor-move select-none ${
                      isEditing 
                        ? 'ring-2 ring-dashed ring-amber-400 dark:ring-amber-300 z-50' 
                        : 'hover:ring-1 hover:ring-dashed hover:ring-white/40'
                    }`}
                    title="Click to edit or drag to reposition text"
                  >
                    {isEditing && (
                      <>
                        {/* Top-Right: X Delete Button */}
                        <button
                          onClick={(e) => removeItem(e, txt.id)}
                          onTouchEnd={(e) => removeItem(e, txt.id)}
                          title="Delete text"
                          className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-pointer"
                        >
                          <X className="w-4 h-4 stroke-[3]" />
                        </button>

                        {/* Top-Left: Check Confirm Button */}
                        <button
                          onClick={confirmItem}
                          onTouchEnd={confirmItem}
                          title="Done editing"
                          className="absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-pointer"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        {/* Bottom-Left: Size Adjuster / Resize Handle */}
                        <div
                          onMouseDown={(e) => startResize(e, txt.id, scale)}
                          onTouchStart={(e) => startResize(e, txt.id, scale)}
                          title="Hold corner and move mouse to adjust text size"
                          className="absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-nesw-resize active:cursor-nesw-resize"
                        >
                          <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                        </div>

                        {/* Bottom-Right: Rotate Handle */}
                        <div
                          onMouseDown={(e) => startRotate(e, txt.id, txt.rot ?? 0)}
                          onTouchStart={(e) => startRotate(e, txt.id, txt.rot ?? 0)}
                          title="Click and drag to rotate text"
                          className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-grab active:cursor-grabbing"
                        >
                          <RotateCw className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </>
                    )}

                    <h3 
                      style={{ 
                        color: txt.color || '#FFFFFF', 
                        fontFamily: getFontFamily(txt.font),
                        fontSize: `${Math.max(0.8, Math.min(6, Math.round(scale * 2.0 * 10) / 10))}rem`,
                        lineHeight: 1.2,
                        pointerEvents: 'none' 
                      }}
                      className="font-black tracking-wide drop-shadow-md text-center whitespace-nowrap sm:whitespace-normal"
                    >
                      {txt.text}
                    </h3>
                  </div>
                );
              })
            ) : null}

            {/* Sticker Decals (Graphic Die-Cut Images with Full Edit Mode, Resize, & Rotation!) */}
            {coverCustomization?.stickers && coverCustomization.stickers.length > 0 ? (
              <div id="cover-sticker-zone" className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                {coverCustomization.stickers.map((stickerPath, idx) => {
                  const pos = coverCustomization.stickerPos?.[stickerPath] || {
                    x: 25 + ((idx * 22) % 55),
                    y: 65 + ((idx * 15) % 25),
                    rot: (idx % 2 === 0 ? 1 : -1) * ((idx * 8) % 24),
                    scale: 1,
                  };
                  const isEditing = activeCoverItem === stickerPath;

                  return (
                    <div
                      key={stickerPath}
                      onMouseDown={(e) => startMove(e, stickerPath)}
                      onTouchStart={(e) => startMove(e, stickerPath)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeCoverItem !== stickerPath) setActiveCoverItem(stickerPath);
                      }}
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: `translate(-50%, -50%) rotate(${pos.rot ?? 0}deg)`,
                      }}
                      title="Click to enter edit mode or drag to move sticker"
                      className={`cover-editable-box absolute p-2 pointer-events-auto cursor-move select-none transition-shadow rounded-2xl ${
                        isEditing 
                          ? 'ring-2 ring-dashed ring-amber-400 dark:ring-amber-300 z-50 scale-105' 
                          : 'hover:scale-105 z-30'
                      }`}
                    >
                      {isEditing && (
                        <>
                          {/* Top-Right: X Delete Button */}
                          <button
                            onClick={(e) => removeItem(e, stickerPath)}
                            onTouchEnd={(e) => removeItem(e, stickerPath)}
                            title="Remove sticker"
                            className="absolute -top-3 -right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                          </button>

                          {/* Top-Left: Check Confirm Button */}
                          <button
                            onClick={confirmItem}
                            onTouchEnd={confirmItem}
                            title="Done editing sticker"
                            className="absolute -top-3 -left-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                          </button>

                          {/* Bottom-Left: Size Adjuster / Resize Handle */}
                          <div
                            onMouseDown={(e) => startResize(e, stickerPath, pos.scale ?? 1)}
                            onTouchStart={(e) => startResize(e, stickerPath, pos.scale ?? 1)}
                            title="Hold corner and move mouse to resize sticker"
                            className="absolute -bottom-3 -left-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-nesw-resize active:cursor-nesw-resize"
                          >
                            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                          </div>

                          {/* Bottom-Right: Rotate Handle */}
                          <div
                            onMouseDown={(e) => startRotate(e, stickerPath, pos.rot ?? 0)}
                            onTouchStart={(e) => startRotate(e, stickerPath, pos.rot ?? 0)}
                            title="Click and drag to rotate sticker"
                            className="absolute -bottom-3 -right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 z-[60] cursor-grab active:cursor-grabbing"
                          >
                            <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                          </div>
                        </>
                      )}

                      <img
                        src={stickerPath}
                        alt="Placed Die-Cut Sticker"
                        style={{
                          width: `${Math.round((pos.scale ?? 1) * 85)}px`,
                          height: `${Math.round((pos.scale ?? 1) * 85)}px`,
                          maxWidth: 'none',
                          maxHeight: 'none',
                        }}
                        className="placed-sticker pointer-events-none block object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

        </div>
      </div>

      {/* 🔗 CENTER RING BINDER SPINE (The exact pivot line! Fades away when closed so only solid cover remains) */}
      <div className={`hidden lg:flex w-6 shrink-0 h-full center-ring-spine diary-paper-texture bg-[var(--surface-card)] shadow-inner flex-col justify-between py-8 items-center z-30 select-none border-x border-y-2 border-[var(--border-color)] transition-opacity duration-500 ${isClosed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="binder-ring my-1 shadow-xs transform hover:scale-105 transition-transform" />
        ))}
      </div>

      {/* 📖 RIGHT PAGE CONTAINER (Fades underneath as cover folds over it so ONLY the solid book cover can be seen!) */}
      <div className={`flex-1 min-h-0 min-w-0 flex flex-col w-full lg:w-[calc(50%-12px)] h-full overflow-hidden px-4 sm:px-6 lg:px-8 py-4 sm:py-6 diary-paper-texture bg-[var(--surface-card)] shadow-2xl z-10 rounded-r-3xl border-y-2 border-r-2 border-[var(--border-color)] transition-opacity duration-500 ${isClosed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex-1 min-h-0 flex flex-col w-full h-full overflow-hidden">
          {rightPage}
        </div>
      </div>

    </div>
  );
};



