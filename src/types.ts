export type GameMode = 'p_vs_cpu' | 'p_vs_p';
export type PlayFlow = 'turn_based' | 'simultaneous'; // Luân phiên từng đội vs Cùng lúc
export type CurrentTurn = 'red' | 'blue';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'countdown' | 'playing' | 'finished';
export type ActiveTab = 'battle' | 'questions';

export interface Question {
  id: number;
  question: string;
  options: string[]; // [A, B, C, D]
  correctIndex: number; // 0, 1, 2, 3
  explanation?: string;
  category?: string;
  team?: 'red' | 'blue' | 'both';
}

export interface TeamQuizState {
  currentIndex: number; // 0 to 9
  correctCount: number;
  wrongCount: number;
  selectedOption: number | null;
  isAnswered: boolean;
  lastResult: 'correct' | 'wrong' | null;
  isCompleted: boolean;
  isTimeout?: boolean;
}

export interface GameSettings {
  totalGameTime: number; // default 120 seconds (2 phút)
  questionTimeLimit: number; // default 15 seconds
}

export interface GameResult {
  winner: 'player1' | 'player2' | 'draw';
  reason: 'boundary' | 'completed' | 'timeout';
  redCorrect: number;
  redWrong: number;
  blueCorrect: number;
  blueWrong: number;
  finalPosition: number;
  durationSeconds: number;
}
