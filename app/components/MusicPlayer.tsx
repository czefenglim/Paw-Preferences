'use client';

/**
 * MusicPlayer Component
 * Handles background music and provides a floating control toggle
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle auto-play (Browser policy may block this until first interaction)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Low default volume
      
      const startAudio = () => {
        if (!audioRef.current) return;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio started successfully.");
              setIsPlaying(true);
              setAudioError(null);
              // Clean up all trigger listeners
              ['click', 'touchstart', 'mousedown', 'keydown'].forEach(event => {
                window.removeEventListener(event, startAudio);
              });
            })
            .catch((err) => {
              // Silently fail if blocked, waiting for next interaction
              if (err.name !== 'NotAllowedError') {
                console.warn("Playback error:", err);
              }
            });
        }
      };

      // Try playing immediately
      startAudio();

      // Robust fallback: Listen for ANY common user interaction to kickstart audio
      ['click', 'touchstart', 'mousedown', 'keydown'].forEach(event => {
        window.addEventListener(event, startAudio, { once: true });
      });

      return () => {
        ['click', 'touchstart', 'mousedown', 'keydown'].forEach(event => {
          window.removeEventListener(event, startAudio);
        });
      };
    }
  }, []);

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const target = e.target as HTMLAudioElement;
    let errorMessage = "Unknown audio error";
    
    if (target.error) {
      switch (target.error.code) {
        case 1: errorMessage = "Aborted by user"; break;
        case 2: errorMessage = "Network error"; break;
        case 3: errorMessage = "Decoding failed (Corrupt file?)"; break;
        case 4: errorMessage = "Source not supported (File missing at /cat-song.mp3?)"; break;
      }
    }
    
    console.error("Audio Player Error:", errorMessage, target.error);
    setAudioError(errorMessage);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setAudioError(null);
              setIsPlaying(true);
            })
            .catch(err => {
              console.error("Manual play failed:", err);
              setAudioError("Playback failed - check console.");
            });
        }
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio
        ref={audioRef}
        src="/cat-song.mp3"
        autoPlay
        loop
        preload="auto"
        onError={handleAudioError}
      />
      
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-4 transition-colors ${
          audioError 
            ? 'bg-red-500 border-red-100 text-white'
            : isPlaying 
              ? 'bg-pink-500 border-pink-100 text-white' 
              : 'bg-white border-pink-50 text-pink-400 opacity-80'
        }`}
        aria-label={audioError ? 'Audio Error' : isPlaying ? 'Mute' : 'Play Music'}
      >
        <AnimatePresence mode="wait">
          {audioError ? (
            <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <VolumeX size={24} />
            </motion.div>
          ) : isPlaying ? (
            <motion.div
// ... rest of the component
              key="playing"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
            >
              <Volume2 size={24} />
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-white/20 rounded-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -45 }}
            >
              <VolumeX size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulsing indicator when playing */}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border-2 border-white"></span>
          </span>
        )}
      </motion.button>
      
      {/* Label for onboarding */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-2xl shadow-xl text-xs font-black text-pink-500 whitespace-nowrap border border-pink-50 pointer-events-none"
          >
           Tap for Kitty Music! 🎵
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
