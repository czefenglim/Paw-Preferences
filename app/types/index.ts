/**
 * Type definitions for the Paws & Preferences app
 */

// Cat data structure from Cataas API
export interface Cat {
  id: string;
  url: string;
  tags?: string[];
  owner?: string;
  createdAt?: string;
}

// Swipe direction type
export type SwipeDirection = 'left' | 'right' | null;

// Cat with interaction state
export interface CatWithInteraction extends Cat {
  liked?: boolean;
  timestamp?: number;
}

// API response from Cataas
export interface CataasApiResponse {
  id: string;
  tags: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// Filter options for the cat discovery
export interface FilterOptions {
  tag?: string;
  filter?: 'blur' | 'mono' | 'negate' | 'custom';
  text?: string;
  // HSL Adjustments
  brightness?: number;
  lightness?: number;
  saturation?: number;
  hue?: number;
  // RGB Adjustments
  red?: number;
  green?: number;
  blue?: number;
  // Dimensions
  width?: number;
  height?: number;
}