import React from 'react';
import { GameMode, Difficulty, PlayFlow } from '../types';
import { Bot, Users, Play, Sparkles, Shield, Swords, Keyboard, HelpCircle, X, RotateCcw } from 'lucide-react';

interface ModeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  playFlow: PlayFlow;
  setPlayFlow: (flow: PlayFlow) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  onStartGame: () => void;
}

export const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({
  isOpen,
  onClose,
  gameMode,
  setGameMode,
  playFlow,
  setPlayFlow,
  difficulty,
  setDifficulty,
  onStartGame,
}) => {
  if (!isOpen) return null;

  const handleStart = () => {
    onClose();
    onStartGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-stone-700 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-stone-100 flex flex-col gap-5 max-h-[95vh] overflow-y-auto">
        {/* Decorative ambient background */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Chọn Chế Độ Trò Chơi
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>ĐẤU TRƯỜNG KÉO CO ĐỐ VUI</span>
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Chọn cách chơi phù hợp nhất trước khi bước vào trận kéo co kịch tính!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Big Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {/* Card 1: P vs CPU */}
          <div
            onClick={() => setGameMode('p_vs_cpu')}
            className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              gameMode === 'p_vs_cpu'
                ? 'bg-gradient-to-b from-indigo-950/70 to-stone-900 border-indigo-500 shadow-xl shadow-indigo-950/50 scale-[1.02]'
                : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-950/90'
            }`}
          >
            {gameMode === 'p_vs_cpu' && (
              <span className="absolute -top-3 right-4 px-3 py-0.5 bg-indigo-600 text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow-sm border border-indigo-400">
                Đang chọn
              </span>
            )}

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-xl border ${
                  gameMode === 'p_vs_cpu'
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}>
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">
                    1. Đấu với Máy (CPU)
                  </h3>
                  <span className="text-xs text-indigo-300 font-semibold">Chế độ 1 Người chơi</span>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Bạn điều khiển <strong className="text-red-400">Đội Đỏ</strong>, thi đấu với máy tính thông minh <strong className="text-sky-400">Đội Xanh</strong>.
              </p>

              {/* Difficulty selector inside Card 1 */}
              <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800 mb-3" onClick={(e) => e.stopPropagation()}>
                <label className="block text-[11px] font-bold text-stone-400 mb-1.5 uppercase">
                  Độ khó của Máy tính:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setGameMode('p_vs_cpu');
                        setDifficulty(d);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        difficulty === d && gameMode === 'p_vs_cpu'
                          ? d === 'hard'
                            ? 'bg-red-600 text-white'
                            : d === 'medium'
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-600 text-white'
                          : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                      }`}
                    >
                      {d === 'easy' ? 'Dễ' : d === 'medium' ? 'Vừa' : 'Khó 🔥'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key bindings */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 bg-stone-950/60 px-2.5 py-1.5 rounded-lg border border-stone-800/80">
                <Keyboard className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Phím bấm: <strong className="text-red-400 font-mono">[1, 2, 3, 4]</strong></span>
              </div>
            </div>
          </div>

          {/* Card 2: 2 Players (PvP) */}
          <div
            onClick={() => setGameMode('p_vs_p')}
            className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              gameMode === 'p_vs_p'
                ? 'bg-gradient-to-b from-purple-950/70 to-stone-900 border-purple-500 shadow-xl shadow-purple-950/50 scale-[1.02]'
                : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-950/90'
            }`}
          >
            {gameMode === 'p_vs_p' && (
              <span className="absolute -top-3 right-4 px-3 py-0.5 bg-purple-600 text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow-sm border border-purple-400">
                Đang chọn
              </span>
            )}

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-xl border ${
                  gameMode === 'p_vs_p'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">
                    2. Hai Người Chơi (PvP)
                  </h3>
                  <span className="text-xs text-purple-300 font-semibold">Đối kháng trực tiếp</span>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Hai bạn cùng thi đấu kịch tính trên cùng một máy tính, tranh tài ai trả lời nhanh và chính xác hơn!
              </p>

              {/* Keyboard Split Guide */}
              <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800 mb-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Đội Đỏ (P1):
                  </span>
                  <span className="font-mono bg-red-950/70 text-red-300 px-2 py-0.5 rounded border border-red-800/60 font-bold">
                    [1, 2, 3, 4]
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sky-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    Đội Xanh (P2):
                  </span>
                  <span className="font-mono bg-sky-950/70 text-sky-300 px-2 py-0.5 rounded border border-sky-800/60 font-bold">
                    [7, 8, 9, 0]
                  </span>
                </div>
              </div>

              {/* Touch & Mouse hint */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 bg-stone-950/60 px-2.5 py-1.5 rounded-lg border border-stone-800/80">
                <Swords className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Hỗ trợ chạm cảm ứng & chuột cho cả 2 bên</span>
              </div>
            </div>
          </div>
        </div>

        {/* Play Flow Option: Turn-based vs Simultaneous */}
        <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span className="text-xs sm:text-sm font-black text-white">Cách thức trả lời theo thời gian:</span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold">
              {playFlow === 'turn_based' ? '★ Đang chọn: Luân phiên từng đội' : '★ Đang chọn: Cùng lúc đồng thời'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Option A: Turn-based */}
            <button
              type="button"
              onClick={() => setPlayFlow('turn_based')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                playFlow === 'turn_based'
                  ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md ring-1 ring-emerald-400/50'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs sm:text-sm text-emerald-300 flex items-center gap-1.5">
                  <span>🔄</span>
                  <span>Luân phiên từng đội (Khuyên dùng)</span>
                </span>
                {playFlow === 'turn_based' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black">
                    BẬT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                Mỗi đội trả lời trong thời gian quy định (15s). Trả lời xong hoặc hết giờ sẽ chuyển quyền trả lời sang đội tiếp theo.
              </p>
            </button>

            {/* Option B: Simultaneous */}
            <button
              type="button"
              onClick={() => setPlayFlow('simultaneous')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                playFlow === 'simultaneous'
                  ? 'bg-amber-950/70 border-amber-500 text-white shadow-md ring-1 ring-amber-400/50'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs sm:text-sm text-amber-300 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Cùng lúc (Đồng thời)</span>
                </span>
                {playFlow === 'simultaneous' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white font-black">
                    BẬT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                Cả 2 đội cùng nhìn câu hỏi và bấm trả lời đồng thời độc lập, đội nào nhanh và chính xác hơn sẽ kéo dây.
              </p>
            </button>
          </div>
        </div>

        {/* Quick Rules Summary */}
        <div className="bg-stone-950/60 rounded-2xl p-3 border border-stone-800 flex items-center gap-3 text-xs text-stone-300 relative z-10">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1">
            <strong>Luật thi đấu:</strong> Trả lời đúng kéo dây về phía đội mình <span className="text-emerald-400 font-bold">+12%</span>. Trả lời sai bị trượt lùi <span className="text-rose-400 font-bold">-6%</span>. Hết 15s mỗi câu bị phạt lùi <span className="text-rose-400 font-bold">-8%</span>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-800 relative z-10">
          <div className="text-xs text-stone-400">
            Chế độ đã chọn:{' '}
            <strong className="text-amber-300">
              {gameMode === 'p_vs_cpu' ? `Đấu với Máy (${difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Vừa' : 'Khó 🔥'})` : '2 Người chơi (Đối kháng)'}
            </strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center"
            >
              Xem bàn cờ trước
            </button>

            <button
              type="button"
              onClick={handleStart}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>BẮT ĐẦU TRẬN ĐẤU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
