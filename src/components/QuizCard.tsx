import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, TeamQuizState } from '../types';
import { CheckCircle, XCircle, Award, Sparkles, Bot, User, Timer, Clock } from 'lucide-react';

interface QuizCardProps {
  team: 'red' | 'blue';
  title: string;
  isCpu?: boolean;
  quizState: TeamQuizState;
  questions: Question[];
  keyBindings: string[]; // e.g. ['1', '2', '3', '4'] or ['7', '8', '9', '0']
  onSelectOption: (optionIndex: number) => void;
  disabled: boolean;
  questionTimeLeft?: number;
  maxQuestionTime?: number;
  isCurrentTurn?: boolean;
  playFlow?: 'turn_based' | 'simultaneous';
}

export const QuizCard: React.FC<QuizCardProps> = ({
  team,
  title,
  isCpu = false,
  quizState,
  questions,
  keyBindings,
  onSelectOption,
  disabled,
  questionTimeLeft = 15,
  maxQuestionTime = 15,
  isCurrentTurn = true,
  playFlow = 'turn_based',
}) => {
  const isRed = team === 'red';
  const currentQuestion = questions[quizState.currentIndex];
  const totalQuestions = questions.length;
  const isCompleted = quizState.isCompleted || quizState.currentIndex >= totalQuestions;
  const isWaitingTurn = playFlow === 'turn_based' && !isCurrentTurn && !isCompleted;

  const letterLabels = ['A', 'B', 'C', 'D'];

  return (
    <div
      id={`${team}-quiz-card`}
      className={`relative flex flex-col h-full rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
        isRed
          ? isCurrentTurn
            ? 'bg-gradient-to-b from-red-950/60 via-stone-900/95 to-stone-950 border-red-500 ring-2 ring-red-500/40 shadow-xl shadow-red-950/50 scale-[1.01]'
            : 'bg-stone-950/70 border-stone-800/80 opacity-70'
          : isCurrentTurn
          ? 'bg-gradient-to-b from-sky-950/60 via-stone-900/95 to-stone-950 border-sky-500 ring-2 ring-sky-500/40 shadow-xl shadow-sky-950/50 scale-[1.01]'
          : 'bg-stone-950/70 border-stone-800/80 opacity-70'
      }`}
    >
      {/* Turn indicator badge if turn-based */}
      {playFlow === 'turn_based' && !isCompleted && (
        <div className="absolute -top-3.5 left-6 z-20">
          {isCurrentTurn ? (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg animate-bounce ${
                isRed
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border border-red-400'
                  : 'bg-gradient-to-r from-sky-600 to-blue-600 border border-sky-400'
              }`}
            >
              <span>⚡ ĐANG LƯỢT TRẢ LỜI</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-stone-400 bg-stone-900 border border-stone-700">
              ⏳ Đang chờ đối thủ...
            </span>
          )}
        </div>
      )}
      {/* Team Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
              isRed
                ? 'bg-gradient-to-br from-red-500 to-rose-700 shadow-red-500/30'
                : 'bg-gradient-to-br from-sky-500 to-blue-700 shadow-sky-500/30'
            }`}
          >
            {isCpu ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-base font-extrabold tracking-wide ${isRed ? 'text-red-400' : 'text-sky-400'}`}>
                {title}
              </span>
              {isCpu && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-200 border border-sky-700/50">
                  AI Tự Trả Lời
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              {isRed ? 'Phím tắt: [1] [2] [3] [4]' : isCpu ? 'Tự động tính toán' : 'Phím tắt: [7] [8] [9] [0]'}
            </p>
          </div>
        </div>

        {/* Score count */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            <CheckCircle className="w-3.5 h-3.5" />
            {quizState.correctCount}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-rose-950/60 text-rose-300 border border-rose-800/40">
            <XCircle className="w-3.5 h-3.5" />
            {quizState.wrongCount}
          </span>
        </div>
      </div>

      {/* 10 Step Progress Dots */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
          <span className="font-semibold text-stone-300">
            Tiến độ: Câu {Math.min(quizState.currentIndex + 1, totalQuestions)} / {totalQuestions}
          </span>
          <span className={`text-[11px] font-medium ${isRed ? 'text-red-400' : 'text-sky-400'}`}>
            {Math.round((Math.min(quizState.currentIndex, totalQuestions) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
          {questions.map((_, idx) => {
            const isDone = idx < quizState.currentIndex;
            const isCurrent = idx === quizState.currentIndex && !isCompleted;
            return (
              <div
                key={idx}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? isRed
                      ? 'bg-red-400 ring-2 ring-red-400/40 scale-105 animate-pulse'
                      : 'bg-sky-400 ring-2 ring-sky-400/40 scale-105 animate-pulse'
                    : 'bg-stone-800'
                }`}
                title={`Câu ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between">
        {!isCompleted && currentQuestion ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Question card */}
              <div className="mb-3.5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      isRed
                        ? 'bg-red-950/60 text-red-300 border-red-800/50'
                        : 'bg-sky-950/60 text-sky-300 border-sky-800/50'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {currentQuestion.category || 'Đố vui'}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Per-Question Countdown Timer (15 seconds) */}
                    {!quizState.isAnswered && !disabled && (
                      <div
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-black border transition-all ${
                          questionTimeLeft <= 3
                            ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-md shadow-red-900/50 scale-105'
                            : questionTimeLeft <= 7
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/70'
                            : 'bg-stone-900 text-emerald-300 border-emerald-500/50'
                        }`}
                        title="Thời gian trả lời câu hỏi này"
                      >
                        <Timer className={`w-3.5 h-3.5 ${questionTimeLeft <= 3 ? 'animate-spin' : ''}`} />
                        <span>{questionTimeLeft}s</span>
                      </div>
                    )}
                    <span className="text-[11px] text-stone-400 font-semibold">
                      Câu {quizState.currentIndex + 1}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-stone-100 leading-snug min-h-[46px] flex items-center">
                  {currentQuestion.question}
                </h3>

                {/* Question countdown progress bar */}
                {!quizState.isAnswered && !disabled && (
                  <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden mt-2 mb-1 border border-stone-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        questionTimeLeft <= 3
                          ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                          : questionTimeLeft <= 7
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{
                        width: `${Math.max(0, Math.min(100, (questionTimeLeft / maxQuestionTime) * 100))}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-auto">
                {currentQuestion.options.map((optionText, optIdx) => {
                  const isSelected = quizState.selectedOption === optIdx;
                  const isCorrect = currentQuestion.correctIndex === optIdx;
                  const hasAnswered = quizState.isAnswered;

                  let buttonStyle = 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 border-stone-700/70 hover:border-stone-500';

                  if (hasAnswered) {
                    if (isSelected) {
                      buttonStyle = isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400 shadow-lg shadow-emerald-900/50 scale-[1.02]'
                        : 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-400 shadow-lg shadow-rose-900/50';
                    } else if (isCorrect) {
                      // Reveal correct answer when user picked wrong
                      buttonStyle = 'bg-emerald-950/80 text-emerald-200 border-emerald-500 ring-1 ring-emerald-500/50';
                    } else {
                      buttonStyle = 'bg-stone-900/50 text-stone-500 border-stone-800/50 opacity-40';
                    }
                  }

                  return (
                    <motion.button
                      key={optIdx}
                      id={`${team}-option-${optIdx}`}
                      onClick={() => !disabled && !hasAnswered && onSelectOption(optIdx)}
                      disabled={disabled || hasAnswered}
                      whileHover={!hasAnswered && !disabled ? { scale: 1.015 } : {}}
                      whileTap={!hasAnswered && !disabled ? { scale: 0.985 } : {}}
                      className={`relative flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 ${buttonStyle}`}
                    >
                      {/* Key badge / Letter indicator */}
                      <span
                        className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          hasAnswered && isSelected
                            ? isCorrect
                              ? 'bg-emerald-700 text-white'
                              : 'bg-rose-700 text-white'
                            : 'bg-stone-900/80 text-stone-300 border border-stone-700/50'
                        }`}
                      >
                        {hasAnswered && isSelected ? (
                          isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
                        ) : (
                          `${letterLabels[optIdx]}`
                        )}
                      </span>

                      {/* Option text */}
                      <span className="text-xs sm:text-sm font-medium leading-tight flex-1 break-words">
                        {optionText}
                      </span>

                      {/* Keyboard shortcut hint */}
                      {!hasAnswered && keyBindings[optIdx] && (
                        <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-900/70 text-stone-400 border border-stone-700/60">
                          {keyBindings[optIdx]}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Status message during 0.5s feedback */}
              <div className="h-6 mt-2 flex items-center justify-center">
                {quizState.isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      quizState.lastResult === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {quizState.isTimeout ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span className="text-rose-400 font-extrabold">
                          Hết {maxQuestionTime} giây! Bị trừ lượt trượt dây (-8%)
                        </span>
                      </>
                    ) : quizState.lastResult === 'correct' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Chính xác! Kéo mạnh về phía bạn (+20%)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Chưa chính xác! Bị trượt dây (-8%)
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Finished questions view */
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
                isRed
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-stone-100 mb-1">
              Đã hoàn thành {totalQuestions} câu!
            </h4>
            <p className="text-xs text-stone-400 max-w-xs mb-3">
              Kết quả: Trả lời đúng <strong className="text-emerald-400">{quizState.correctCount}</strong> / {totalQuestions} câu.
            </p>
            <div className="px-3 py-1.5 rounded-lg bg-stone-900/80 border border-stone-800 text-[11px] text-stone-400">
              Đang đợi kết thúc trận đấu hoặc đối thủ hoàn thành...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
