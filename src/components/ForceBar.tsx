import React from 'react';

interface ForceBarProps {
  ropePosition: number; // -100 to 100
  p1Cps: number;
  p2Cps: number;
  p1TotalTaps: number;
  p2TotalTaps: number;
}

export const ForceBar: React.FC<ForceBarProps> = ({
  ropePosition,
  p1Cps,
  p2Cps,
  p1TotalTaps,
  p2TotalTaps,
}) => {
  // Convert -100..100 into 0..100% for the marker position
  // -100 = 0% (far left red), 0 = 50% (middle), +100 = 100% (far right blue)
  const markerPercent = Math.min(100, Math.max(0, ((ropePosition + 100) / 200) * 100));

  // Determine current lead description
  let leadText = 'Đang cân bằng!';
  let leadColor = 'text-slate-600';
  if (ropePosition < -5) {
    leadText = `Đội Đỏ dẫn trước ${Math.abs(Math.round(ropePosition))}%`;
    leadColor = 'text-red-600';
  } else if (ropePosition > 5) {
    leadText = `Đội Xanh dẫn trước ${Math.round(ropePosition)}%`;
    leadColor = 'text-blue-600';
  }

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-md">
      {/* Top Labels: CPS & Status */}
      <div className="flex justify-between items-center mb-2 text-xs sm:text-sm font-bold">
        {/* P1 Stats */}
        <div className="flex items-center gap-2 text-red-600">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base">
              {p1Cps.toFixed(1)} <span className="text-[11px] font-medium text-slate-500">lần/giây</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{p1TotalTaps} lần kéo</span>
          </div>
        </div>

        {/* Lead Status */}
        <div className="text-center px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
          <span className={`text-xs sm:text-sm font-black tracking-wide ${leadColor}`}>
            {leadText}
          </span>
        </div>

        {/* P2 Stats */}
        <div className="flex items-center gap-2 text-blue-600 text-right">
          <div className="flex flex-col items-end">
            <span className="font-extrabold text-sm sm:text-base">
              {p2Cps.toFixed(1)} <span className="text-[11px] font-medium text-slate-500">lần/giây</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{p2TotalTaps} lần kéo</span>
          </div>
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
        </div>
      </div>

      {/* The Gauge Track */}
      <div className="relative h-6 sm:h-7 bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-300 p-0.5 flex items-center">
        {/* Left Side Fill (Red Advantage) */}
        <div
          className="h-full bg-gradient-to-r from-red-600 via-red-500 to-rose-400 rounded-l-lg transition-all duration-100 ease-out"
          style={{
            width: ropePosition < 0 ? `${(Math.abs(ropePosition) / 200) * 100}%` : '0%',
            marginLeft: ropePosition < 0 ? `${50 - (Math.abs(ropePosition) / 200) * 100}%` : '50%',
          }}
        />

        {/* Right Side Fill (Blue Advantage) */}
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 rounded-r-lg transition-all duration-100 ease-out"
          style={{
            width: ropePosition > 0 ? `${(ropePosition / 200) * 100}%` : '0%',
            marginLeft: ropePosition > 0 ? '50%' : '50%',
          }}
        />

        {/* Danger Zones (Over 70% pulls) */}
        <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-red-600/15 border-r border-red-500/30 flex items-center justify-center text-[9px] font-black text-red-700 tracking-wider">
          VẠCH THẮNG
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-blue-600/15 border-l border-blue-500/30 flex items-center justify-center text-[9px] font-black text-blue-700 tracking-wider">
          VẠCH THẮNG
        </div>

        {/* Center line notch */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-700 -translate-x-1/2 z-10" />

        {/* Dynamic Position Pin / Indicator */}
        <div
          className="absolute top-0 bottom-0 w-3 -translate-x-1/2 bg-amber-400 border-2 border-amber-900 rounded-sm shadow-md z-20 transition-all duration-100 ease-out flex items-center justify-center"
          style={{ left: `${markerPercent}%` }}
        >
          <div className="w-1 h-3 bg-amber-900 rounded-full" />
        </div>
      </div>

      {/* Gauge Scale Markers */}
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1 px-1">
        <span className="text-red-600 font-extrabold">◀ ĐỎ THẮNG 100%</span>
        <span>50%</span>
        <span className="text-slate-700 font-black">GIỮA</span>
        <span>50%</span>
        <span className="text-blue-600 font-extrabold">XANH THẮNG 100% ▶</span>
      </div>
    </div>
  );
};
