'use client';

/**
 * CatCard Component
 * Displays a single cat card with smooth swipe animations powered by framer-motion
 */

import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, animate } from 'framer-motion';
import { Cat, SwipeDirection } from '../types';
import { Heart, X, Star, Sparkles } from 'lucide-react';

interface CatCardProps {
  cat: Cat;
  onSwipe: (direction: SwipeDirection) => void;
  isTopCard?: boolean;
}

export interface CatCardHandle {
  swipe: (direction: SwipeDirection) => void;
}

// Simple global cache to track loaded image URLs and prevent reload flicker
const loadedImages = new Set<string>();

const CatCard = forwardRef<CatCardHandle, CatCardProps>(({ cat, onSwipe, isTopCard = false }, ref) => {
  const [imageLoaded, setImageLoaded] = useState(loadedImages.has(cat.url));
  const x = useMotionValue(0);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Expose swipe method to parent
  useImperativeHandle(ref, () => ({
    swipe: (direction: SwipeDirection) => {
      if (!isTopCard) return;
      const targetX = direction === 'right' ? 500 : -500;
      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        onComplete: () => onSwipe(direction)
      });
    }
  }));

  // Transform horizontal movement to rotation and opacity
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
  
  // Overlay opacities (for Like/Dislike indicators)
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    }
  };

  const handleLoad = () => {
    loadedImages.add(cat.url);
    setImageLoaded(true);
  };

  useEffect(() => {
    // Check if browser already has it cached
    if (imgRef.current?.complete || loadedImages.has(cat.url)) {
      handleLoad();
      return;
    }

    // Reset image loaded state for new cats
    setImageLoaded(false);

    // Safety timeout: If image doesn't load in 10 seconds, clear the loader anyway
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [cat.id, cat.url]);

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={isTopCard ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={isTopCard ? { 
        scale: 1.02, 
        y: -5,
        transition: { type: 'spring', stiffness: 400, damping: 15 }
      } : {}}
      whileTap={isTopCard ? { scale: 1.02, cursor: 'grabbing' } : {}}
      className={`absolute inset-0 m-auto w-full max-w-[340px] h-full ${
        isTopCard ? 'z-20 cursor-grab' : 'z-10 scale-95 opacity-80 translate-y-4'
      }`}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white shadow-purple-200/50">
        {/* Loading Spinner */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col items-center justify-center z-50">
            <div className="text-6xl animate-bounce mb-4">🐱</div>
            <div className="spinner"></div>
            <p className="mt-4 text-purple-600 font-bold animate-pulse text-shadow">Meow is loading...</p>
          </div>
        )}

        {/* Dynamic Cat Image */}
        <img
          ref={imgRef}
          src={cat.url}
          alt="Gorgeous kitty"
          className={`w-full h-full object-cover select-none pointer-events-none transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
        />

        {/* LIKE OVERLAY */}
        <motion.div 
          style={{ opacity: likeOpacity }}
          className="absolute top-32 left-8 border-8 border-green-500 rounded-2xl px-6 py-2 rotate-[-15deg] pointer-events-none z-30"
        >
          <span className="text-5xl font-black text-green-500 drop-shadow-md">LIKE ❤️</span>
        </motion.div>

        {/* DISLIKE OVERLAY */}
        <motion.div 
          style={{ opacity: dislikeOpacity }}
          className="absolute top-32 right-8 border-8 border-red-500 rounded-2xl px-6 py-2 rotate-[15deg] pointer-events-none z-30"
        >
          <span className="text-5xl font-black text-red-500 drop-shadow-md">NOPE ❌</span>
        </motion.div>

        {/* FLOATING INFO BADGE (TOP) */}
        <div className="absolute top-6 left-6 right-6 z-40">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-xl flex items-center justify-between"
          >
            <div className="flex flex-col">
              <h3 className="text-xl font-black text-purple-900 tracking-tight flex items-center gap-2 text-shadow-sm">
                Kitty Discovery <Sparkles size={18} className="text-pink-500 fill-pink-500" />
              </h3>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {cat.tags && cat.tags.length > 0 ? (
                  cat.tags.slice(0, 3).map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-pink-500/10 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-pink-500/5"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="px-2.5 py-1 bg-purple-500/10 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-purple-500/5">
                    #Cute #Kitty
                  </span>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-lg rotate-6 border-2 border-white/20">
              {cat.id.substring(0, 2).toUpperCase()}
            </div>
          </motion.div>
        </div>

        {/* VIGNETTE (BOTTOM) */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
});

CatCard.displayName = 'CatCard';
export default CatCard;
