/* eslint-disable react/no-unescaped-entities */
"use client";

import React from 'react';

export const BinderSpine: React.FC = () => {
  return (
    /* Stitched Leatherette Binder Spine Column stretching full vertical height with evenly spaced rings reaching the very bottom! */
    <div className="w-12 sm:w-16 journal-spine shrink-0 py-8 px-2 flex flex-col justify-between items-center z-20 select-none border-r-2 border-dashed border-[var(--border-color)] h-auto min-h-full">
      {[...Array(24)].map((_, i) => (
        <div key={i} className="flex items-center justify-center w-full shrink-0 my-1">
          <span className="binder-ring" title="Metal Binder Loop"></span>
        </div>
      ))}
    </div>
  );
};
