import React from 'react';
import { Trophy, CheckCircle, XCircle, Clock, RotateCcw, Award } from 'lucide-react';
import { GameResult } from '../types';

interface GameOverModalProps {
  result: GameResult | null;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ result, onRestart }) => {
  if (!result) return null;

  const isRedWin = result.winner === 'player1';
  const isBlueWin = result.winner === 'player2';
  const isDraw = result.winner === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900 rounded-3xl shadow-2xl border border-stone-700 p-6 overflow-hidden text-center">
        {/* Decorative Top Accent Banner */}
        <div
          className={`absolute top-0 left-0 right-0 h-3 ${
            isRedWin
              ? 'bg-gradient-to-r from-red-600 to-rose-500'
              : isBlueWin
              ? 'bg-gradient-to-r from-sky-600 to-blue-500'
              : 'bg-gradient-to-r from-amber-500 to-yellow-400'
          }`}
        />

        {/* Trophy / Result Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-3 shadow-inner mt-2 bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-700">
          {isDraw ? (
            <span className="text-4xl">🤝</span>
          ) : (
            <Trophy
              className={`w-10 h-10 ${
                isRedWin ? 'text-rose-400' : 'text-sky-400'
              } animate-bounce`}
            />
          )}
        </div>

        {/* Victory Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight mb-1">
          {isRedWin
            ? '🏆 ĐỘI ĐỎ CHIẾN THẮNG!'
            : isBlueWin
            ? '🏆 ĐỘI XANH CHIẾN THẮNG!'
            : '🤝 TRẬN ĐẤU HÒA BÌNH!'}
        </h2>

        {/* Win Reason badge */}
        <p className="text-xs font-semibold text-stone-400 mb-5">
          {result.reason === 'boundary'
            ? '⚡ Xuất sắc: Đã kéo dây vượt qua vạch mốc chiến thắng!'
            : result.reason === 'completed'
            ? '🎯 Kết thúc 10 câu đố: Thắng nhờ khoảng cách kéo dây áp đảo!'
            : '⏰ Hết thời gian thi đấu!'}
        </p>

        {/* Match Stats Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
          {/* Red Team Stats */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-red-950/40 border border-red-900/50">
            <span className="text-xs font-black text-rose-400 mb-1">ĐỘI ĐỎ</span>
            <div className="flex items-center gap-1.5 text-2xl font-black text-stone-100 my-0.5">
              <span>{result.redCorrect}</span>
              <span className="text-sm font-normal text-stone-500">/ 10</span>
            </div>
            <span className="text-[10px] text-stone-400 font-bold uppercase mb-2">Câu trả lời đúng</span>
            <div className="flex items-center justify-between w-full text-[11px] text-stone-300 pt-2 border-t border-red-900/40">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3 h-3" /> {result.redCorrect} đúng
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <XCircle className="w-3 h-3" /> {result.redWrong} sai
              </span>
            </div>
          </div>

          {/* Blue Team Stats */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-sky-950/40 border border-sky-900/50">
            <span className="text-xs font-black text-sky-400 mb-1">ĐỘI XANH</span>
            <div className="flex items-center gap-1.5 text-2xl font-black text-stone-100 my-0.5">
              <span>{result.blueCorrect}</span>
              <span className="text-sm font-normal text-stone-500">/ 10</span>
            </div>
            <span className="text-[10px] text-stone-400 font-bold uppercase mb-2">Câu trả lời đúng</span>
            <div className="flex items-center justify-between w-full text-[11px] text-stone-300 pt-2 border-t border-sky-900/40">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3 h-3" /> {result.blueCorrect} đúng
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <XCircle className="w-3 h-3" /> {result.blueWrong} sai
              </span>
            </div>
          </div>
        </div>

        {/* Rope final position & Duration badge */}
        <div className="flex items-center justify-between text-xs text-stone-400 font-semibold mb-6 px-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {result.durationSeconds}s thi đấu
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Độ lệch dây: {Math.abs(Math.round(result.finalPosition))}%
          </span>
        </div>

        {/* Action Button */}
        <button
          id="btn-play-again"
          type="button"
          onClick={onRestart}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <RotateCcw className="w-5 h-5" />
          <span>CHƠI LẠI TRẬN MỚI</span>
        </button>
      </div>
    </div>
  );
};
