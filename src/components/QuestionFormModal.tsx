import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: Question | null;
  defaultTeam?: 'red' | 'blue' | 'both';
  onSave: (
    data: {
      question: string;
      options: string[];
      correctIndex: number;
      category: string;
      explanation: string;
      team: 'red' | 'blue' | 'both';
    },
    editId?: number
  ) => void;
}

const CATEGORY_SUGGESTIONS = [
  'Địa lý',
  'Lịch sử',
  'Sinh học',
  'Vật lý',
  'Hóa học',
  'Toán học',
  'Thiên văn',
  'Văn học',
  'Tiếng Anh',
  'Đố vui'
];

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  onClose,
  initialQuestion,
  defaultTeam = 'red',
  onSave,
}) => {
  const isEditing = !!initialQuestion;

  const [team, setTeam] = useState<'red' | 'blue' | 'both'>('red');
  const [category, setCategory] = useState<string>('Đố vui');
  const [questionText, setQuestionText] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuestion) {
      setQuestionText(initialQuestion.question || '');
      setOptions(
        initialQuestion.options && initialQuestion.options.length === 4
          ? [...initialQuestion.options]
          : ['', '', '', '']
      );
      setCorrectIndex(initialQuestion.correctIndex ?? 0);
      setCategory(initialQuestion.category || 'Đố vui');
      setExplanation(initialQuestion.explanation || '');
      setTeam(initialQuestion.team || defaultTeam);
    } else {
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
      setCategory('Đố vui');
      setExplanation('');
      setTeam(defaultTeam);
    }
    setErrorMsg(null);
  }, [initialQuestion, defaultTeam, isOpen]);

  if (!isOpen) return null;

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const trimmedQ = questionText.trim();
    if (!trimmedQ) {
      setErrorMsg('Vui lòng nhập nội dung câu hỏi!');
      return;
    }

    for (let i = 0; i < 4; i++) {
      if (!options[i] || !options[i].trim()) {
        setErrorMsg(`Vui lòng điền nội dung cho đáp án ${['A', 'B', 'C', 'D'][i]}!`);
        return;
      }
    }

    if (correctIndex < 0 || correctIndex > 3) {
      setErrorMsg('Vui lòng chọn 1 đáp án đúng (A, B, C hoặc D)!');
      return;
    }

    const trimmedCat = category.trim() || 'Đố vui';

    onSave(
      {
        question: trimmedQ,
        options: options.map((o) => o.trim()),
        correctIndex,
        category: trimmedCat,
        explanation: explanation.trim(),
        team,
      },
      initialQuestion ? initialQuestion.id : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-3xl shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
              {isEditing ? '✏️' : '✨'}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-100">
                {isEditing ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'}
              </h3>
              <p className="text-xs text-stone-400">
                {isEditing
                  ? `Đang sửa câu hỏi #${initialQuestion?.id}`
                  : 'Tạo câu hỏi đố vui mới cho trận kéo co'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-700/60 rounded-xl text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Team assignment & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Team Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Áp dụng cho Đội:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTeam('red')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    team === 'red'
                      ? 'bg-red-950 text-red-300 border-red-500 ring-2 ring-red-500/40'
                      : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:bg-stone-700/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Đội Đỏ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTeam('blue')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    team === 'blue'
                      ? 'bg-sky-950 text-sky-300 border-sky-500 ring-2 ring-sky-500/40'
                      : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:bg-stone-700/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Đội Xanh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTeam('both')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    team === 'both'
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-500 ring-2 ring-indigo-500/40'
                      : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:bg-stone-700/60'
                  }`}
                >
                  <span>🔄 Cả 2 Đội</span>
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Chủ đề / Lĩnh vực:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ví dụ: Địa lý, Toán học, Lịch sử..."
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {CATEGORY_SUGGESTIONS.slice(0, 5).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700/60 transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Nội dung câu hỏi: <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Nhập câu hỏi đố vui trắc nghiệm tại đây..."
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* 4 Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-300">
                4 Đáp án lựa chọn (Click chọn nút tròn để đặt đáp án đúng): <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-semibold">
                Đáp án đúng: {['A', 'B', 'C', 'D'][correctIndex]}
              </span>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx];
                const isSelected = correctIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-500/50'
                        : 'bg-stone-950/70 border-stone-800 focus-within:border-stone-600'
                    }`}
                  >
                    {/* Correct answer toggle button */}
                    <button
                      type="button"
                      onClick={() => setCorrectIndex(idx)}
                      className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/40 scale-105'
                          : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200 border border-stone-700'
                      }`}
                      title={isSelected ? 'Đáp án đúng' : 'Nhấp để chọn làm đáp án đúng'}
                    >
                      {isSelected ? <CheckCircle className="w-4 h-4" /> : letter}
                    </button>

                    {/* Option Text Input */}
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Nội dung phương án ${letter}...`}
                      className="flex-1 bg-transparent border-none text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none px-1"
                    />

                    {/* Indicator tag */}
                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 shrink-0">
                        ĐÁP ÁN ĐÚNG
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation (Optional) */}
          <div>
            <label className="block text-xs font-bold text-stone-400 mb-1">
              Giải thích thêm (Tùy chọn):
            </label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Giải thích ngắn gọn vì sao đáp án này đúng..."
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 placeholder-stone-600 focus:outline-none focus:border-stone-600"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-400 hover:text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditing ? 'LƯU THAY ĐỔI' : 'TẠO CÂU HỎI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
