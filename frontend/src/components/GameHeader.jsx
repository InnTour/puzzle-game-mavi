import React from 'react';
import { Clock, Hash, RotateCcw, Home } from 'lucide-react';
import { formatTime } from '../utils/gameLogic';

const GameHeader = ({ puzzleTitle, difficulty, timer, moves, onRestart, onQuit }) => {
  return (
    <header className="bg-slate-800/80 backdrop-blur-sm border-b border-cyan-500/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        {/* Left: Puzzle Info */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-xl font-bold text-[#C4A574] truncate max-w-[200px] md:max-w-none">
            {puzzleTitle}
          </h1>
          <span className="px-2 py-1 bg-[#6B8E6F]/20 text-[#6B8E6F] text-xs font-semibold rounded-full border border-cyan-500/30">
            {difficulty.toUpperCase()}
          </span>
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg" data-testid="game-timer">
            <Clock className="w-4 h-4 text-[#C4A574]" />
            <span className="font-mono text-cyan-100 font-semibold">
              {formatTime(timer)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg" data-testid="move-counter">
            <Hash className="w-4 h-4 text-[#C4A574]" />
            <span className="font-mono text-cyan-100 font-semibold">
              {moves}
            </span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-[#6B8E6F] rounded-lg transition-all hover:scale-105"
            data-testid="restart-button"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>
          
          <button
            onClick={onQuit}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-[#6B8E6F] rounded-lg transition-all hover:scale-105"
            data-testid="quit-button"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Quit</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
