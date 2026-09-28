import React from 'react';

interface HUDProps {
  health: number;
  money: number;
  wantedLevel: number;
  currentMission: string;
  missionObjective: string;
  showMap: boolean;
}

const HUD: React.FC<HUDProps> = ({ health, money, wantedLevel, currentMission, missionObjective, showMap }) => {
  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start pointer-events-none z-40">
        {/* Left side - Health & Money */}
        <div className="space-y-2">
          {/* Health bar */}
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">❤️</span>
            <div className="w-32 h-4 bg-gray-800 rounded-full border border-red-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300 rounded-full"
                style={{ width: `${health}%` }}
              />
            </div>
            <span className="text-red-400 text-xs font-bold">{health}%</span>
          </div>
          {/* Money */}
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-lg border border-green-800">
            <span className="text-green-400 text-lg">💰</span>
            <span className="text-green-400 font-bold font-mono text-lg">
              GH₵{money.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right side - Wanted Level */}
        <div className="flex items-center gap-1 bg-black/60 px-3 py-1 rounded-lg border border-yellow-800">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-lg ${star <= wantedLevel ? 'text-yellow-400 animate-pulse' : 'text-gray-600'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Mission info - Bottom */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-40">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-purple-800 max-w-md">
          <div className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            📍 Current Mission
          </div>
          <div className="text-white font-bold text-sm">{currentMission}</div>
          <div className="text-gray-300 text-xs mt-1">{missionObjective}</div>
        </div>
      </div>

      {/* Mini-map indicator */}
      {!showMap && (
        <div className="absolute bottom-4 right-4 pointer-events-none z-40">
          <div className="text-gray-400 text-xs bg-black/60 px-2 py-1 rounded">
            Press M for full map
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute top-16 right-4 pointer-events-none z-40">
        <div className="bg-black/60 rounded-lg p-2 text-xs text-gray-400 space-y-1">
          <div>WASD / Arrows - Move</div>
          <div>E - Interact</div>
          <div>M - Map</div>
          <div>Space - Action</div>
        </div>
      </div>
    </>
  );
};

export default HUD;
