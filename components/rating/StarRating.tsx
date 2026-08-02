"use client";

import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (newRating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showTooltip?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 'md',
  interactive = false,
  showTooltip = true,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const sizeMap = {
    sm: 16,
    md: 22,
    lg: 28,
  };

  const iconSize = sizeMap[size];

  const getTooltipText = (val: number): string => {
    if (val === 0) return 'Tap to score';
    if (val <= 1.5) return `${val.toFixed(1)} ★ - Gentle Pass`;
    if (val <= 2.5) return `${val.toFixed(1)} ★ - Sunday Afternoon Watch`;
    if (val <= 3.5) return `${val.toFixed(1)} ★ - Cozy & Enjoyable 🍵`;
    if (val <= 4.5) return `${val.toFixed(1)} ★ - Absolute Pearl ✨`;
    return `${val.toFixed(1)} ★ - Masterpiece & Obsession 🌸`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    const computed = isHalf ? starIndex - 0.5 : starIndex;
    setHoverRating(computed);
  };

  const handleClick = () => {
    if (interactive && onRatingChange && hoverRating !== null) {
      onRatingChange(hoverRating);
    }
  };

  return (
    <div 
      className="inline-flex items-center gap-2 select-none"
      onMouseLeave={() => interactive && setHoverRating(null)}
    >
      <div className="flex items-center gap-1" onClick={handleClick}>
        {[1, 2, 3, 4, 5].map((index) => {
          const fillPercentage = Math.min(Math.max((activeRating - (index - 1)) * 100, 0), 100);

          return (
            <div
              key={index}
              className={`relative flex items-center justify-center transition-transform duration-150 ${
                interactive ? 'cursor-pointer hover:scale-125' : ''
              }`}
              style={{ width: iconSize, height: iconSize }}
              onMouseMove={(e) => handleMouseMove(e, index)}
            >
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                className="overflow-visible"
              >
                <defs>
                  <linearGradient id={`grad-${index}-${activeRating}-${iconSize}`}>
                    <stop offset={`${fillPercentage}%`} stopColor="var(--accent-star, #FFB800)" />
                    <stop offset={`${fillPercentage}%`} stopColor="var(--border-color, #E5D6CD)" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#grad-${index}-${activeRating}-${iconSize})`}
                  stroke="var(--accent-star, #FFB800)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  style={{
                    filter: fillPercentage > 0 ? 'drop-shadow(0 2px 4px rgba(255, 184, 0, 0.25))' : 'none',
                    transition: 'fill 0.1s ease',
                  }}
                />
              </svg>
            </div>
          );
        })}
      </div>

      {showTooltip && (
        <span className={`font-medium transition-colors ${
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        } text-[var(--text-secondary)] bg-[var(--surface-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--border-color)] shadow-2xs`}>
          {getTooltipText(activeRating)}
        </span>
      )}
    </div>
  );
};
