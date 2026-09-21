import React, { useState } from 'react';
import { GameMode, GameStatus } from '../types';

interface ControlsPanelProps {
  gameMode: GameMode;
  gameStatus: GameStatus;
  onP1Pull: () => void;
  onP2Pull: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  gameMode,
  gameStatus,
  onP1Pull,
  onP2Pull,
}) => {
  const [p1Active, setP1Active] = useState(false);
  const [p2Active, setP2Active] = useState(false);

  const isPlaying = gameStatus === 'playing';

  const handleP1Click = () => {
    if (!isPlaying) return;
    setP1Active(true);
    setTimeout(() => setP1Active(false), 80);
    onP1Pull();
  };

  const handleP2Click = () => {
    if (!isPlaying || gameMode === 'p_vs_cpu') return;
    setP2Active(true);
    setTimeout(() => setP2Active(false), 80);
    onP2Pull();
  };

  return (
    <div className="w-full grid grid-cols-2 gap-3 sm:gap-6 select-none">
      {/* ================= P1 TAP BUTTON ================= */}
      <button
        id="btn-p1-pull"
        type="button"
        disabled={!isPlaying}
        onClick={handleP1Click}
        onTouchStart={(e) => {
          e.preventDefault();
          handleP1Click();
        }}
        className={`group relative overflow-hidden rounded-2xl p-4 sm:p-6 border-b-6 transition-all duration-75 text-left flex flex-col justify-between h-32 sm:h-40 cursor-pointer shadow-lg active:scale-95 ${
          !isPlaying
            ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed'
            : p1Active
            ? 'bg-red-600 border-red-800 text-white translate-y-1'
            : 'bg-gradient-to-br from-red-500 to-red-600 border-red-700 text-white hover:brightness-105'
        }`}
      >
        {/* Decorative background glow */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/15 rounded-full blur-lg pointer-events-none" />

        <div className="flex justify-between items-start">
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-black/20 px-2.5 py-1 rounded-md">
            Đội Đỏ (P1)
          </span>
          <span className="text-2xl sm:text-3xl filter drop-shadow">💪</span>
        </div>

        <div>
          <div className="text-xl sm:text-3xl font-black tracking-tight leading-none mb-1">
            KÉO NGAY!
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/90">
            <span>Bấm phím:</span>
            <kbd className="px-2 py-0.5 bg-black/40 rounded-md font-mono font-bold text-yellow-300 border border-white/20">
              SPACE
            </kbd>
            <span className="text-white/60">hoặc</span>
            <kbd className="px-1.5 py-0.5 bg-black/40 rounded-md font-mono font-bold text-yellow-300 border border-white/20">
              A
            </kbd>
          </div>
        </div>
      </button>

      {/* ================= P2 / CPU TAP BUTTON ================= */}
      <button
        id="btn-p2-pull"
        type="button"
        disabled={!isPlaying || gameMode === 'p_vs_cpu'}
        onClick={handleP2Click}
        onTouchStart={(e) => {
          if (gameMode !== 'p_vs_cpu') {
            e.preventDefault();
            handleP2Click();
          }
        }}
        className={`group relative overflow-hidden rounded-2xl p-4 sm:p-6 border-b-6 transition-all duration-75 text-left flex flex-col justify-between h-32 sm:h-40 cursor-pointer shadow-lg active:scale-95 ${
          !isPlaying
            ? 'bg-slate-200 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed'
            : gameMode === 'p_vs_cpu'
            ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-900 text-slate-200 cursor-default'
            : p2Active
            ? 'bg-blue-600 border-blue-800 text-white translate-y-1'
            : 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700 text-white hover:brightness-105'
        }`}
      >
        {/* Decorative background glow */}
        <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/15 rounded-full blur-lg pointer-events-none" />

        <div className="flex justify-between items-start">
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-black/20 px-2.5 py-1 rounded-md">
            {gameMode === 'p_vs_cpu' ? 'Máy (AI CPU)' : 'Đội Xanh (P2)'}
          </span>
          <span className="text-2xl sm:text-3xl filter drop-shadow">
            {gameMode === 'p_vs_cpu' ? '🤖' : '🔥'}
          </span>
        </div>

        <div>
          {gameMode === 'p_vs_cpu' ? (
            <>
              <div className="text-xl sm:text-2xl font-black tracking-tight leading-none mb-1 text-sky-300">
                MÁY TỰ ĐỘNG KÉO
              </div>
              <div className="text-xs text-slate-300">
                AI đang tính toán nhịp kéo liên tục...
              </div>
            </>
          ) : (
            <>
              <div className="text-xl sm:text-3xl font-black tracking-tight leading-none mb-1">
                KÉO NGAY!
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/90">
                <span>Bấm phím:</span>
                <kbd className="px-2 py-0.5 bg-black/40 rounded-md font-mono font-bold text-yellow-300 border border-white/20">
                  ENTER
                </kbd>
                <span className="text-white/60">hoặc</span>
                <kbd className="px-1.5 py-0.5 bg-black/40 rounded-md font-mono font-bold text-yellow-300 border border-white/20">
                  → (Phím mũi tên)
                </kbd>
              </div>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
