import React from 'react';
import { Volume2, VolumeX, Code, Play, RotateCcw, Swords, BookOpen, Timer, Clock } from 'lucide-react';
import { Difficulty, GameMode, GameStatus, ActiveTab, PlayFlow } from '../types';

interface GameHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  redCount: number;
  blueCount: number;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  playFlow: PlayFlow;
  setPlayFlow: (flow: PlayFlow) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  timeLeft: number;
  totalGameTime: number;
  questionTimeLimit: number;
  gameStatus: GameStatus;
  scores: { p1: number; p2: number };
  soundEnabled: boolean;
  onToggleSound: () => void;
  onStartGame: () => void;
  onResetGame: () => void;
  onOpenSourceModal: () => void;
  onOpenTimeSettings: () => void;
  onOpenModeModal?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  activeTab,
  setActiveTab,
  redCount,
  blueCount,
  gameMode,
  setGameMode,
  playFlow,
  setPlayFlow,
  difficulty,
  setDifficulty,
  timeLeft,
  totalGameTime,
  questionTimeLimit,
  gameStatus,
  scores,
  soundEnabled,
  onToggleSound,
  onStartGame,
  onResetGame,
  onOpenSourceModal,
  onOpenTimeSettings,
  onOpenModeModal,
}) => {
  const isPlaying = gameStatus === 'playing';
  const isCountdown = gameStatus === 'countdown';

  return (
    <header className="w-full flex flex-col gap-3">
      {/* Top Navbar Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-xl shadow-md border-2 border-amber-600">
            🧠
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              KÉO CO ĐỐ VUI
            </h1>
            <p className="text-xs text-stone-400 font-medium">
              Trò chơi giáo dục đối kháng: Đội Đỏ vs Đội Xanh ({redCount} & {blueCount} câu hỏi)
            </p>
          </div>
        </div>

        {/* Tab switcher: Trận đấu vs Quản lý câu hỏi */}
        <div className="flex items-center bg-stone-950 p-1.5 rounded-2xl border border-stone-800 shadow-inner">
          <button
            id="tab-btn-battle"
            type="button"
            onClick={() => setActiveTab('battle')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'battle'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>ĐẤU TRƯỜNG</span>
          </button>

          <button
            id="tab-btn-questions"
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md scale-[1.02]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>QUẢN LÝ CÂU HỎI</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                activeTab === 'questions'
                  ? 'bg-black/30 text-white'
                  : 'bg-stone-800 text-stone-300'
              }`}
            >
              {redCount + blueCount}
            </span>
          </button>
        </div>

        {/* Action buttons (Time Settings, Code & Sound) */}
        <div className="flex items-center gap-2">
          <button
            id="btn-time-settings"
            type="button"
            onClick={onOpenTimeSettings}
            disabled={isPlaying || isCountdown}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              isPlaying || isCountdown
                ? 'bg-stone-900 border-stone-800 text-stone-500 cursor-not-allowed opacity-60'
                : 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-600/40 hover:border-amber-500'
            }`}
            title="Cài đặt thời gian tổng và thời gian cho mỗi câu hỏi"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Thời gian:</span>
            <span className="font-mono font-black">{Math.floor(totalGameTime / 60)}p • {questionTimeLimit}s/câu</span>
          </button>

          <button
            id="btn-source-code"
            type="button"
            onClick={onOpenSourceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Lấy mã nguồn HTML gộp 1 file"
          >
            <Code className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Mã HTML 1 file</span>
          </button>

          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                : 'bg-stone-800 border-stone-700 text-stone-500 hover:bg-stone-700'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Middle Status Row: Mode switcher, Timer & Score (Show on Battle tab) */}
      {activeTab === 'battle' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center bg-stone-950/70 p-3 rounded-2xl border border-stone-800 shadow-sm">
          {/* Mode & Turn Flow Selector */}
          <div className="flex items-center flex-wrap gap-1.5 justify-center md:justify-start">
            <button
              type="button"
              disabled={isPlaying || isCountdown}
              onClick={() => setGameMode('p_vs_cpu')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                gameMode === 'p_vs_cpu'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50 ring-1 ring-indigo-400'
                  : 'bg-stone-900 text-stone-400 hover:bg-stone-800 border border-stone-800'
              } ${isPlaying || isCountdown ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Chơi 1 người đấu với máy tính (P1 vs Máy)"
            >
              <span>🤖</span>
              <span>Đấu Máy</span>
            </button>

            <button
              type="button"
              disabled={isPlaying || isCountdown}
              onClick={() => setGameMode('p_vs_p')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                gameMode === 'p_vs_p'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50 ring-1 ring-purple-400'
                  : 'bg-stone-900 text-stone-400 hover:bg-stone-800 border border-stone-800'
              } ${isPlaying || isCountdown ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Chơi đối kháng 2 người trên cùng máy (P1 vs P2)"
            >
              <span>👥</span>
              <span>2 Người</span>
            </button>

            {/* Turn Flow toggle: Luân phiên theo thời gian quy định vs Cùng lúc */}
            <div className="flex items-center bg-stone-900 p-0.5 rounded-xl border border-stone-800">
              <button
                type="button"
                disabled={isPlaying || isCountdown}
                onClick={() => setPlayFlow('turn_based')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  playFlow === 'turn_based'
                    ? 'bg-emerald-600 text-white shadow-sm font-black'
                    : 'text-stone-400 hover:text-stone-200'
                } ${isPlaying || isCountdown ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Lần lượt từng đội trả lời theo thời gian, hết giờ chuyển đội"
              >
                <span>🔄</span>
                <span>Luân Phiên</span>
              </button>
              <button
                type="button"
                disabled={isPlaying || isCountdown}
                onClick={() => setPlayFlow('simultaneous')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  playFlow === 'simultaneous'
                    ? 'bg-amber-600 text-white shadow-sm font-black'
                    : 'text-stone-400 hover:text-stone-200'
                } ${isPlaying || isCountdown ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Cả hai đội trả lời đồng thời cùng lúc"
              >
                <span>⚡</span>
                <span>Cùng Lúc</span>
              </button>
            </div>

            {gameMode === 'p_vs_cpu' && (
              <select
                value={difficulty}
                disabled={isPlaying || isCountdown}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="text-xs font-bold bg-amber-950/60 text-amber-300 border border-amber-700/60 rounded-xl px-2 py-1 outline-hidden cursor-pointer"
                title="Độ khó của máy"
              >
                <option value="easy">Dễ (40%)</option>
                <option value="medium">Vừa (70%)</option>
                <option value="hard">Khó (90%) 🔥</option>
              </select>
            )}

            {onOpenModeModal && !isPlaying && !isCountdown && (
              <button
                type="button"
                onClick={onOpenModeModal}
                className="px-2 py-1 text-[11px] font-bold text-amber-400/90 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/40 rounded-lg transition-colors cursor-pointer"
                title="Mở màn hình chọn chế độ lớn"
              >
                ✨ Chi tiết
              </button>
            )}
          </div>

          {/* Center: Total Game Countdown Timer (2 minutes / 120s default) */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Tổng Giờ
              </span>
              <div
                className={`font-mono font-black text-2xl sm:text-3xl px-3 py-0.5 rounded-xl border-2 transition-all ${
                  timeLeft <= 10 && isPlaying
                    ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-lg shadow-red-900/50'
                    : timeLeft <= 30 && isPlaying
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-stone-900 text-stone-100 border-stone-700'
                }`}
                title="Thời gian tổng trận đấu đếm ngược"
              >
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <span className="text-[10px] text-stone-400 font-medium mt-0.5">
              Thời gian mỗi câu: <strong className="text-sky-300 font-mono">{questionTimeLimit}s</strong>
            </span>
          </div>

          {/* Right: Scores & Main Play/Reset Button */}
          <div className="flex items-center justify-center md:justify-end gap-3">
            {/* Score Counter */}
            <div className="flex items-center gap-1.5 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-xs font-black">
              <span className="text-red-400">Đỏ: {scores.p1}</span>
              <span className="text-stone-500">-</span>
              <span className="text-sky-400">Xanh: {scores.p2}</span>
            </div>

            {/* Big Start / Restart button */}
            {!isPlaying && !isCountdown ? (
              <button
                id="btn-start-game"
                type="button"
                onClick={onStartGame}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>BẮT ĐẦU</span>
              </button>
            ) : (
              <button
                id="btn-reset-game"
                type="button"
                onClick={onResetGame}
                className="flex items-center gap-1 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl transition-all cursor-pointer border border-stone-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi lại</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
