/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="flex flex-col gap-6 w-full font-pixel">
      <div className="relative border-4 border-neon-cyan">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="aspect-square overflow-hidden bg-black relative"
          >
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              className="w-full h-full object-cover opacity-50 grayscale contrast-125"
              referrerPolicy="no-referrer"
            />
            {/* Screen Tearing Overlay */}
            <div className="absolute inset-0 bg-neon-magenta/20 mix-blend-overlay tear-fx" />
            
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[6px] text-neon-cyan bg-black px-1">
               <Disc size={8} className={isPlaying ? "animate-spin" : ""} />
               PLAYING_SIGNAL_0{currentTrackIndex + 1}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="p-3 bg-neon-magenta/10 border-t-2 border-neon-cyan">
          <h2 className="text-[10px] text-neon-magenta truncate leading-tight mb-1">{currentTrack.title}</h2>
          <p className="text-[8px] text-neon-cyan opacity-60">ID: {currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar (Raw Style) */}
        <div className="h-4 w-full bg-white/5 border border-neon-cyan/20 relative overflow-hidden">
          <motion.div 
            className="h-full bg-neon-cyan" 
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-2 text-[6px] text-white/50 pointer-events-none">
             <span>BIT_STREAM</span>
             <span>{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Controls (Mechanical Grid Style) */}
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={handlePrev}
            className="p-2 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors flex items-center justify-center"
          >
            <SkipBack size={14} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-neon-magenta text-black hover:bg-white transition-colors flex items-center justify-center"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button 
            onClick={handleNext}
            className="p-2 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors flex items-center justify-center"
          >
            <SkipForward size={14} />
          </button>
        </div>
      </div>

      {/* Manual Selection Nodes */}
      <div className="border-t border-neon-cyan/20 pt-4 grid grid-cols-3 gap-2">
         {TRACKS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentTrackIndex(idx)}
              className={`h-4 border ${idx === currentTrackIndex ? 'bg-neon-cyan border-neon-cyan' : 'border-neon-cyan/30'} flex items-center justify-center text-[8px] ${idx === currentTrackIndex ? 'text-black' : 'text-neon-cyan'}`}
            >
               0{idx + 1}
            </button>
         ))}
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
    </div>
  );
}
