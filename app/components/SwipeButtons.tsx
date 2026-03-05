'use client';

/**
 * SwipeButtons Component
 * Provides Like/Dislike/SuperLike buttons with yummy animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X, Star } from 'lucide-react';

interface SwipeButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  onSuperLike?: () => void;
  disabled?: boolean;
}

export default function SwipeButtons({ onLike, onDislike, onSuperLike, disabled = false }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-8 mt-4 mb-2">
      {/* Dislike Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDislike}
        disabled={disabled}
        className="group relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-red-50 hover:border-red-100 transition-colors disabled:opacity-50"
        aria-label="Dislike"
      >
        <X size={32} className="text-red-500 group-hover:rotate-12 transition-transform" />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-tighter text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Nope
        </span>
      </motion.button>

      {/* Super Like Button */}
      <motion.button
        whileHover={{ scale: 1.2, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSuperLike || onLike}
        disabled={disabled}
        className="group relative w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white z-10 disabled:opacity-50"
        aria-label="Super Like"
      >
        <Star size={36} fill="white" className="text-white animate-pulse" />
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping pointer-events-none" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Super Like!
        </span>
      </motion.button>

      {/* Like Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onLike}
        disabled={disabled}
        className="group relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-green-50 hover:border-green-100 transition-colors disabled:opacity-50"
        aria-label="Like"
      >
        <Heart size={32} fill="#22c55e" className="text-green-500 group-hover:scale-125 transition-transform" />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-tighter text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Love
        </span>
      </motion.button>
    </div>
  );
}
