'use client';

/**
 * BackgroundDecor Component
 * Adds cute floating paw prints and yarn balls to the background
 * Fixed: Random values are generated on client only to prevent hydration mismatch
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PAW_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path d="M8.5,5C7.67,5,7,5.67,7,6.5S7.67,8,8.5,8S10,7.33,10,6.5S9.33,5,8.5,5z M12,1C10.9,1,10,1.9,10,3s0.9,2,2,2s2-0.9,2-2 S13.1,1,12,1z M15.5,5C14.67,5,14,5.67,14,6.5S14.67,8,15.5,8S17,7.33,17,6.5S16.33,5,15.5,5z M18,10c-1.1,0-2,0.9-2,2s0.9,2,2,2 s2-0.9,2-2S19.1,10,18,10z M6,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S7.1,10,6,10z M12,7c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3 s3-1.34,3-3C15,8.34,13.66,7,12,7z M12,15c-2.33,0-4.31,1.46-5.11,3.5C6.45,19.63,7.59,21,9,21h6c1.41,0,2.55-1.37,2.11-2.5 C16.31,16.46,14.33,15,12,15z" />
  </svg>
);

const YARN_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M15.5,9.5c0,1.93-1.57,3.5-3.5,3.5s-3.5-1.57-3.5-3.5S10.07,6,12,6S15.5,7.57,15.5,9.5z M13,17h-2v-2h2V17z M17,14h-2 v-2h2V14z M9,14H7v-2h2V14z" />
  </svg>
);

interface DecorItem {
  id: number;
  type: 'paw' | 'yarn' | 'cat';
  content?: string;
  size: number;
  left: number;
  initialY: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

const CAT_EMOJIS = ['🐱', '🐈', '😸', '😻', '😼', '😽'];

export default function BackgroundDecor() {
  const [items, setItems] = useState<DecorItem[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate items only on client to avoid hydration mismatch
    const newItems: DecorItem[] = Array.from({ length: 30 }).map((_, i) => {
      const typeNum = i % 3;
      const type = typeNum === 0 ? 'paw' : typeNum === 1 ? 'yarn' : 'cat';
      return {
        id: i,
        type,
        content: type === 'cat' ? CAT_EMOJIS[Math.floor(Math.random() * CAT_EMOJIS.length)] : undefined,
        size: Math.random() * 40 + 20,
        left: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 25 + 20,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.15 + 0.1,
      };
    });

    const newSparkles: Sparkle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));

    setItems(newItems);
    setSparkles(newSparkles);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ 
              y: `${item.initialY}vh`, 
              x: `${item.left}vw`, 
              opacity: 0,
              rotate: 0,
              scale: 0.8
            }}
            animate={{ 
              y: ['-20vh', '120vh'],
              rotate: 360,
              opacity: [0, item.opacity, item.opacity, 0],
              scale: [0.8, 1, 1, 0.8]
            }}
            transition={{ 
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear"
            }}
            className="absolute flex items-center justify-center"
            style={{ 
              width: item.size, 
              height: item.size,
              color: item.type === 'paw' ? '#f472b6' : item.type === 'yarn' ? '#7c3aed' : 'transparent',
              fontSize: item.type === 'cat' ? `${item.size}px` : undefined,
              opacity: 0.8 // Base opacity for the container
            }}
          >
            {item.type === 'paw' && PAW_ICON}
            {item.type === 'yarn' && YARN_ICON}
            {item.type === 'cat' && item.content}
          </motion.div>
        ))}
        
        {sparkles.map((sparkle) => (
          <motion.div
            key={`sparkle-${sparkle.id}`}
            initial={{ 
              y: `${sparkle.y}vh`, 
              x: `${sparkle.x}vw`,
              scale: 0
            }}
            animate={{ 
              scale: [0, 1.2, 0],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: "easeInOut"
            }}
            className="absolute w-2.5 h-2.5 bg-yellow-200 rounded-full blur-[1.5px]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
