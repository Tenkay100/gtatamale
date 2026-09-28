import React from 'react';
import { locations, roads, MAP_WIDTH, MAP_HEIGHT } from '../data/tamaleMap';
import { Mission } from '../data/story';

interface MiniMapProps {
  playerX: number;
  playerY: number;
  currentMission: Mission | null;
}

const MiniMap: React.FC<MiniMapProps> = ({ playerX, playerY, currentMission }) => {
  const miniMapSize = 120;
  const scale = miniMapSize / MAP_WIDTH;
  const viewRange = 200; // How much of the map to show around player

  return (
    <div className="absolute bottom-20 right-4 z-40 pointer-events-none">
      <div
        className="rounded-lg border-2 border-cyan-600/50 overflow-hidden bg-gray-900/80 backdrop-blur-sm"
        style={{ width: miniMapSize, height: miniMapSize * (MAP_HEIGHT / MAP_WIDTH) }}
      >
        <svg
          viewBox={`${playerX - viewRange / 2} ${playerY - (viewRange / 2) * (MAP_HEIGHT / MAP_WIDTH)} ${viewRange} ${viewRange * (MAP_HEIGHT / MAP_WIDTH)}`}
          className="w-full h-full"
        >
          {/* Background */}
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#1a1a2e" />

          {/* Roads */}
          {roads.map((road, index) => (
            <line
              key={index}
              x1={road.x1}
              y1={road.y1}
              x2={road.x2}
              y2={road.y2}
              stroke="#444"
              strokeWidth={road.width * 0.8}
              strokeLinecap="round"
            />
          ))}

          {/* Buildings */}
          {locations.map((loc) => (
            <rect
              key={loc.id}
              x={loc.x}
              y={loc.y}
              width={loc.width}
              height={loc.height}
              fill={loc.color}
              opacity={0.6}
              rx="2"
            />
          ))}

          {/* Mission marker */}
          {currentMission && (
            <circle
              cx={currentMission.locationX + 40}
              cy={currentMission.locationY + 30}
              r="8"
              fill="#ffff00"
              opacity="0.8"
            >
              <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Player */}
          <circle
            cx={playerX}
            cy={playerY}
            r="5"
            fill="#00ff88"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <div className="text-center text-cyan-400 text-[8px] mt-0.5 opacity-70">
        TAMALE MAP
      </div>
    </div>
  );
};

export default MiniMap;
