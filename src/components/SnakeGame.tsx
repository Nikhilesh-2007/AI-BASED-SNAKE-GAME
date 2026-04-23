/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, type Point, type Direction } from '../constants';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / GRID_SIZE;
    
    // Draw raw grid
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw snake: Magenta head, Cyan body
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ff00ff' : '#00ffff';
      
      ctx.beginPath();
      ctx.rect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      ctx.fill();

      // Digital jitter effect
      if (Math.random() > 0.98) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, 1);
      }
    });

    // Draw food: Flickering White box
    if (Math.random() > 0.1) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.rect(
        food.x * cellSize + 4,
        food.y * cellSize + 4,
        cellSize - 8,
        cellSize - 8
      );
      ctx.fill();
    }

    ctx.shadowBlur = 0;

  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 5, y: 5 });
    setDirection('UP');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 font-pixel">
      <div className="relative p-2 bg-neon-cyan/20 raw-border border-neon-cyan box-content">
        <canvas 
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black"
        />
        
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-50 crt-flicker">
            {gameOver ? (
              <motion.div 
                animate={{ x: [-2, 2, -1, 1, 0] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="flex flex-col items-center gap-6"
              >
                <div className="bg-neon-magenta text-black px-6 py-3 text-lg leading-none tear-fx">
                    SIGNAL_LOST
                </div>
                <div className="text-[10px] text-neon-cyan text-center opacity-70 font-silkscreen">
                    ENTITY_FLATTENED<br/>
                    LOAD_SCORE: {score.toString().padStart(4, '0')}
                </div>
                <button 
                  onClick={resetGame}
                  className="glitch-btn"
                >
                  REGEN_ARRAY
                </button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col items-center gap-6"
              >
                <div className="text-neon-cyan text-xs">COMM_WAIT...</div>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="glitch-btn"
                >
                  RE_LINK
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 w-full">
        <div className="flex-1 p-3 bg-neon-magenta text-black relative">
          <div className="absolute -top-2 -right-2 bg-neon-cyan w-2 h-2" />
          <span className="text-[8px] block mb-2 leading-none">NODE_SCORE</span>
          <span className="text-2xl leading-none block italic tracking-tighter">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex-1 p-3 border-4 border-neon-cyan text-neon-cyan">
          <span className="text-[8px] block mb-2 leading-none opacity-50">INTERFACE_STATE</span>
          <span className={`text-xl leading-none block ${gameOver ? 'text-neon-magenta animate-pulse' : ''}`}>
             {gameOver ? 'FATAL' : isPaused ? 'IDLE' : 'ACTIVE'}
          </span>
        </div>
      </div>
    </div>
  );
}
