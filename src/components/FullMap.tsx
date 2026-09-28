import React from 'react';
import { locations, roads, MAP_WIDTH, MAP_HEIGHT } from '../data/tamaleMap';
import { Mission } from '../data/story';

interface FullMapProps {
  playerX: number;
  playerY: number;
  currentMission: Mission | null;
  completedMissions: number[];
  onClose: () => void;
}

const FullMap: React.FC<FullMapProps> = ({ playerX, playerY, currentMission, completedMissions, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-cyan-600 rounded-xl p-4 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-cyan-400">🗺️ TAMALE CITY MAP</h2>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close [M]
          </button>
        </div>

        {/* Map */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-600"
          style={{ width: '100%', paddingBottom: `${(MAP_HEIGHT / MAP_WIDTH) * 100}%` }}>
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="absolute inset-0 w-full h-full"
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
                stroke="#4a4a6a"
                strokeWidth={road.width}
                strokeLinecap="round"
              />
            ))}

            {/* Road names */}
            {roads.filter((_, i) => i % 2 === 0).map((road, index) => (
              <text
                key={index}
                x={(road.x1 + road.x2) / 2}
                y={(road.y1 + road.y2) / 2 - 8}
                fill="#666"
                fontSize="8"
                textAnchor="middle"
              >
                {road.name}
              </text>
            ))}

            {/* Locations */}
            {locations.map((loc) => {
              const isMissionTarget = currentMission?.locationX === loc.x && currentMission?.locationY === loc.y;
              const isCompleted = completedMissions.some(id => {
                const m = currentMission;
                return m && m.id === id;
              });

              return (
                <g key={loc.id}>
                  <rect
                    x={loc.x}
                    y={loc.y}
                    width={loc.width}
                    height={loc.height}
                    fill={loc.color}
                    opacity={0.7}
                    stroke={isMissionTarget ? '#ffff00' : '#333'}
                    strokeWidth={isMissionTarget ? 3 : 1}
                    rx="3"
                  />
                  <text
                    x={loc.x + loc.width / 2}
                    y={loc.y + loc.height / 2}
                    fill="white"
                    fontSize="7"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight="bold"
                  >
                    {loc.name.length > 15 ? loc.name.substring(0, 15) + '...' : loc.name}
                  </text>
                  {/* Mission marker */}
                  {isMissionTarget && (
                    <circle
                      cx={loc.x + loc.width / 2}
                      cy={loc.y - 10}
                      r="6"
                      fill="#ffff00"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* Player position */}
            <g>
              <circle
                cx={playerX}
                cy={playerY}
                r="8"
                fill="#00ff00"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={playerX}
                cy={playerY}
                r="12"
                fill="none"
                stroke="#00ff00"
                strokeWidth="1"
                opacity="0.5"
                className="animate-ping"
              />
            </g>

            {/* Legend */}
            <rect x="10" y={MAP_HEIGHT - 60} width="150" height="55" fill="rgba(0,0,0,0.8)" rx="5" />
            <circle cx="25" cy={MAP_HEIGHT - 45} r="4" fill="#00ff00" />
            <text x="35" y={MAP_HEIGHT - 42} fill="white" fontSize="8">You</text>
            <rect x="20" y={MAP_HEIGHT - 30} width="10" height="8" fill="#ffff00" />
            <text x="35" y={MAP_HEIGHT - 23} fill="white" fontSize="8">Mission Target</text>
            <rect x="20" y={MAP_HEIGHT - 15} width="10" height="8" fill="#ff6b35" />
            <text x="35" y={MAP_HEIGHT - 8} fill="white" fontSize="8">Location</text>
          </svg>
        </div>

        {/* Location list */}
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
          {locations.map((loc) => (
            <div key={loc.id} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: loc.color }} />
              {loc.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullMap;
