import React from 'react';
import { motion } from 'motion/react';
import { GameStatus } from '../types';

interface TugFieldProps {
  ropePosition: number; // -100 (Red win) to +100 (Blue win)
  lastPuller: 'player1' | 'player2' | null;
  p1PullCount: number;
  p2PullCount: number;
  gameStatus: GameStatus;
  winner: 'player1' | 'player2' | 'draw' | null;
  currentTurn?: 'red' | 'blue';
  playFlow?: 'turn_based' | 'simultaneous';
}

export const TugField: React.FC<TugFieldProps> = ({
  ropePosition,
  lastPuller,
  p1PullCount,
  p2PullCount,
  gameStatus,
  winner,
  currentTurn = 'red',
  playFlow = 'turn_based',
}) => {
  // Convert ropePosition (-100 to 100) to visual shift percentage
  // 100% threshold corresponds to ~160px shift
  const maxShiftPx = 170;
  const currentShiftPx = (ropePosition / 100) * maxShiftPx;

  const isP1Won = winner === 'player1';
  const isP2Won = winner === 'player2';
  const isPlaying = gameStatus === 'playing';

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 rounded-2xl overflow-hidden border-4 border-amber-800/20 shadow-inner flex flex-col justify-end select-none">
      {/* Background Stadium Decor & Clouds */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center opacity-90 pointer-events-none z-10">
        <div className={`flex gap-1.5 items-center transition-all ${currentTurn === 'red' && isPlaying ? 'scale-110 font-black' : 'opacity-70'}`}>
          <span className="text-xl sm:text-2xl animate-bounce">🚩</span>
          <span className={`text-xs font-black tracking-wider px-2.5 py-1 rounded-full border ${
            currentTurn === 'red' && isPlaying
              ? 'text-white bg-red-600 border-red-400 shadow-md ring-2 ring-red-400/50'
              : 'text-red-600 bg-red-100/90 border-red-300'
          }`}>
            ĐỘI ĐỎ {currentTurn === 'red' && isPlaying && playFlow === 'turn_based' ? '★ LƯỢT ĐI' : ''}
          </span>
        </div>

        {/* Center Banner: Turn status / Game status */}
        <div className="flex gap-1 text-xs font-black items-center bg-stone-900/90 text-white backdrop-blur-xs px-3 py-1 rounded-full border border-stone-700 shadow-md">
          {isPlaying && playFlow === 'turn_based' ? (
            currentTurn === 'red' ? (
              <span className="text-red-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Lượt Đội ĐỎ trả lời!
              </span>
            ) : (
              <span className="text-sky-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                Lượt Đội XANH trả lời!
              </span>
            )
          ) : (
            <span>🎯 Trả lời đúng để KÉO DÂY!</span>
          )}
        </div>

        <div className={`flex gap-1.5 items-center transition-all ${currentTurn === 'blue' && isPlaying ? 'scale-110 font-black' : 'opacity-70'}`}>
          <span className={`text-xs font-black tracking-wider px-2.5 py-1 rounded-full border ${
            currentTurn === 'blue' && isPlaying
              ? 'text-white bg-sky-600 border-sky-400 shadow-md ring-2 ring-sky-400/50'
              : 'text-blue-600 bg-blue-100/90 border-blue-300'
          }`}>
            ĐỘI XANH {currentTurn === 'blue' && isPlaying && playFlow === 'turn_based' ? '★ LƯỢT ĐI' : ''}
          </span>
          <span className="text-xl sm:text-2xl animate-bounce">🚩</span>
        </div>
      </div>

      {/* Clouds in sky */}
      <div className="absolute top-8 left-12 w-20 h-6 bg-white/60 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute top-14 right-20 w-28 h-7 bg-white/50 rounded-full blur-[1px] pointer-events-none" />

      {/* Crowd Silhouettes in distance */}
      <div className="absolute bottom-[108px] w-full flex justify-around opacity-30 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-5 bg-slate-700 rounded-t-full"
            style={{
              height: `${14 + (i % 5) * 4}px`,
              transform: isPlaying && i % 2 === 0 ? 'translateY(-3px)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        ))}
      </div>

      {/* Ground & Grass Lawn */}
      <div className="relative w-full h-[110px] bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 border-t-4 border-emerald-400">
        {/* Dirt path strip */}
        <div className="absolute top-0 left-0 right-0 h-9 bg-amber-700/25 border-b border-dashed border-white/40" />

        {/* Center Boundary Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 flex flex-col items-center">
          <div className="absolute -top-3 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full shadow-md flex items-center justify-center text-[8px] font-black text-amber-950">
            0
          </div>
          <div className="mt-8 text-[10px] font-extrabold text-white/90 bg-black/40 px-1.5 py-0.5 rounded tracking-wider uppercase">
            Ranh giới
          </div>
        </div>

        {/* Left Victory Threshold Line (-75%) */}
        <div
          className="absolute top-0 bottom-0 w-1 border-r-2 border-dashed border-red-400/80 z-10"
          style={{ left: `calc(50% - ${maxShiftPx}px)` }}
        >
          <div className="absolute -top-2.5 -left-3 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-black rounded-sm shadow-sm whitespace-nowrap">
            VẠCH THẮNG ĐỎ
          </div>
        </div>

        {/* Right Victory Threshold Line (+75%) */}
        <div
          className="absolute top-0 bottom-0 w-1 border-l-2 border-dashed border-blue-400/80 z-10"
          style={{ left: `calc(50% + ${maxShiftPx}px)` }}
        >
          <div className="absolute -top-2.5 -right-3 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-sm shadow-sm whitespace-nowrap">
            VẠCH THẮNG XANH
          </div>
        </div>

        {/* Grass tufts for cute visual appeal */}
        <div className="absolute bottom-2 left-8 text-emerald-300 text-xs">🌿</div>
        <div className="absolute bottom-3 left-1/4 text-emerald-300 text-xs">🌱</div>
        <div className="absolute bottom-1 right-1/4 text-emerald-300 text-xs">🌿</div>
        <div className="absolute bottom-3 right-8 text-emerald-300 text-xs">🌱</div>
      </div>

      {/* Interactive Rig: The Rope and Teams attached to it */}
      <motion.div
        className="absolute bottom-[92px] left-0 right-0 h-40 flex items-center justify-center pointer-events-none"
        animate={{
          x: currentShiftPx,
          y: isPlaying ? [0, -1.5, 1, 0] : 0,
        }}
        transition={{
          x: { type: 'spring', stiffness: 220, damping: 24 },
          y: { duration: 0.15, repeat: isPlaying ? Infinity : 0, ease: 'easeInOut' },
        }}
      >
        {/* ================= RED TEAM (P1) ================= */}
        <div className="absolute right-1/2 mr-10 flex items-end gap-1 sm:gap-2">
          {/* Player 1 - Anchor Guy */}
          <TeamMember
            color="red"
            role="anchor"
            isWinner={isP1Won}
            isLoser={isP2Won}
            isPulling={lastPuller === 'player1'}
            pullCount={p1PullCount}
          />
          {/* Player 1 - Mid */}
          <TeamMember
            color="red"
            role="mid"
            isWinner={isP1Won}
            isLoser={isP2Won}
            isPulling={lastPuller === 'player1'}
            pullCount={p1PullCount}
          />
          {/* Player 1 - Front */}
          <TeamMember
            color="red"
            role="front"
            isWinner={isP1Won}
            isLoser={isP2Won}
            isPulling={lastPuller === 'player1'}
            pullCount={p1PullCount}
          />
        </div>

        {/* ================= THE ROPE ================= */}
        <div className="relative w-[540px] sm:w-[680px] h-6 flex items-center justify-center z-15">
          {/* Rope Core with Braided Texture */}
          <div className="w-full h-3.5 sm:h-4 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full shadow-md border border-amber-900/60 relative overflow-hidden flex items-center">
            {/* Braided twist lines */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #451a03 0, #451a03 3px, transparent 3px, transparent 8px)',
              }}
            />
          </div>

          {/* Center Red Ribbon / Flag */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 flex flex-col items-center z-25">
            <motion.div
              className="w-5 h-7 bg-red-600 rounded-t-sm shadow-md border border-red-800 flex items-center justify-center text-[10px] font-black text-white"
              animate={{
                rotate: lastPuller === 'player1' ? -14 : lastPuller === 'player2' ? 14 : 0,
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 0.2 }}
            >
              ★
            </motion.div>
            <div className="w-1 h-3 bg-amber-900" />
            {/* Hanging ribbon tails */}
            <div className="flex gap-0.5">
              <div className="w-1.5 h-4 bg-red-600 -rotate-12 rounded-b-xs shadow-xs" />
              <div className="w-1.5 h-4 bg-red-600 rotate-12 rounded-b-xs shadow-xs" />
            </div>
          </div>
        </div>

        {/* ================= BLUE TEAM (P2/CPU) ================= */}
        <div className="absolute left-1/2 ml-10 flex items-end gap-1 sm:gap-2">
          {/* Player 2 - Front */}
          <TeamMember
            color="blue"
            role="front"
            isWinner={isP2Won}
            isLoser={isP1Won}
            isPulling={lastPuller === 'player2'}
            pullCount={p2PullCount}
          />
          {/* Player 2 - Mid */}
          <TeamMember
            color="blue"
            role="mid"
            isWinner={isP2Won}
            isLoser={isP1Won}
            isPulling={lastPuller === 'player2'}
            pullCount={p2PullCount}
          />
          {/* Player 2 - Anchor Guy */}
          <TeamMember
            color="blue"
            role="anchor"
            isWinner={isP2Won}
            isLoser={isP1Won}
            isPulling={lastPuller === 'player2'}
            pullCount={p2PullCount}
          />
        </div>
      </motion.div>
    </div>
  );
};

/* Individual Team Member Cartoon Graphic */
interface TeamMemberProps {
  color: 'red' | 'blue';
  role: 'anchor' | 'mid' | 'front';
  isWinner: boolean;
  isLoser: boolean;
  isPulling: boolean;
  pullCount: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  color,
  role,
  isWinner,
  isLoser,
  isPulling,
}) => {
  const isRed = color === 'red';

  // Base leaning angles:
  // Red leans backward to the left (negative degrees)
  // Blue leans backward to the right (positive degrees)
  const baseAngle = isRed
    ? role === 'anchor'
      ? -28
      : role === 'mid'
      ? -24
      : -20
    : role === 'anchor'
    ? 28
    : role === 'mid'
    ? 24
    : 20;

  // Extra straining angle on tap
  const pullTilt = isPulling ? (isRed ? -8 : 8) : 0;
  const currentAngle = isWinner ? (isRed ? -10 : 10) : isLoser ? (isRed ? 45 : -45) : baseAngle + pullTilt;

  const heightClass =
    role === 'anchor' ? 'h-24 w-12 sm:h-28 sm:w-14' : role === 'mid' ? 'h-22 w-11 sm:h-26 sm:w-13' : 'h-20 w-10 sm:h-24 sm:w-12';

  const shirtColor = isRed ? '#ef4444' : '#3b82f6';
  const headbandColor = isRed ? '#b91c1c' : '#1d4ed8';

  return (
    <motion.div
      className={`relative flex flex-col items-center origin-bottom select-none ${heightClass}`}
      animate={{
        rotate: currentAngle,
        y: isWinner ? [0, -12, 0] : isLoser ? 15 : isPulling ? [0, -4, 0] : 0,
      }}
      transition={{
        rotate: { type: 'spring', stiffness: 350, damping: 20 },
        y: isWinner
          ? { duration: 0.4, repeat: Infinity, ease: 'easeOut' }
          : { duration: 0.12 },
      }}
    >
      {/* Floating sweat drop or victory icon */}
      {isPulling && !isWinner && !isLoser && (
        <span
          className={`absolute -top-3 ${
            isRed ? '-left-2' : '-right-2'
          } text-xs sm:text-sm animate-ping pointer-events-none`}
        >
          💦
        </span>
      )}
      {isWinner && (
        <span className="absolute -top-6 text-base sm:text-lg animate-bounce pointer-events-none">
          🎉
        </span>
      )}
      {isLoser && (
        <span className="absolute -top-4 text-xs sm:text-sm pointer-events-none">
          😵
        </span>
      )}

      {/* SVG Cartoon Character */}
      <svg viewBox="0 0 60 90" className="w-full h-full drop-shadow-md">
        {/* Headband Ties */}
        {isRed ? (
          <path d="M 18 16 Q 10 14 6 18 Q 8 22 16 20 Z" fill={headbandColor} />
        ) : (
          <path d="M 42 16 Q 50 14 54 18 Q 52 22 44 20 Z" fill={headbandColor} />
        )}

        {/* Head */}
        <circle cx="30" cy="20" r="14" fill="#fed7aa" stroke="#9a3412" strokeWidth="2" />

        {/* Headband */}
        <path
          d="M 16 16 C 20 12 40 12 44 16 L 44 21 C 40 17 20 17 16 21 Z"
          fill={headbandColor}
        />

        {/* Facial Expression */}
        {isWinner ? (
          /* Joyful eyes & huge smile */
          <g>
            <path d="M 23 19 Q 25 16 27 19" stroke="#431407" strokeWidth="2.2" fill="none" />
            <path d="M 33 19 Q 35 16 37 19" stroke="#431407" strokeWidth="2.2" fill="none" />
            <path d="M 24 25 Q 30 32 36 25 Z" fill="#b91c1c" stroke="#431407" strokeWidth="1.5" />
          </g>
        ) : isLoser ? (
          /* Dizzy X eyes & wavy mouth */
          <g>
            <path d="M 22 17 L 27 22 M 27 17 L 22 22" stroke="#431407" strokeWidth="2" />
            <path d="M 33 17 L 38 22 M 38 17 L 33 22" stroke="#431407" strokeWidth="2" />
            <path d="M 25 28 Q 30 24 35 28" stroke="#431407" strokeWidth="2" fill="none" />
          </g>
        ) : (
          /* Straining face: Gritted teeth, intense squint eyes */
          <g>
            <path
              d={isRed ? 'M 22 19 L 27 18' : 'M 33 18 L 38 19'}
              stroke="#431407"
              strokeWidth="2.5"
            />
            <path
              d={isRed ? 'M 32 18 L 37 19' : 'M 23 19 L 28 18'}
              stroke="#431407"
              strokeWidth="2.5"
            />
            {/* Gritted teeth box */}
            <rect
              x="23"
              y="24"
              width="14"
              height="6"
              rx="2"
              fill="#ffffff"
              stroke="#431407"
              strokeWidth="1.5"
            />
            <line x1="30" y1="24" x2="30" y2="30" stroke="#431407" strokeWidth="1" />
            <line x1="26" y1="27" x2="34" y2="27" stroke="#431407" strokeWidth="1" />
          </g>
        )}

        {/* Body / Jersey */}
        <path
          d="M 20 34 L 40 34 L 38 58 L 22 58 Z"
          fill={shirtColor}
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Team Number */}
        <text
          x="30"
          y="48"
          fill="#ffffff"
          fontSize="11"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {role === 'anchor' ? '1' : role === 'mid' ? '2' : '3'}
        </text>

        {/* Shorts */}
        <path
          d="M 21 58 L 39 58 L 40 70 L 32 70 L 30 63 L 28 70 L 20 70 Z"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Legs & Shoes */}
        <g stroke="#9a3412" strokeWidth="3" fill="none">
          {/* Left leg */}
          <line x1="25" y1="70" x2={isRed ? '18' : '23'} y2="84" />
          {/* Right leg */}
          <line x1="35" y1="70" x2={isRed ? '28' : '42'} y2="84" />
        </g>
        {/* Shoes */}
        <ellipse
          cx={isRed ? '16' : '22'}
          cy="85"
          rx="6"
          ry="3.5"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.5"
        />
        <ellipse
          cx={isRed ? '26' : '44'}
          cy="85"
          rx="6"
          ry="3.5"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Arms gripping rope */}
        <g stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {isRed ? (
            /* Red reaches forward (rightward) to grab rope */
            <>
              <line x1="24" y1="40" x2="42" y2="46" />
              <line x1="42" y1="46" x2="52" y2="52" />
            </>
          ) : (
            /* Blue reaches forward (leftward) to grab rope */
            <>
              <line x1="36" y1="40" x2="18" y2="46" />
              <line x1="18" y1="46" x2="8" y2="52" />
            </>
          )}
        </g>
        {/* Hands */}
        <circle cx={isRed ? 52 : 8} cy="52" r="3.5" fill="#fbcfe8" stroke="#9a3412" strokeWidth="1" />
        <circle cx={isRed ? 44 : 16} cy="48" r="3" fill="#fbcfe8" stroke="#9a3412" strokeWidth="1" />
      </svg>
    </motion.div>
  );
};
