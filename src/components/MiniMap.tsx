import React from 'react';
import { locations, roads, MAP_WIDTH, MAP_HEIGHT } from '../data/tamaleMap';
import { Mission } from '../data/story';

interface MiniMapProps {
  playerX: number;
  playerY: number;
  currentMission: Mission | null;
}

const MiniMap: React.FC<MiniMapProps> = ({ playerX, playerY, currentMission }) => {
  const size = 130;
  const aspect = MAP_HEIGHT / MAP_WIDTH;
  const height = size * aspect;

  return (
    <div className="absolute bottom-20 right-3 z-40">
      <div
        className="rounded-lg border-2 border-cyan-500/60 overflow-hidden bg-gray-900/90"
        style={{ width: size, height }}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          width={size}
          height={height}
        >
          {/* Background */}
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#1a1a2e" />

          {/* Roads */}
          {roads.map((road, i) => (
            <line
              key={i}
              x1={road.x1} y1={road.y1}
              x2={road.x2} y2={road.y2}
              stroke="#444"
              strokeWidth={road.width}
            />
          ))}

          {/* Buildings */}
          {locations.map((loc) => (
            <rect
              key={loc.id}
              x={loc.x} y={loc.y}
              width={loc.width} height={loc.height}
              fill={loc.color}
              opacity={0.6}
              rx="2"
            />
          ))}

          {/* Mission marker */}
          {currentMission && (
            <g>
              <circle
                cx={currentMission.locationX + 40}
                cy={currentMission.locationY + 30}
                r="15"
                fill="#ffff00"
                opacity="0.7"
              />
              <text
                x={currentMission.locationX + 40}
                y={currentMission.locationY + 35}
                fill="black"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                !
              </text>
            </g>
          )}

          {/* Player */}
          <circle
            cx={playerX}
            cy={playerY}
            r="10"
            fill="#00ff88"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      </div>
      <div className="text-center text-cyan-400 text-[9px] mt-0.5 opacity-70 font-bold">
        TAMALE
      </div>
    </div>
  );
};

export default MiniMap;
