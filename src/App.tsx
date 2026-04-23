/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Terminal, Zap, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function App() {
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(8, Math.min(18, prev + (Math.random() - 0.5) * 2)));
    }, 100); // Faster updates for noise
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-dark-void flex flex-col items-center justify-center p-4 selection:bg-neon-magenta selection:text-white static-noise crt-flicker">
      <div className="scanlines" />
      
      {/* HEADER: GLITCHED LOGO */}
      <motion.header 
        animate={{ x: [0, -2, 2, 0] }}
        transition={{ repeat: Infinity, duration: 0.1, repeatType: "mirror" }}
        className="z-20 mb-8 border-b-4 border-neon-magenta pb-2 w-full max-w-4xl flex justify-between items-end"
      >
        <div className="glitch-title">
          <h1 className="text-4xl font-pixel text-neon-magenta leading-none tear-fx">NEURAL_VOID</h1>
          <p className="text-[10px] text-neon-cyan font-mono mt-1 mt-2 opacity-80 tracking-[0.2em] animate-pulse">SYSTEM_STATUS: CORRUPTED // AUTH: NULL</p>
        </div>
        <div className="text-neon-cyan text-right">
          <p className="text-[8px] font-pixel">KERNEL_v02.8B</p>
          <div className="flex gap-1 mt-1">
             {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 bg-neon-cyan ${i < 3 ? 'opacity-100' : 'opacity-20'}`} />
             ))}
          </div>
        </div>
      </motion.header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-20">
        
        {/* LEFT PANEL: AUDIO INTERFACE */}
        <div className="lg:col-span-1 space-y-6">
          <div className="raw-border p-4 bg-static-gray bg-opacity-40 tear-fx">
            <h2 className="text-xs font-pixel text-neon-cyan mb-4 flex items-center gap-2">
              <Zap size={14} className="text-neon-magenta" />
              SONIC_DRAIN
            </h2>
            <MusicPlayer />
          </div>

          <div className="raw-border p-4 bg-black">
            <div className="flex justify-between items-center text-[10px] text-neon-magenta font-pixel mb-2">
               <span>PULSE_GEN</span>
               <Activity size={12} />
            </div>
            <div className="h-20 flex items-center justify-center border border-neon-cyan/20 overflow-hidden relative">
               <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/52/Static_noise.png')] opacity-10" />
               <motion.div 
                 animate={{ scaleY: [1, 1.5, 0.8, 1.2, 1] }}
                 transition={{ repeat: Infinity, duration: 0.5 }}
                 className="w-full h-0.5 bg-neon-cyan"
               />
            </div>
          </div>
        </div>

        {/* CENTER PANEL: ARENA */}
        <div className="lg:col-span-2">
          <div className="raw-border p-1 bg-neon-magenta relative">
            <div className="absolute -top-3 -left-3 bg-neon-cyan text-black px-2 py-1 text-[8px] font-pixel z-30">
               NEURAL_LINK_ACTIVE
            </div>
            <div className="bg-dark-void p-4 flex flex-col items-center justify-center overflow-hidden">
                <SnakeGame />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-neon-magenta text-black px-2 py-1 text-[8px] font-pixel flex items-center gap-2">
               CORE_LOAD: {Math.floor(latency * 5)}%
               <span className="w-2 h-2 bg-black animate-ping" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: TELEMETRY */}
        <div className="lg:col-span-1 space-y-6">
          <div className="raw-border p-4 bg-static-gray">
            <h2 className="text-xs font-pixel text-neon-cyan mb-4 flex items-center gap-2">
              <Cpu size={14} className="text-neon-magenta" />
              SYS_DEBUG
            </h2>
            <div className="font-mono text-[10px] space-y-2 text-neon-cyan/60">
              <p>_LATENCY: <span className="text-neon-magenta">{latency.toFixed(4)}MS</span></p>
              <p>_BUFFER_OVR: <span className="text-neon-magenta">TRUE</span></p>
              <p>_STACK_PTR: 0xFX990</p>
              <div className="w-full h-1 bg-neon-cyan/20 mt-4 overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-1/3 h-full bg-neon-magenta" 
                />
              </div>
            </div>
          </div>

          <div className="raw-border p-4 bg-neon-cyan text-black font-pixel">
            <h2 className="text-[10px] mb-2 flex items-center gap-2">
              <Terminal size={12} />
              INPUT_MAP
            </h2>
            <div className="grid grid-cols-3 gap-1 text-[8px]">
               <div className="border-2 border-black flex items-center justify-center aspect-square opacity-20"></div>
               <div className="border-2 border-black flex items-center justify-center aspect-square">W</div>
               <div className="border-2 border-black flex items-center justify-center aspect-square opacity-20"></div>
               <div className="border-2 border-black flex items-center justify-center aspect-square">A</div>
               <div className="border-2 border-black flex items-center justify-center aspect-square">S</div>
               <div className="border-2 border-black flex items-center justify-center aspect-square">D</div>
            </div>
          </div>
        </div>

      </main>

      <footer className="mt-12 text-[10px] font-pixel text-neon-magenta opacity-50 flex gap-8 z-20">
        <span>[ ERR_LOGS_AVAILABLE ]</span>
        <span className="animate-pulse">_MACHINE_ID: 9982-A</span>
        <span>[ (C) 2088 NEURAL_CORP ]</span>
      </footer>

    </div>
  );
}
