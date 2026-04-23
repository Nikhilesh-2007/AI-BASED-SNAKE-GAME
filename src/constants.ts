/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  color: string;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'Neural Drift',
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#ff007f',
  },
  {
    id: '2',
    title: 'Neon Horizon',
    artist: 'Synth Wave',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#00f3ff',
  },
  {
    id: '3',
    title: 'Digital Rain',
    artist: 'Bit Master',
    coverUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#bcff00',
  },
];
