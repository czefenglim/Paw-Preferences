'use client';

/**
 * FilterBar Component
 * Updated: Now includes advanced HSL, RGB, and Dimension filters
 * Provides a highly interactive and visual cat discovery experience
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTags } from '../utils/api';
import { Filter, X, Sparkles, Check, RotateCcw, Sliders, Palette, Maximize, PaletteIcon } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterBarProps {
  onApplyFilters: (options: FilterOptions) => void;
  isLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function FilterBar({ onApplyFilters, isLoading, isOpen, setIsOpen }: FilterBarProps) {
  const [tags, setTags] = useState<string[]>([]);
  
  // Basic Filters
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');

  // Advanced HSL
  const [brightness, setBrightness] = useState<number | undefined>(undefined);
  const [saturation, setSaturation] = useState<number | undefined>(undefined);
  const [hue, setHue] = useState<number | undefined>(undefined);
  const [lightness, setLightness] = useState<number | undefined>(undefined);

  // Advanced RGB
  const [red, setRed] = useState<number | undefined>(undefined);
  const [green, setGreen] = useState<number | undefined>(undefined);
  const [blue, setBlue] = useState<number | undefined>(undefined);

  // Dimensions
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const loadTags = async () => {
      const allTags = await fetchTags();
      setTags(allTags.filter(t => t && t.length < 15));
    };
    loadTags();
  }, []);

  const handleApply = () => {
    onApplyFilters({
      tag: selectedTag || undefined,
      filter: (selectedFilter as any) || undefined,
      text: customText || undefined,
      brightness,
      saturation,
      hue,
      lightness,
      red,
      green,
      blue,
      width,
      height
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedTag('');
    setSelectedFilter('');
    setCustomText('');
    setBrightness(undefined);
    setSaturation(undefined);
    setHue(undefined);
    setLightness(undefined);
    setRed(undefined);
    setGreen(undefined);
    setBlue(undefined);
    setWidth(undefined);
    setHeight(undefined);
    onApplyFilters({});
    setIsOpen(false);
  };

  const hasActiveFilters = selectedTag || selectedFilter || customText || 
    brightness !== undefined || saturation !== undefined || hue !== undefined || 
    lightness !== undefined || red !== undefined || green !== undefined || blue !== undefined ||
    width !== undefined || height !== undefined;

  return (
    <div className="w-full max-w-sm mb-6 z-40">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="w-full bg-white/90 backdrop-blur-xl border-2 border-purple-200 rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-xl hover:shadow-2xl transition-all group"
      >
        <div className="flex items-center gap-3 text-purple-700 font-black">
          <div className="bg-purple-100 p-2 rounded-xl group-hover:bg-purple-200 transition-colors">
            <Filter size={20} />
          </div>
          <span className="text-lg">Discovery Settings</span>
           {hasActiveFilters && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          )}
        </div>
        <div className="text-purple-300 group-hover:text-purple-500 transition-colors font-black text-xs uppercase tracking-widest">
          Adjust
        </div>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-purple-900/60 backdrop-blur-md z-[60]"
            />

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed inset-x-4 bottom-4 md:inset-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:max-w-2xl lg:max-w-4xl md:mx-auto bg-white rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.3)] z-[70] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-8 lg:p-12 border-b border-purple-50 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                <div>
                  <h2 className="text-3xl lg:text-5xl font-black text-purple-900 tracking-tight">Cat Customizer</h2>
                  <p className="text-sm lg:text-lg text-purple-500 font-bold mt-1">Advanced discovery & image filtering</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-2xl flex items-center justify-center text-purple-400 hover:text-purple-900 shadow-sm transition-colors border border-purple-100"
                >
                  <X className="w-6 h-6 lg:w-8 lg:h-8" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 lg:space-y-16 custom-scrollbar pb-32 lg:pb-40">
                
                {/* Mode & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                  {/* Effects Toggle */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 lg:p-10 rounded-[2.5rem] border-2 border-blue-100/50 flex-1">
                    <div className="flex flex-col gap-4 lg:gap-6">
                      <div className="flex items-center gap-3 lg:gap-5">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-lg border border-blue-50">
                          <PaletteIcon className="w-6 h-6 lg:w-8 lg:h-8" />
                        </div>
                        <div>
                          <h3 className="text-lg lg:text-2xl font-black text-blue-900 leading-none">Photo Effects</h3>
                          <p className="text-[10px] lg:text-xs text-blue-700/60 font-bold mt-1 uppercase tracking-wider">Presets</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {['', 'mono', 'blur', 'negate'].map((f) => (
                          <button
                            key={f}
                            onClick={() => setSelectedFilter(f)}
                            className={`px-4 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all border-2 ${
                              selectedFilter === f 
                              ? 'bg-blue-600 text-white border-blue-400 shadow-lg' 
                              : 'bg-white text-blue-500 border-blue-50 hover:bg-blue-50'
                            }`}
                          >
                            {f === '' ? 'Normal' : f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* HSL Controls */}
                <section>
                  <label className="flex items-center gap-2 text-xs lg:text-base font-black uppercase tracking-[.2em] text-purple-400 mb-6 lg:mb-10 ml-2">
                    <Sliders className="w-3.5 h-3.5 lg:w-5 lg:h-5" /> Style Adjustments (HSL)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-6 lg:gap-y-10 px-2 lg:px-4">
                    {[
                      { label: 'Brightness', val: brightness, set: setBrightness, min: -1, max: 1, step: 0.1 },
                      { label: 'Saturation', val: saturation, set: setSaturation, min: 0, max: 2, step: 0.1 },
                      { label: 'Hue', val: hue, set: setHue, min: 0, max: 360, step: 1 },
                      { label: 'Lightness', val: lightness, set: setLightness, min: -1, max: 1, step: 0.1 }
                    ].map(ctrl => (
                      <div key={ctrl.label} className="space-y-3 lg:space-y-5">
                        <div className="flex justify-between items-center text-[10px] lg:text-sm font-black text-purple-900 border-l-2 lg:border-l-4 border-purple-200 pl-3 lg:pl-5">
                          <span>{ctrl.label.toUpperCase()}</span>
                          <span className="text-purple-400 bg-purple-50 px-2 lg:px-3 py-0.5 lg:py-1 rounded-md lg:rounded-lg">
                            {ctrl.val !== undefined ? ctrl.val : 'Auto'}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min={ctrl.min} max={ctrl.max} step={ctrl.step} 
                          value={ctrl.val ?? (ctrl.max + ctrl.min) / 2}
                          onChange={(e) => ctrl.set(parseFloat(e.target.value))}
                          className="w-full accent-purple-600 h-1.5 lg:h-2.5 bg-purple-50 rounded-full cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* RGB Controls */}
                <section>
                  <label className="flex items-center gap-2 text-xs lg:text-base font-black uppercase tracking-[.2em] text-pink-400 mb-6 lg:mb-10 ml-2">
                    <Palette className="w-3.5 h-3.5 lg:w-5 lg:h-5" /> Color Filtering (RGB)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 px-2 lg:px-4">
                    {[
                      { label: 'Red', val: red, set: setRed, color: 'bg-red-500' },
                      { label: 'Green', val: green, set: setGreen, color: 'bg-green-500' },
                      { label: 'Blue', val: blue, set: setBlue, color: 'bg-blue-500' }
                    ].map(ctrl => (
                      <div key={ctrl.label} className="space-y-3 lg:space-y-5">
                        <div className="flex justify-between items-center text-[10px] lg:text-sm font-black text-gray-900">
                          <span className="flex items-center gap-2 lg:gap-3">
                            <span className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${ctrl.color}`} />
                            {ctrl.label.toUpperCase()}
                          </span>
                          <span className="text-gray-400">{ctrl.val ?? 'Off'}</span>
                        </div>
                        <input 
                          type="range" min="0" max="255"
                          value={ctrl.val ?? 128}
                          onChange={(e) => ctrl.set(parseInt(e.target.value))}
                          className={`w-full h-1.5 lg:h-2.5 bg-gray-100 rounded-full cursor-pointer accent-gray-900`}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dimensions */}
                <section>
                  <label className="flex items-center gap-2 text-xs lg:text-base font-black uppercase tracking-[.2em] text-blue-400 mb-6 lg:mb-10 ml-2">
                    <Maximize className="w-3.5 h-3.5 lg:w-5 lg:h-5" /> Specific Dimensions
                  </label>
                  <div className="flex gap-4 lg:gap-6">
                    <div className="flex-1 relative">
                       <input
                        type="number" placeholder="Width"
                        value={width ?? ''}
                        onChange={(e) => setWidth(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-6 lg:px-10 py-4 lg:py-6 bg-gray-50 border-2 border-gray-100 rounded-2xl lg:rounded-[2rem] text-sm lg:text-xl font-bold focus:border-blue-300 outline-none"
                      />
                      <span className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 text-[10px] lg:text-xs font-black text-gray-300">W</span>
                    </div>
                    <div className="flex-1 relative">
                       <input
                        type="number" placeholder="Height"
                        value={height ?? ''}
                        onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-6 lg:px-10 py-4 lg:py-6 bg-gray-50 border-2 border-gray-100 rounded-2xl lg:rounded-[2rem] text-sm lg:text-xl font-bold focus:border-blue-300 outline-none"
                      />
                      <span className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 text-[10px] lg:text-xs font-black text-gray-300">H</span>
                    </div>
                  </div>
                </section>

                {/* Tags Tags Tags */}
                <section>
                  <label className="text-xs lg:text-base font-black uppercase tracking-[.2em] text-purple-400 block mb-4 lg:mb-6 ml-2">Personality & Tags</label>
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <button
                      onClick={() => setSelectedTag('')}
                      className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-xs lg:text-base font-black transition-all ${
                        selectedTag === '' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-400'
                      }`}
                    >
                      All Types
                    </button>
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-xs lg:text-base font-black transition-all ${
                          selectedTag === tag ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-50 text-pink-500'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Custom Text */}
                <section>
                  <label className="text-xs lg:text-base font-black uppercase tracking-[.2em] text-purple-400 block mb-4 lg:mb-6 ml-2">Captions</label>
                  <div className="relative">
                    <input
                      type="text" placeholder="Cat says something..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-6 lg:px-10 py-4 lg:py-6 bg-purple-50/50 border-2 border-purple-100 rounded-2xl lg:rounded-[2rem] text-sm lg:text-xl font-bold text-purple-900 focus:border-purple-300 focus:bg-white outline-none transition-all"
                    />
                    {customText && (
                      <button onClick={() => setCustomText('')} className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 text-purple-300"><X className="w-4 h-4 lg:w-6 lg:h-6" /></button>
                    )}
                  </div>
                </section>
              </div>

              {/* Actions Footer */}
              <div className="absolute bottom-0 inset-x-0 p-8 lg:p-12 bg-white/90 backdrop-blur-md border-t border-purple-50 flex gap-4 lg:gap-6 z-20">
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 lg:py-6 bg-gray-100 text-gray-500 rounded-2xl lg:rounded-[2rem] font-black text-xs lg:text-base uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 lg:gap-3"
                >
                  <RotateCcw className="w-4 h-4 lg:w-6 lg:h-6" /> Reset
                </button>
                <button
                  onClick={handleApply}
                  disabled={isLoading}
                  className="flex-[2] py-4 lg:py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl lg:rounded-[2rem] font-black text-xs lg:text-base uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2 lg:gap-3"
                >
                  {isLoading ? 'Summoning...' : 'Fetch Kitties'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
