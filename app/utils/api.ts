/**
 * Utility functions for fetching cat images from Cataas API
 * Base URL: https://cataas.com
 */

import { Cat, CataasApiResponse, FilterOptions } from '../types';

const BASE_URL = 'https://cataas.com';

/**
 * Fetch multiple cats from the Cataas API
 * @param limit - Number of cats to fetch
 * @param options - Optional filters
 * @param skip - Number of cats to skip (for pagination)
 * @returns Array of cat objects
 */
export async function fetchCats(
  limit: number = 10,
  options: FilterOptions = {},
  skip: number = 0
): Promise<Cat[]> {
  try {
    const { 
      tag, filter, text, 
      brightness, lightness, saturation, hue,
      red, green, blue,
      width, height 
    } = options;

    // Use a random skip value if skip is 0 to ensure randomness across sessions
    // Cataas has thousands of cats, skip=random(0-1000) is safe
    const effectiveSkip = skip === 0 ? Math.floor(Math.random() * 1000) : skip;

    const tagParam = tag ? `tags=${tag}` : '';
    const skipParam = `skip=${effectiveSkip}`;
    const limitParam = `limit=${limit}`;
    
    const queryParts = [tagParam, skipParam, limitParam].filter(Boolean);
    const url = `${BASE_URL}/api/cats?${queryParts.join('&')}`;
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cats');
    }
    
    const data: CataasApiResponse[] = await response.json();
    
    const cats = data.map((cat) => {
      // Standard URL for specific ID (works for both static and GIF if fetched correctly)
      let catUrl = `${BASE_URL}/cat/${cat.id}`;
      
      const params = new URLSearchParams();
      
      // Determine filter mode
      if (brightness || lightness || saturation || hue) {
        params.append('filter', 'custom');
        if (brightness !== undefined) params.append('brightness', brightness.toString());
        if (lightness !== undefined) params.append('lightness', lightness.toString());
        if (saturation !== undefined) params.append('saturation', saturation.toString());
        if (hue !== undefined) params.append('hue', hue.toString());
      } else if (red !== undefined || green !== undefined || blue !== undefined) {
        params.append('filter', 'custom');
        if (red !== undefined) params.append('r', red.toString());
        if (green !== undefined) params.append('g', green.toString());
        if (blue !== undefined) params.append('b', blue.toString());
      } else if (filter) {
        params.append('filter', filter);
      }

      if (width) params.append('width', width.toString());
      if (height) params.append('height', height.toString());
      
      if (text) catUrl += `/says/${encodeURIComponent(text)}`;
      
      // Add unique timestamp for cache busting and onLoad trigger
      params.append('t', Date.now().toString() + Math.random().toString(36).substring(7));
      
      const qs = params.toString();
      return {
        id: cat.id,
        url: qs ? `${catUrl}?${qs}` : catUrl,
        tags: cat.tags,
        owner: cat.owner,
        createdAt: cat.createdAt,
      };
    });

    // Background preloading for all fetched cats
    if (typeof window !== 'undefined') {
      cats.forEach(cat => preloadImage(cat.url).catch(() => {}));
    }

    return cats;
  } catch (error) {
    console.error('Error fetching cats:', error);
    return Array.from({ length: limit }, (_, i) => ({
      id: `random-${Date.now()}-${i}`,
      url: `${BASE_URL}/cat?random=${Date.now()}-${i}`,
    }));
  }
}

/**
 * Get a random cat image URL
 * @param options - Optional parameters for customization
 * @returns Cat image URL
 */
export function getRandomCatUrl(options?: {
  tag?: string;
  text?: string;
  type?: 'xsmall' | 'small' | 'medium' | 'square';
  filter?: 'blur' | 'mono' | 'negate' | 'custom';
  width?: number;
  height?: number;
  gif?: boolean;
}): string {
  let url = `${BASE_URL}/cat`;
  
  if (options?.gif) {
    url += '/gif';
  }
  
  if (options?.tag) {
    url += `/${options.tag}`;
  }
  
  if (options?.text) {
    url += `/says/${encodeURIComponent(options.text)}`;
  }
  
  const params = new URLSearchParams();
  
  if (options?.type) {
    params.append('type', options.type);
  }
  
  if (options?.filter) {
    params.append('filter', options.filter);
  }
  
  if (options?.width) {
    params.append('width', options.width.toString());
  }
  
  if (options?.height) {
    params.append('height', options.height.toString());
  }
  
  // Add random parameter to prevent caching
  params.append('random', Date.now().toString());
  
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Fetch all available tags from Cataas API
 * @returns Array of tag strings
 */
export async function fetchTags(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/tags`, {
      cache: 'force-cache', // Tags don't change often
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return ['cute', 'kitten', 'funny', 'sleep', 'play'];
  }
}

/**
 * Preload image to ensure it's cached (client-side only)
 * @param url - Image URL to preload
 */
export function preloadImage(url: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}