'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Music, X, ChevronLeft, ChevronRight } from 'lucide-react';
import CatCard from './components/CatCard';
import Summary from './components/Summary';
import FilterBar from './components/FilterBar';
import BackgroundDecor from './components/BackgroundDecor';
import MusicPlayer from './components/MusicPlayer';
import { fetchCats } from './utils/api';
import { Cat, CatWithInteraction, SwipeDirection, FilterOptions } from './types';
import { CatCardHandle } from './components/CatCard';

const SESSION_SIZE = 20;

export default function Home() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState<CatWithInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const cardRef = useRef<CatCardHandle>(null);
  const flipSoundRef = useRef<HTMLAudioElement | null>(null);

  const loadCats = useCallback(async () => {
    setLoading(true);
    try {
      // API now uses a random skip value when skip is 0, ensuring a fresh set of random cats
      const fetchedCats = await fetchCats(SESSION_SIZE, filters, 0);
      setCats(fetchedCats);
      setCurrentIndex(0);
      setLikedCats([]);
    } catch (error) {
      console.error('Failed to load cats:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCats();
  }, [loadCats]);

  const handleSwipe = useCallback((direction: SwipeDirection | 'super') => {
    if (currentIndex >= cats.length) return;

    const currentCat = cats[currentIndex];
    const isLike = direction === 'right' || direction === 'super';

    // Play interaction sound
    if (flipSoundRef.current) {
      flipSoundRef.current.currentTime = 0;
      flipSoundRef.current.play().catch(() => {});
    }

    if (isLike) {
      setLikedCats(prev => [...prev, { ...currentCat, liked: true, timestamp: Date.now() }]);
    }
    
    setCurrentIndex(prev => prev + 1);
  }, [cats, currentIndex]);

  const handleRestart = useCallback(() => {
    loadCats();
  }, [loadCats]);

  const handleApplyFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const isComplete = cats.length > 0 && currentIndex >= cats.length && !loading;
  const dislikedCount = currentIndex - likedCats.length;

  if (isComplete) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        <BackgroundDecor />
        <Summary likedCats={likedCats} totalCats={currentIndex} onRestart={handleRestart} />
        <MusicPlayer />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 selection:bg-pink-200 overflow-hidden relative font-sans">
      <BackgroundDecor />
      
      {/* Header with Dashboard Stats */}
      <header className="relative w-full pt-3 pb-2 px-6 flex flex-col md:flex-row items-center justify-between gap-4 z-30 max-w-5xl mx-auto min-h-[80px]">
        <AnimatePresence>
          {!isFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3"
              >
                <motion.div 
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: -5, scale: 1 }}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-pink-100"
                >
                  <span className="text-2xl">🐱</span>
                </motion.div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-purple-900 tracking-tighter leading-none">
                    Paws <span className="text-pink-500">&</span> Preferences
                  </h1>
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mt-1">Discovery Dashboard</p>
                </div>
              </motion.div>

              {/* Stats Group - Responsive & Interactive */}
              <motion.div 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex bg-white/95 backdrop-blur-2xl px-2 py-2 rounded-[2.5rem] border-2 border-pink-100 shadow-2xl items-center"
              >
                <div className="flex items-center px-4 md:px-6 py-2 rounded-3xl group">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-tighter mb-0.5">Session</span>
                    <span className="text-2xl font-black text-purple-900 leading-none tabular-nums">{currentIndex}/{SESSION_SIZE}</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-pink-100/50 mx-1" />
                <motion.div 
                  key={`liked-${likedCats.length}`}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="flex items-center bg-green-50/50 px-4 md:px-6 py-2 rounded-3xl"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter mb-0.5">Liked</span>
                    <span className="text-2xl font-black text-green-600 leading-none tabular-nums">{likedCats.length}</span>
                  </div>
                </motion.div>
                <div className="w-px h-10 bg-pink-100/50 mx-1" />
                <motion.div 
                  key={`disliked-${dislikedCount}`}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="flex items-center bg-red-50/50 px-4 md:px-6 py-2 rounded-3xl"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter mb-0.5">Noped</span>
                    <span className="text-2xl font-black text-red-600 leading-none tabular-nums">{dislikedCount}</span>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Experience Area */}
      <main className="flex-1 flex flex-col items-center justify-between pb-2 px-4 w-full max-w-xl mx-auto relative z-10 overflow-hidden">
        <div className="w-full flex justify-center mt-1">
          <FilterBar 
            onApplyFilters={handleApplyFilters} 
            isLoading={loading} 
            isOpen={isFilterOpen} 
            setIsOpen={setIsFilterOpen} 
          />
        </div>

        {/* Improved Card Stack with Aspect Ratio Lock */}
        <div className="relative w-full aspect-[3/3.8] flex items-center justify-center perspective-1000 flex-1 my-1">
          <AnimatePresence mode="popLayout">
            {loading && cats.length === 0 ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full h-full flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl rounded-[3rem] border-4 border-white shadow-2xl z-50 overflow-hidden"
              >
                <div className="spinner mb-6 border-pink-500 border-t-transparent"></div>
                <h2 className="text-xl font-black text-purple-900 tracking-tight animate-pulse">Summoning Kitties...</h2>
                <p className="text-sm text-purple-400 font-bold mt-2">Checking the cat dimension</p>
              </motion.div>
            ) : cats.length > 0 && currentIndex < cats.length ? (
              cats
                .slice(currentIndex, currentIndex + 2)
                .reverse()
                .map((cat, index) => {
                  const isTop = index === (cats.slice(currentIndex, currentIndex + 2).length - 1);
                  return (
                    <CatCard
                      ref={isTop ? cardRef : undefined}
                      key={cat.id}
                      cat={cat}
                      onSwipe={handleSwipe}
                      isTopCard={isTop}
                    />
                  );
                })
            ) : !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-white/60 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-purple-200"
              >
                <motion.span 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  😿
                </motion.span>
                <h2 className="text-3xl font-black text-purple-900 mb-2">The Well is Dry!</h2>
                <p className="text-purple-400 font-bold mb-8">No more cats match these specific vibes.</p>
                <button
                  onClick={() => loadCats()}
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-[2rem] font-black shadow-[0_20px_40px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  Reset Universe
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gesture Guidance Footer (Replaced Buttons) */}
        <div className="w-full flex justify-center py-4 mb-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6 px-8 py-3 bg-white/40 backdrop-blur-xl border-2 border-white/60 rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2 text-red-500/80 font-black text-[10px] uppercase tracking-wider">
              <ChevronLeft size={16} strokeWidth={3} />
              Swipe Left to Nope
            </div>
            <div className="w-px h-4 bg-purple-200/50" />
            <div className="flex items-center gap-2 text-green-500/80 font-black text-[10px] uppercase tracking-wider">
              Swipe Right to Like
              <ChevronRight size={16} strokeWidth={3} />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Floating Music & System Audio */}
      <MusicPlayer />
      <audio ref={flipSoundRef} src="/flip.mp3" preload="auto" />
      
    </div>
  );
}
