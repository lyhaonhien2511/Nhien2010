import React from 'react';
import { X, Clock, Timer, Check, RotateCcw } from 'lucide-react';

interface TimeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalGameTime: number; // in seconds
  questionTimeLimit: number; // in seconds
  onSave: (total: number, perQuestion: number) => void;
}

const TOTAL_TIME_OPTIONS = [
  { value: 60, label: '1 Phút', desc: 'Thi đấu tốc độ chớp nhoáng (60s)' },
  { value: 120, label: '2 Phút', desc: 'Chuẩn quy định giáo dục (120s) ★' },
  { value: 180, label: '3 Phút', desc: 'Trận đấu mở rộng (180s)' },
  { value: 300, label: '5 Phút', desc: 'Dành cho nhiều câu hỏi hoặc lớp học (300s)' },
];

const QUESTION_TIME_OPTIONS = [
  { value: 10, label: '10 Giây', desc: 'Phản xạ nhanh, tăng áp lực' },
  { value: 15, label: '15 Giây', desc: 'Chuẩn quy định: 15s suy nghĩ mỗi câu ★' },
  { value: 20, label: '20 Giây', desc: 'Thoải mái hơn cho câu hỏi dài' },
  { value: 30, label: '30 Giây', desc: 'Dành cho câu tính toán phức tạp' },
];

export const TimeSettingsModal: React.FC<TimeSettingsModalProps> = ({
  isOpen,
  onClose,
  totalGameTime,
  questionTimeLimit,
  onSave,
}) => {
  const [selectedTotal, setSelectedTotal] = React.useState<number>(totalGameTime);
  const [selectedPerQ, setSelectedPerQ] = React.useState<number>(questionTimeLimit);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedTotal(totalGameTime);
      setSelectedPerQ(questionTimeLimit);
    }
  }, [isOpen, totalGameTime, questionTimeLimit]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedTotal, selectedPerQ);
    onClose();
  };

  const handleResetDefault = () => {
    setSelectedTotal(120); // 2 minutes
    setSelectedPerQ(15); // 15 seconds
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-stone-900 rounded-3xl shadow-2xl border border-stone-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Cài Đặt Thời Gian Thi Đấu</h3>
              <p className="text-xs text-stone-400">Thời gian tổng trận đấu & Thời gian cho mỗi câu hỏi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Total Game Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Thời gian tổng trận đấu (Đếm ngược kết thúc)
              </label>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/50">
                {Math.floor(selectedTotal / 60)} phút ({selectedTotal}s)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOTAL_TIME_OPTIONS.map((opt) => {
                const isSelected = selectedTotal === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedTotal(opt.value)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 ring-2 ring-amber-500/40 shadow-md'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-white">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Question Time Limit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase text-sky-400 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                Thời gian cho mỗi câu hỏi (Mỗi đội)
              </label>
              <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/50">
                {selectedPerQ} giây / câu
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUESTION_TIME_OPTIONS.map((opt) => {
                const isSelected = selectedPerQ === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedPerQ(opt.value)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-500 text-sky-200 ring-2 ring-sky-500/40 shadow-md'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-white">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-400 mt-2 bg-stone-950/80 p-2 rounded-lg border border-stone-800">
              💡 <strong>Quy tắc tính điểm:</strong> Nếu đội chơi không trả lời kịp trong vòng{' '}
              <strong className="text-amber-300">{selectedPerQ} giây</strong>, câu hỏi sẽ bị tính là{' '}
              <strong className="text-rose-400">hết giờ (sai)</strong>, đội bị trượt dây (-8%) và tự động chuyển sang câu tiếp theo.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-900 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định (2 phút & 15s)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer border border-stone-800"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-black text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              Lưu Thiết Lập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
