'use client';

/**
 * Summary Component
 * Displays all liked cats in a gorgeous gallery view with fun stats
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CatWithInteraction } from '../types';
import { RefreshCw, Heart, Zap, Award, X, ExternalLink, Download } from 'lucide-react';

interface SummaryProps {
  likedCats: CatWithInteraction[];
  totalCats: number;
  onRestart: () => void;
}

export default function Summary({ likedCats, totalCats, onRestart }: SummaryProps) {
  const [selectedCat, setSelectedCat] = useState<CatWithInteraction | null>(null);

  const dislikedCount = totalCats - likedCats.length;
  const loveRate = totalCats > 0 ? Math.round((likedCats.length / totalCats) * 100) : 0;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (url: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `cat-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: Just open in new tab
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 select-none">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-3 gradient-text drop-shadow-sm tracking-tight">
            Purr-fect Matches!
          </h1>
          <p className="text-lg text-purple-600 font-bold mb-6">
            You&apos;ve found your new best friends 🐾
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8">
            <StatCard 
              icon={<Heart className="text-pink-500" fill="currentColor" />} 
              value={likedCats.length} 
              label="Loved" 
              color="from-pink-500 to-rose-400"
            />
            <StatCard 
              icon={<X className="text-red-500" />} 
              value={dislikedCount} 
              label="Noped" 
              color="from-red-500 to-orange-400"
            />
            <StatCard 
              icon={<Zap className="text-purple-500" fill="currentColor" />} 
              value={totalCats} 
              label="Total" 
              color="from-purple-500 to-indigo-400"
            />
            <StatCard 
              icon={<Award className="text-blue-500" fill="currentColor" />} 
              value={`${loveRate}%`} 
              label="Love Rate" 
              color="from-blue-500 to-cyan-400"
            />
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-full font-black text-lg shadow-2xl hover:shadow-purple-200 transition-all"
          >
            <RefreshCw className="group-hover:rotate-180 transition-transform duration-700" />
            Find More Kitties!
          </motion.button>
        </motion.div>

        {/* Gallery Section */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-purple-900 tracking-tight">Your Collection</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-purple-200 to-transparent rounded-full" />
          </div>

          {likedCats.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {likedCats.map((cat) => (
                <motion.div
                  key={cat.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => setSelectedCat(cat)}
                  className="relative cursor-pointer group"
                >
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white glass card-shadow-hover">
                    <img
                      src={cat.url}
                      alt="Liked kitty"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Heart size={48} fill="white" className="text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1 overflow-hidden">
                    {cat.tags?.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white rounded-full text-[10px] font-black uppercase text-purple-500 border border-purple-100 whitespace-nowrap">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-[3rem] border-4 border-dashed border-purple-100">
              <span className="text-8xl block mb-6">😿</span>
              <p className="text-2xl font-black text-purple-300">
                Aww, no heart-throb yet? Get swiping!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal View */}
      <AnimatePresence>
        {selectedCat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedCat(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] max-w-2xl w-full max-h-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedCat(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                <X size={24} strokeWidth={3} />
              </button>
              
              <div className="aspect-square md:aspect-video w-full">
                <img src={selectedCat.url} className="w-full h-full object-cover" alt="Large kitty" />
              </div>
              
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <Heart className="text-pink-500" fill="currentColor" />
                  </div>
                  <h3 className="text-4xl font-black text-purple-900 tracking-tight">Meet Your Match</h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                  {selectedCat.tags?.map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-2xl font-bold text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleDownload(selectedCat.url)}
                    disabled={isDownloading}
                    className="flex-1 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-[2rem] font-black text-center flex items-center justify-center gap-3 shadow-xl hover:shadow-green-200 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <Download size={20} />
                    )}
                    {isDownloading ? 'Saving...' : 'Download Image'}
                  </button>

                  <a 
                    href={selectedCat.url}
                    target="_blank"
                    className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-[2rem] font-black text-center flex items-center justify-center gap-3 shadow-xl hover:shadow-purple-200 transition-all hover:scale-[1.02]"
                  >
                    <ExternalLink size={20} />
                    See Full Glory
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode, value: string | number, label: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-white glass flex flex-col items-center"
    >
      <div className="w-12 h-12 rounded-xl bg-white shadow-inner flex items-center justify-center mb-3 border border-gray-50">
        {icon}
      </div>
      <div className={`text-4xl font-black mb-1 bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </div>
    </motion.div>
  );
}
