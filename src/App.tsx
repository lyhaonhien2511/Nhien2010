/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, Difficulty, GameStatus, GameResult, TeamQuizState, ActiveTab, Question, PlayFlow, CurrentTurn } from './types';
import { sounds } from './utils/audio';
import { loadStoredQuestions, saveStoredQuestions, resetStoredQuestions } from './data/questions';
import { TugField } from './components/TugField';
import { QuizCard } from './components/QuizCard';
import { GameHeader } from './components/GameHeader';
import { GameOverModal } from './components/GameOverModal';
import { SourceCodeModal } from './components/SourceCodeModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { QuestionManager } from './components/QuestionManager';
import { TimeSettingsModal } from './components/TimeSettingsModal';
import { ModeSelectionModal } from './components/ModeSelectionModal';
import { Play, RotateCcw, Zap, HelpCircle, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('battle');

  // Question Banks (Dynamic & Persistent)
  const [redQuestions, setRedQuestions] = useState<Question[]>(() => loadStoredQuestions().red);
  const [blueQuestions, setBlueQuestions] = useState<Question[]>(() => loadStoredQuestions().blue);

  // Timing Configuration (Default: Total = 2 minutes (120s), Per-Question = 15s)
  const [totalGameTime, setTotalGameTime] = useState<number>(120); // 2 phút
  const [questionTimeLimit, setQuestionTimeLimit] = useState<number>(15); // 15 giây mỗi câu
  const [totalTimeLeft, setTotalTimeLeft] = useState<number>(120);
  const [redQuestionTimeLeft, setRedQuestionTimeLeft] = useState<number>(15);
  const [blueQuestionTimeLeft, setBlueQuestionTimeLeft] = useState<number>(15);
  const [isTimeSettingsOpen, setIsTimeSettingsOpen] = useState<boolean>(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState<boolean>(false);

  // Game Configuration (Default: p_vs_p - 2 Người chơi, playFlow: turn_based)
  const [gameMode, setGameMode] = useState<GameMode>('p_vs_p');
  const [playFlow, setPlayFlow] = useState<PlayFlow>('turn_based');
  const [currentTurn, setCurrentTurn] = useState<CurrentTurn>('red');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [countdownVal, setCountdownVal] = useState<number | string>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scores, setScores] = useState<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const [gameDuration, setGameDuration] = useState<number>(0);

  // Tug Field Physical State
  const [ropePosition, setRopePosition] = useState<number>(0); // -100 (Red win) to +100 (Blue win)
  const [lastPuller, setLastPuller] = useState<'player1' | 'player2' | null>(null);

  // Red Team Quiz State
  const [redQuiz, setRedQuiz] = useState<TeamQuizState>({
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    selectedOption: null,
    isAnswered: false,
    lastResult: null,
    isCompleted: false,
  });

  // Blue Team Quiz State
  const [blueQuiz, setBlueQuiz] = useState<TeamQuizState>({
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    selectedOption: null,
    isAnswered: false,
    lastResult: null,
    isCompleted: false,
  });

  // Modals & Result
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);

  // Refs for current values in callbacks
  const redQuestionsRef = useRef<Question[]>(redQuestions);
  redQuestionsRef.current = redQuestions;
  const blueQuestionsRef = useRef<Question[]>(blueQuestions);
  blueQuestionsRef.current = blueQuestions;

  const ropePosRef = useRef<number>(0);
  ropePosRef.current = ropePosition;
  const redQuizRef = useRef<TeamQuizState>(redQuiz);
  redQuizRef.current = redQuiz;
  const blueQuizRef = useRef<TeamQuizState>(blueQuiz);
  blueQuizRef.current = blueQuiz;
  const gameStatusRef = useRef<GameStatus>(gameStatus);
  gameStatusRef.current = gameStatus;

  const totalGameTimeRef = useRef<number>(totalGameTime);
  totalGameTimeRef.current = totalGameTime;
  const questionTimeLimitRef = useRef<number>(questionTimeLimit);
  questionTimeLimitRef.current = questionTimeLimit;
  const playFlowRef = useRef<PlayFlow>(playFlow);
  playFlowRef.current = playFlow;
  const currentTurnRef = useRef<CurrentTurn>(currentTurn);
  currentTurnRef.current = currentTurn;

  // Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  // Vibrate phone if supported
  const triggerHaptic = (isCorrect: boolean) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(isCorrect ? [40, 60, 40] : [100]);
    }
  };

  // End Game Handler
  const handleEndGame = useCallback(
    (reason: 'boundary' | 'completed' | 'timeout') => {
      if (gameStatusRef.current === 'finished') return;
      setGameStatus('finished');

      const finalPos = ropePosRef.current;
      let winner: 'player1' | 'player2' | 'draw' = 'draw';

      if (finalPos <= -5) {
        winner = 'player1';
        setScores((prev) => ({ ...prev, p1: prev.p1 + 1 }));
        sounds.playVictory();
      } else if (finalPos >= 5) {
        winner = 'player2';
        setScores((prev) => ({ ...prev, p2: prev.p2 + 1 }));
        sounds.playVictory();
      } else {
        // Tied rope position: break tie with most correct answers
        const redC = redQuizRef.current.correctCount;
        const blueC = blueQuizRef.current.correctCount;
        if (redC > blueC) {
          winner = 'player1';
          setScores((prev) => ({ ...prev, p1: prev.p1 + 1 }));
          sounds.playVictory();
        } else if (blueC > redC) {
          winner = 'player2';
          setScores((prev) => ({ ...prev, p2: prev.p2 + 1 }));
          sounds.playVictory();
        } else {
          winner = 'draw';
          sounds.playWhistle();
        }
      }

      setGameResult({
        winner,
        reason,
        redCorrect: redQuizRef.current.correctCount,
        redWrong: redQuizRef.current.wrongCount,
        blueCorrect: blueQuizRef.current.correctCount,
        blueWrong: blueQuizRef.current.wrongCount,
        finalPosition: finalPos,
        durationSeconds: totalGameTimeRef.current - totalTimeLeft,
      });
    },
    [totalTimeLeft]
  );

  // Check Boundary Victory
  useEffect(() => {
    if (gameStatus === 'playing') {
      if (ropePosition <= -100) {
        handleEndGame('boundary');
      } else if (ropePosition >= 100) {
        handleEndGame('boundary');
      }
    }
  }, [ropePosition, gameStatus, handleEndGame]);

  // Check if both teams completed all 10 questions
  useEffect(() => {
    if (gameStatus === 'playing') {
      if (redQuiz.isCompleted && blueQuiz.isCompleted) {
        // Small delay to let final animations finish
        const t = setTimeout(() => {
          handleEndGame('completed');
        }, 600);
        return () => clearTimeout(t);
      }
    }
  }, [redQuiz.isCompleted, blueQuiz.isCompleted, gameStatus, handleEndGame]);

  // Timeout Handler for Red Team (15s expired on current question)
  const handleRedTimeout = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    if (redQuizRef.current.isAnswered || redQuizRef.current.isCompleted) return;

    sounds.playTimeout();
    triggerHaptic(false);

    setRedQuiz((prev) => ({
      ...prev,
      isAnswered: true,
      lastResult: 'wrong',
      isTimeout: true,
      wrongCount: prev.wrongCount + 1,
    }));

    // Penalty: Rope slips towards Blue (+8%)
    setRopePosition((pos) => Math.min(100, pos + 8));

    // Advance to next question after 1s, and switch turn if turn_based
    setTimeout(() => {
      setRedQuiz((prev) => {
        const nextIdx = prev.currentIndex + 1;
        const finished = nextIdx >= redQuestionsRef.current.length;
        return {
          ...prev,
          currentIndex: nextIdx,
          selectedOption: null,
          isAnswered: false,
          lastResult: null,
          isTimeout: false,
          isCompleted: finished,
        };
      });
      setRedQuestionTimeLeft(questionTimeLimitRef.current);

      if (playFlowRef.current === 'turn_based') {
        setCurrentTurn('blue');
        setBlueQuestionTimeLeft(questionTimeLimitRef.current);
      }
    }, 1000);
  }, []);

  // Timeout Handler for Blue Team (15s expired on current question)
  const handleBlueTimeout = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    if (blueQuizRef.current.isAnswered || blueQuizRef.current.isCompleted) return;

    sounds.playTimeout();
    triggerHaptic(false);

    setBlueQuiz((prev) => ({
      ...prev,
      isAnswered: true,
      lastResult: 'wrong',
      isTimeout: true,
      wrongCount: prev.wrongCount + 1,
    }));

    // Penalty: Rope slips towards Red (-8%)
    setRopePosition((pos) => Math.max(-100, pos - 8));

    // Advance to next question after 1s, and switch turn if turn_based
    setTimeout(() => {
      setBlueQuiz((prev) => {
        const nextIdx = prev.currentIndex + 1;
        const finished = nextIdx >= blueQuestionsRef.current.length;
        return {
          ...prev,
          currentIndex: nextIdx,
          selectedOption: null,
          isAnswered: false,
          lastResult: null,
          isTimeout: false,
          isCompleted: finished,
        };
      });
      setBlueQuestionTimeLeft(questionTimeLimitRef.current);

      if (playFlowRef.current === 'turn_based') {
        setCurrentTurn('red');
        setRedQuestionTimeLeft(questionTimeLimitRef.current);
      }
    }, 1000);
  }, []);

  // Answer handler for Red Team (Player 1)
  const handleRedAnswer = useCallback((optionIndex: number) => {
    if (gameStatusRef.current !== 'playing') return;
    if (playFlowRef.current === 'turn_based' && currentTurnRef.current !== 'red') return;

    const currentQ = redQuestionsRef.current[redQuizRef.current.currentIndex];
    if (!currentQ || redQuizRef.current.isAnswered || redQuizRef.current.isCompleted) return;

    const isCorrect = optionIndex === currentQ.correctIndex;
    triggerHaptic(isCorrect);

    // Apply visual feedback on Red's card
    setRedQuiz((prev) => ({
      ...prev,
      selectedOption: optionIndex,
      isAnswered: true,
      lastResult: isCorrect ? 'correct' : 'wrong',
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      wrongCount: prev.wrongCount + (isCorrect ? 0 : 1),
    }));

    // Apply Tug Force
    if (isCorrect) {
      sounds.playCorrect();
      sounds.playTug(0.9);
      sounds.playRopeCreak();
      setLastPuller('player1');
      // Strong pull towards Red: -20%
      setRopePosition((pos) => Math.max(-100, pos - 20));
    } else {
      sounds.playWrong();
      // Penalty: rope slips towards Blue by +8%
      setRopePosition((pos) => Math.min(100, pos + 8));
    }

    // Advance to next question after 0.55s feedback and switch turn
    setTimeout(() => {
      setRedQuiz((prev) => {
        const nextIdx = prev.currentIndex + 1;
        const finished = nextIdx >= redQuestionsRef.current.length;
        return {
          ...prev,
          currentIndex: nextIdx,
          selectedOption: null,
          isAnswered: false,
          lastResult: null,
          isCompleted: finished,
        };
      });
      setRedQuestionTimeLeft(questionTimeLimitRef.current);

      if (playFlowRef.current === 'turn_based') {
        setCurrentTurn('blue');
        setBlueQuestionTimeLeft(questionTimeLimitRef.current);
      }
    }, 550);
  }, []);

  // Answer handler for Blue Team (Player 2 or CPU)
  const handleBlueAnswer = useCallback((optionIndex: number) => {
    if (gameStatusRef.current !== 'playing') return;
    if (playFlowRef.current === 'turn_based' && currentTurnRef.current !== 'blue') return;

    const currentQ = blueQuestionsRef.current[blueQuizRef.current.currentIndex];
    if (!currentQ || blueQuizRef.current.isAnswered || blueQuizRef.current.isCompleted) return;

    const isCorrect = optionIndex === currentQ.correctIndex;
    triggerHaptic(isCorrect);

    // Apply visual feedback on Blue's card
    setBlueQuiz((prev) => ({
      ...prev,
      selectedOption: optionIndex,
      isAnswered: true,
      lastResult: isCorrect ? 'correct' : 'wrong',
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      wrongCount: prev.wrongCount + (isCorrect ? 0 : 1),
    }));

    // Apply Tug Force
    if (isCorrect) {
      sounds.playCorrect();
      sounds.playTug(1.2);
      sounds.playRopeCreak();
      setLastPuller('player2');
      // Strong pull towards Blue: +20%
      setRopePosition((pos) => Math.min(100, pos + 20));
    } else {
      sounds.playWrong();
      // Penalty: rope slips towards Red by -8%
      setRopePosition((pos) => Math.max(-100, pos - 8));
    }

    // Advance to next question after 0.55s feedback and switch turn
    setTimeout(() => {
      setBlueQuiz((prev) => {
        const nextIdx = prev.currentIndex + 1;
        const finished = nextIdx >= blueQuestionsRef.current.length;
        return {
          ...prev,
          currentIndex: nextIdx,
          selectedOption: null,
          isAnswered: false,
          lastResult: null,
          isCompleted: finished,
        };
      });
      setBlueQuestionTimeLeft(questionTimeLimitRef.current);

      if (playFlowRef.current === 'turn_based') {
        setCurrentTurn('red');
        setRedQuestionTimeLeft(questionTimeLimitRef.current);
      }
    }, 550);
  }, []);

  // AI CPU Opponent for Blue Team
  useEffect(() => {
    if (gameStatus !== 'playing' || gameMode !== 'p_vs_cpu') return;
    if (playFlow === 'turn_based' && currentTurn !== 'blue') return;
    if (blueQuiz.isCompleted || blueQuiz.isAnswered) return;

    const currentQ = blueQuestionsRef.current[blueQuiz.currentIndex];
    if (!currentQ) return;

    // AI think speed based on difficulty
    let delay = 3200; // Easy: 3.2s
    let correctProb = 0.65; // Easy: 65% correct
    if (difficulty === 'medium') {
      delay = 2400; // Medium: 2.4s
      correctProb = 0.8; // Medium: 80% correct
    } else if (difficulty === 'hard') {
      delay = 1700; // Hard: 1.7s
      correctProb = 0.92; // Hard: 92% correct
    }

    // Add jitter
    const finalDelay = delay + (Math.random() - 0.5) * 600;

    const timer = setTimeout(() => {
      if (gameStatusRef.current !== 'playing') return;
      if (blueQuizRef.current.isAnswered || blueQuizRef.current.isCompleted) return;

      const isWin = Math.random() < correctProb;
      let chosenOpt = currentQ.correctIndex;
      if (!isWin) {
        // Pick one of the wrong answers
        const wrongOpts = [0, 1, 2, 3].filter((i) => i !== currentQ.correctIndex);
        chosenOpt = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
      }

      handleBlueAnswer(chosenOpt);
    }, finalDelay);

    return () => clearTimeout(timer);
  }, [gameStatus, gameMode, difficulty, playFlow, currentTurn, blueQuiz.currentIndex, blueQuiz.isAnswered, blueQuiz.isCompleted, handleBlueAnswer]);

  // CRUD Operations for Questions
  const handleAddQuestion = useCallback(
    (data: {
      question: string;
      options: string[];
      correctIndex: number;
      category: string;
      explanation: string;
      team: 'red' | 'blue' | 'both';
    }) => {
      let updatedRed = redQuestionsRef.current;
      let updatedBlue = blueQuestionsRef.current;

      if (data.team === 'red' || data.team === 'both') {
        const nextId =
          updatedRed.length > 0 ? Math.max(...updatedRed.map((q) => q.id)) + 1 : 1;
        const newQ: Question = {
          id: nextId,
          question: data.question,
          options: data.options,
          correctIndex: data.correctIndex,
          category: data.category,
          explanation: data.explanation,
          team: data.team,
        };
        updatedRed = [...updatedRed, newQ];
        setRedQuestions(updatedRed);
      }

      if (data.team === 'blue' || data.team === 'both') {
        const nextId =
          updatedBlue.length > 0 ? Math.max(...updatedBlue.map((q) => q.id)) + 1 : 1;
        const newQ: Question = {
          id: nextId,
          question: data.question,
          options: data.options,
          correctIndex: data.correctIndex,
          category: data.category,
          explanation: data.explanation,
          team: data.team,
        };
        updatedBlue = [...updatedBlue, newQ];
        setBlueQuestions(updatedBlue);
      }

      saveStoredQuestions(updatedRed, updatedBlue);
    },
    []
  );

  const handleEditQuestion = useCallback(
    (
      teamSource: 'red' | 'blue' | 'both',
      id: number,
      data: {
        question: string;
        options: string[];
        correctIndex: number;
        category: string;
        explanation: string;
        team: 'red' | 'blue' | 'both';
      }
    ) => {
      let updatedRed = redQuestionsRef.current;
      let updatedBlue = blueQuestionsRef.current;

      if (teamSource === 'red') {
        updatedRed = updatedRed.map((q) =>
          q.id === id
            ? {
                ...q,
                question: data.question,
                options: data.options,
                correctIndex: data.correctIndex,
                category: data.category,
                explanation: data.explanation,
                team: data.team,
              }
            : q
        );
        setRedQuestions(updatedRed);
      } else if (teamSource === 'blue') {
        updatedBlue = updatedBlue.map((q) =>
          q.id === id
            ? {
                ...q,
                question: data.question,
                options: data.options,
                correctIndex: data.correctIndex,
                category: data.category,
                explanation: data.explanation,
                team: data.team,
              }
            : q
        );
        setBlueQuestions(updatedBlue);
      }

      saveStoredQuestions(updatedRed, updatedBlue);
    },
    []
  );

  const handleDeleteQuestion = useCallback((teamTarget: 'red' | 'blue', id: number) => {
    if (teamTarget === 'red') {
      const filtered = redQuestionsRef.current.filter((q) => q.id !== id);
      setRedQuestions(filtered);
      saveStoredQuestions(filtered, blueQuestionsRef.current);
    } else {
      const filtered = blueQuestionsRef.current.filter((q) => q.id !== id);
      setBlueQuestions(filtered);
      saveStoredQuestions(redQuestionsRef.current, filtered);
    }
  }, []);

  const handleDuplicateQuestion = useCallback((teamTarget: 'red' | 'blue', id: number) => {
    if (teamTarget === 'red') {
      const target = redQuestionsRef.current.find((q) => q.id === id);
      if (!target) return;
      const nextId = Math.max(...redQuestionsRef.current.map((q) => q.id)) + 1;
      const dup: Question = {
        ...target,
        id: nextId,
        question: `${target.question} (Bản sao)`,
      };
      const next = [...redQuestionsRef.current, dup];
      setRedQuestions(next);
      saveStoredQuestions(next, blueQuestionsRef.current);
    } else {
      const target = blueQuestionsRef.current.find((q) => q.id === id);
      if (!target) return;
      const nextId = Math.max(...blueQuestionsRef.current.map((q) => q.id)) + 1;
      const dup: Question = {
        ...target,
        id: nextId,
        question: `${target.question} (Bản sao)`,
      };
      const next = [...blueQuestionsRef.current, dup];
      setBlueQuestions(next);
      saveStoredQuestions(redQuestionsRef.current, next);
    }
  }, []);

  const handleResetDefaults = useCallback(() => {
    const fresh = resetStoredQuestions();
    setRedQuestions(fresh.red);
    setBlueQuestions(fresh.blue);
  }, []);

  const handleImportQuestions = useCallback(
    (imported: { red?: Question[]; blue?: Question[] }) => {
      let finalRed = redQuestionsRef.current;
      let finalBlue = blueQuestionsRef.current;

      if (imported.red && Array.isArray(imported.red) && imported.red.length > 0) {
        finalRed = imported.red.map((q, idx) => ({
          ...q,
          id: q.id || idx + 1,
          team: 'red',
        }));
        setRedQuestions(finalRed);
      }

      if (imported.blue && Array.isArray(imported.blue) && imported.blue.length > 0) {
        finalBlue = imported.blue.map((q, idx) => ({
          ...q,
          id: q.id || idx + 1,
          team: 'blue',
        }));
        setBlueQuestions(finalBlue);
      }

      saveStoredQuestions(finalRed, finalBlue);
    },
    []
  );

  // Match Duration & Question Countdown Timers
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      // 1. Total game countdown timer (Default 2 minutes / 120s)
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          handleEndGame('timeout');
          return 0;
        }
        return prev - 1;
      });

      setGameDuration((prev) => prev + 1);

      // 2. Red team question countdown timer (Default 15s per question)
      const isRedTurnActive =
        playFlowRef.current === 'simultaneous' || currentTurnRef.current === 'red';

      if (isRedTurnActive && !redQuizRef.current.isAnswered && !redQuizRef.current.isCompleted) {
        setRedQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            handleRedTimeout();
            return 0;
          }
          return prev - 1;
        });
      }

      // 3. Blue team question countdown timer (Default 15s per question)
      const isBlueTurnActive =
        playFlowRef.current === 'simultaneous' || currentTurnRef.current === 'blue';

      if (isBlueTurnActive && !blueQuizRef.current.isAnswered && !blueQuizRef.current.isCompleted) {
        setBlueQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            handleBlueTimeout();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, playFlow, currentTurn, handleEndGame, handleRedTimeout, handleBlueTimeout]);

  // Save new time settings from TimeSettingsModal
  const handleSaveTimeSettings = (newTotal: number, newPerQ: number) => {
    setTotalGameTime(newTotal);
    setQuestionTimeLimit(newPerQ);
    if (gameStatus === 'idle' || gameStatus === 'finished') {
      setTotalTimeLeft(newTotal);
      setRedQuestionTimeLeft(newPerQ);
      setBlueQuestionTimeLeft(newPerQ);
    }
  };

  // Start Countdown Sequence
  const startCountdown = () => {
    setGameResult(null);
    setRopePosition(0);
    setLastPuller(null);
    setGameDuration(0);
    setTotalTimeLeft(totalGameTime);
    setRedQuestionTimeLeft(questionTimeLimit);
    setBlueQuestionTimeLeft(questionTimeLimit);
    setCurrentTurn('red');

    // Reset Red Quiz
    setRedQuiz({
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      selectedOption: null,
      isAnswered: false,
      lastResult: null,
      isCompleted: false,
    });

    // Reset Blue Quiz
    setBlueQuiz({
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      selectedOption: null,
      isAnswered: false,
      lastResult: null,
      isCompleted: false,
    });

    setGameStatus('countdown');
    setCountdownVal(3);
    sounds.playBeep(false);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownVal(count);
        sounds.playBeep(false);
      } else if (count === 0) {
        setCountdownVal('BẮT ĐẦU!');
        sounds.playBeep(true);
        sounds.playWhistle();
      } else {
        clearInterval(interval);
        setGameStatus('playing');
      }
    }, 800);
  };

  // Reset Game
  const resetGame = () => {
    setGameStatus('idle');
    setRopePosition(0);
    setLastPuller(null);
    setGameResult(null);
    setGameDuration(0);
    setTotalTimeLeft(totalGameTime);
    setRedQuestionTimeLeft(questionTimeLimit);
    setBlueQuestionTimeLeft(questionTimeLimit);
    setCurrentTurn('red');

    setRedQuiz({
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      selectedOption: null,
      isAnswered: false,
      lastResult: null,
      isCompleted: false,
    });

    setBlueQuiz({
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      selectedOption: null,
      isAnswered: false,
      lastResult: null,
      isCompleted: false,
    });
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (gameStatusRef.current === 'idle') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          startCountdown();
          return;
        }
      }

      if (gameStatusRef.current !== 'playing') return;

      // RED TEAM KEYS: '1', '2', '3', '4' -> Options 0, 1, 2, 3
      if (e.key === '1') {
        e.preventDefault();
        handleRedAnswer(0);
      } else if (e.key === '2') {
        e.preventDefault();
        handleRedAnswer(1);
      } else if (e.key === '3') {
        e.preventDefault();
        handleRedAnswer(2);
      } else if (e.key === '4') {
        e.preventDefault();
        handleRedAnswer(3);
      }

      // BLUE TEAM KEYS: '7', '8', '9', '0' (or Arrow Keys in PvP)
      if (gameMode === 'p_vs_p') {
        if (e.key === '7' || e.code === 'ArrowLeft') {
          e.preventDefault();
          handleBlueAnswer(0);
        } else if (e.key === '8' || e.code === 'ArrowUp') {
          e.preventDefault();
          handleBlueAnswer(1);
        } else if (e.key === '9' || e.code === 'ArrowDown') {
          e.preventDefault();
          handleBlueAnswer(2);
        } else if (e.key === '0' || e.code === 'ArrowRight') {
          e.preventDefault();
          handleBlueAnswer(3);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, handleRedAnswer, handleBlueAnswer]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 select-none relative overflow-x-hidden">
      {/* Dynamic atmospheric lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Confetti celebration canvas */}
      <ConfettiCanvas
        active={gameStatus === 'finished' && gameResult?.winner !== 'draw'}
        winnerColor={
          gameResult?.winner === 'player1'
            ? 'red'
            : gameResult?.winner === 'player2'
            ? 'blue'
            : 'gold'
        }
      />

      {/* Main Container */}
      <main className="relative w-full max-w-[1440px] bg-stone-900/90 rounded-3xl shadow-2xl border border-stone-800 p-3 sm:p-5 flex flex-col gap-4 z-10">
        {/* Header with Mode switcher, tab switcher, scores & actions */}
        <GameHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          redCount={redQuestions.length}
          blueCount={blueQuestions.length}
          gameMode={gameMode}
          setGameMode={setGameMode}
          playFlow={playFlow}
          setPlayFlow={setPlayFlow}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          timeLeft={totalTimeLeft}
          totalGameTime={totalGameTime}
          questionTimeLimit={questionTimeLimit}
          gameStatus={gameStatus}
          scores={scores}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onStartGame={startCountdown}
          onResetGame={resetGame}
          onOpenSourceModal={() => setIsSourceModalOpen(true)}
          onOpenTimeSettings={() => setIsTimeSettingsOpen(true)}
          onOpenModeModal={() => setIsModeModalOpen(true)}
        />

        {/* TAB 1: 3-COLUMN EDUCATIONAL TUG OF WAR BATTLE ARENA */}
        {activeTab === 'battle' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* ================= COLUMN 1: RED TEAM QUIZ (LEFT) ================= */}
            <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1 flex flex-col">
              <QuizCard
                team="red"
                title="ĐỘI ĐỎ (P1)"
                isCpu={false}
                quizState={redQuiz}
                questions={redQuestions}
                keyBindings={['1', '2', '3', '4']}
                onSelectOption={handleRedAnswer}
                disabled={gameStatus !== 'playing' || (playFlow === 'turn_based' && currentTurn !== 'red')}
                questionTimeLeft={redQuestionTimeLeft}
                maxQuestionTime={questionTimeLimit}
                isCurrentTurn={currentTurn === 'red'}
                playFlow={playFlow}
              />
            </div>

            {/* ================= COLUMN 2: TUG OF WAR ARENA (CENTER) ================= */}
            <div className="lg:col-span-4 xl:col-span-6 order-1 lg:order-2 flex flex-col justify-between gap-3">
              {/* Tug Stadium with Rope and Pullers */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-800">
                <TugField
                  ropePosition={ropePosition}
                  lastPuller={lastPuller}
                  p1PullCount={redQuiz.correctCount}
                  p2PullCount={blueQuiz.correctCount}
                  gameStatus={gameStatus}
                  winner={gameResult?.winner || null}
                  currentTurn={currentTurn}
                  playFlow={playFlow}
                />

                {/* Countdown Overlay */}
                {gameStatus === 'countdown' && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center z-40">
                    <div className="text-6xl sm:text-7xl font-black text-amber-300 drop-shadow-lg animate-pulse tracking-wider">
                      {countdownVal}
                    </div>
                    <p className="text-stone-200 text-xs sm:text-sm font-bold mt-2 bg-stone-900/80 px-4 py-1.5 rounded-full border border-stone-700">
                      Sẵn sàng trả lời câu hỏi để kéo dây!
                    </p>
                  </div>
                )}

                {/* Idle Start Overlay with Mode Chooser */}
                {gameStatus === 'idle' && (
                  <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center z-30 p-3 sm:p-5 text-center gap-2.5 sm:gap-3.5">
                    {/* Quick Mode Switcher Banner on Field */}
                    <div className="bg-stone-900/95 border border-stone-700/80 rounded-2xl p-2.5 sm:p-3.5 max-w-md w-full shadow-2xl">
                      <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Chọn Chế Độ Chơi:
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsModeModalOpen(true)}
                          className="text-stone-400 hover:text-amber-300 font-bold transition-colors cursor-pointer text-[10px]"
                        >
                          Màn hình lớn ➔
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Option 1: P vs CPU */}
                        <button
                          type="button"
                          onClick={() => setGameMode('p_vs_cpu')}
                          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            gameMode === 'p_vs_cpu'
                              ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-md ring-2 ring-indigo-500/50'
                              : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                            <span>🤖</span>
                            <span>Đấu với Máy</span>
                          </div>
                          <span className="text-[10px] text-stone-400 mt-1">1 Người (Đỏ vs Máy)</span>
                        </button>

                        {/* Option 2: P vs P */}
                        <button
                          type="button"
                          onClick={() => setGameMode('p_vs_p')}
                          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            gameMode === 'p_vs_p'
                              ? 'bg-purple-950/80 border-purple-400 text-white shadow-md ring-2 ring-purple-500/50'
                              : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                            <span>👥</span>
                            <span>2 Người chơi</span>
                          </div>
                          <span className="text-[10px] text-stone-400 mt-1">Đối kháng trực tiếp</span>
                        </button>
                      </div>

                      {/* Difficulty Sub-options for CPU */}
                      {gameMode === 'p_vs_cpu' && (
                        <div className="flex items-center justify-between text-[11px] font-bold text-stone-300 mt-2 pt-2 border-t border-stone-800">
                          <span className="text-stone-400">Độ khó máy:</span>
                          <div className="flex items-center gap-1">
                            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => setDifficulty(d)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  difficulty === d
                                    ? 'bg-amber-500 text-stone-950 font-black'
                                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                                }`}
                              >
                                {d === 'easy' ? 'Dễ' : d === 'medium' ? 'Vừa' : 'Khó 🔥'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Start Button */}
                    <button
                      id="btn-center-start"
                      type="button"
                      onClick={startCountdown}
                      className="px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer border border-emerald-400/40 flex items-center gap-2 active:scale-95"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>BẮT ĐẦU TRẬN ĐẤU ({redQuestions.length} CÂU ĐỐ)</span>
                    </button>

                    {/* Hint text */}
                    <p className="text-stone-300 text-[11px] sm:text-xs font-semibold bg-stone-900/80 px-3.5 py-1 rounded-full border border-stone-800">
                      {gameMode === 'p_vs_cpu'
                        ? 'Bạn (Đỏ) bấm phím [1, 2, 3, 4] đấu với Máy tính'
                        : 'Đỏ bấm phím [1, 2, 3, 4] • Xanh bấm phím [7, 8, 9, 0]'}
                    </p>
                  </div>
                )}
              </div>

              {/* Rope Position Indicator & Live Pull Status */}
              <div className="bg-stone-950/60 rounded-2xl p-3 border border-stone-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-red-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Đỏ: {redQuiz.correctCount}/{redQuestions.length} đúng
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">
                    {ropePosition < 0
                      ? `← Đỏ kéo: ${Math.abs(Math.round(ropePosition))}%`
                      : ropePosition > 0
                      ? `Xanh kéo: ${Math.round(ropePosition)}% →`
                      : 'Cân bằng (0%)'}
                  </span>
                  <span className="text-sky-400 flex items-center gap-1">
                    Xanh: {blueQuiz.correctCount}/{blueQuestions.length} đúng
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  </span>
                </div>

                {/* Visual Balance Bar */}
                <div className="relative w-full h-3 bg-stone-900 rounded-full overflow-hidden border border-stone-800 flex">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
                    style={{ width: `${Math.max(0, 50 - ropePosition / 2)}%` }}
                  />
                  <div className="w-1 h-full bg-amber-400 z-10 shrink-0" />
                  <div
                    className="h-full bg-gradient-to-l from-sky-600 to-blue-500 transition-all duration-300"
                    style={{ width: `${Math.max(0, 50 + ropePosition / 2)}%` }}
                  />
                </div>

                {/* Game Rules Quick Hint */}
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Zap className="w-3 h-3" /> Đúng: Kéo mạnh +20%
                  </span>
                  <span className="text-rose-400">Sai: Trượt lùi -8%</span>
                  <span className="text-stone-400">Vạch thắng: 100% hoặc hết câu hỏi</span>
                </div>
              </div>
            </div>

            {/* ================= COLUMN 3: BLUE TEAM QUIZ (RIGHT) ================= */}
            <div className="lg:col-span-4 xl:col-span-3 order-3 lg:order-3 flex flex-col">
              <QuizCard
                team="blue"
                title={gameMode === 'p_vs_cpu' ? 'ĐỘI XANH (MÁY AI)' : 'ĐỘI XANH (P2)'}
                isCpu={gameMode === 'p_vs_cpu'}
                quizState={blueQuiz}
                questions={blueQuestions}
                keyBindings={gameMode === 'p_vs_cpu' ? [] : ['7', '8', '9', '0']}
                onSelectOption={handleBlueAnswer}
                disabled={
                  gameStatus !== 'playing' ||
                  gameMode === 'p_vs_cpu' ||
                  (playFlow === 'turn_based' && currentTurn !== 'blue')
                }
                questionTimeLeft={blueQuestionTimeLeft}
                maxQuestionTime={questionTimeLimit}
                isCurrentTurn={currentTurn === 'blue'}
                playFlow={playFlow}
              />
            </div>
          </div>
        )}

        {/* TAB 2: QUESTION MANAGEMENT (THÊM, SỬA, XÓA, TÌM KIẾM, KHÔI PHỤC) */}
        {activeTab === 'questions' && (
          <QuestionManager
            redQuestions={redQuestions}
            blueQuestions={blueQuestions}
            onAddQuestion={handleAddQuestion}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onDuplicateQuestion={handleDuplicateQuestion}
            onResetDefaults={handleResetDefaults}
            onImportQuestions={handleImportQuestions}
            onStartBattle={() => {
              setActiveTab('battle');
              startCountdown();
            }}
          />
        )}

        {/* Footer / Shortcut Info */}
        <footer className="flex flex-wrap items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/80">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>
              <strong>Phím tắt bàn phím:</strong> Đội Đỏ dùng [1, 2, 3, 4] | Đội Xanh dùng [7, 8, 9, 0] hoặc phím mũi tên. Có thể bấm trực tiếp vào đáp án.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSourceModalOpen(true)}
            className="text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer"
          >
            Lấy mã nguồn HTML 1 tệp duy nhất (tự động nhúng câu hỏi mới) ➔
          </button>
        </footer>
      </main>

      {/* Game Over Victory Modal */}
      <GameOverModal result={gameResult} onRestart={startCountdown} />

      {/* Standalone Source Code Modal */}
      <SourceCodeModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        redQuestions={redQuestions}
        blueQuestions={blueQuestions}
      />

      {/* Timing Configuration Modal (Total 2 min, Question 15s) */}
      <TimeSettingsModal
        isOpen={isTimeSettingsOpen}
        onClose={() => setIsTimeSettingsOpen(false)}
        totalGameTime={totalGameTime}
        questionTimeLimit={questionTimeLimit}
        onSave={handleSaveTimeSettings}
      />

      {/* Large Game Mode Selection Modal */}
      <ModeSelectionModal
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        gameMode={gameMode}
        setGameMode={setGameMode}
        playFlow={playFlow}
        setPlayFlow={setPlayFlow}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onStartGame={startCountdown}
      />
    </div>
  );
}
