import React from 'react';
import { locations, roads, MAP_WIDTH, MAP_HEIGHT } from '../data/tamaleMap';
import { Mission } from '../data/story';

interface GameWorldProps {
  playerX: number;
  playerY: number;
  currentMission: Mission | null;
  completedMissions: number[];
  playerDirection: string;
  isMoving: boolean;
  timeOfDay: 'day' | 'night' | 'sunset';
}

const GameWorld: React.FC<GameWorldProps> = ({
  playerX,
  playerY,
  currentMission,
  playerDirection,
  isMoving,
  timeOfDay,
}) => {
  const viewWidth = 600;
  const viewHeight = 450;

  // Camera follows player
  const cameraX = Math.max(0, Math.min(MAP_WIDTH - viewWidth, playerX - viewWidth / 2));
  const cameraY = Math.max(0, Math.min(MAP_HEIGHT - viewHeight, playerY - viewHeight / 2));

  const getTimeOverlay = () => {
    switch (timeOfDay) {
      case 'night': return 'rgba(0,0,30,0.4)';
      case 'sunset': return 'rgba(255,100,0,0.15)';
      default: return 'transparent';
    }
  };

  // Tree positions
  const trees = [
    { x: 70, y: 70 }, { x: 90, y: 85 }, { x: 120, y: 65 }, { x: 130, y: 95 },
    { x: 770, y: 520 }, { x: 790, y: 540 }, { x: 810, y: 510 }, { x: 830, y: 560 },
    { x: 810, y: 90 }, { x: 830, y: 110 }, { x: 850, y: 95 },
    { x: 60, y: 250 }, { x: 80, y: 270 }, { x: 55, y: 290 },
    { x: 820, y: 300 }, { x: 840, y: 320 },
  ];

  // Street light positions
  const streetLights = [
    { x: 200, y: 150 }, { x: 200, y: 250 }, { x: 200, y: 400 }, { x: 200, y: 500 },
    { x: 450, y: 150 }, { x: 450, y: 300 }, { x: 450, y: 450 },
    { x: 700, y: 200 }, { x: 700, y: 350 }, { x: 700, y: 500 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      <svg
        viewBox={`${cameraX} ${cameraY} ${viewWidth} ${viewHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Ground */}
        <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#2d3436" />

        {/* Grass/park areas */}
        <rect x="50" y="50" width="100" height="80" fill="#1e5631" opacity="0.3" rx="5" />
        <rect x="750" y="500" width="120" height="100" fill="#1e5631" opacity="0.3" rx="5" />
        <rect x="800" y="80" width="80" height="60" fill="#1e5631" opacity="0.2" rx="5" />

        {/* Trees */}
        {trees.map((tree, i) => (
          <g key={`tree-${i}`}>
            <circle cx={tree.x} cy={tree.y} r="5" fill="#2d6a4f" opacity="0.7" />
            <circle cx={tree.x} cy={tree.y - 2} r="4" fill="#40916c" opacity="0.6" />
          </g>
        ))}

        {/* Water feature */}
        <ellipse cx="830" cy="100" rx="25" ry="15" fill="#1a5276" opacity="0.5" />

        {/* Roads */}
        {roads.map((road, index) => (
          <g key={`road-${index}`}>
            <line
              x1={road.x1} y1={road.y1}
              x2={road.x2} y2={road.y2}
              stroke="#555"
              strokeWidth={road.width + 4}
              strokeLinecap="round"
            />
            <line
              x1={road.x1} y1={road.y1}
              x2={road.x2} y2={road.y2}
              stroke="#666"
              strokeWidth={road.width}
              strokeLinecap="round"
            />
            <line
              x1={road.x1} y1={road.y1}
              x2={road.x2} y2={road.y2}
              stroke="#ff0"
              strokeWidth="0.5"
              strokeDasharray="8,12"
              opacity="0.6"
            />
          </g>
        ))}

        {/* Buildings */}
        {locations.map((loc) => {
          const isMissionTarget = currentMission &&
            Math.abs(currentMission.locationX - loc.x) < 50 &&
            Math.abs(currentMission.locationY - loc.y) < 50;

          return (
            <g key={loc.id}>
              {/* Shadow */}
              <rect
                x={loc.x + 3} y={loc.y + 3}
                width={loc.width} height={loc.height}
                fill="rgba(0,0,0,0.3)" rx="3"
              />
              {/* Building */}
              <rect
                x={loc.x} y={loc.y}
                width={loc.width} height={loc.height}
                fill={loc.color}
                stroke={isMissionTarget ? '#ffff00' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isMissionTarget ? 3 : 1}
                rx="3"
                opacity={0.85}
              />
              {/* Landmark decoration */}
              {loc.type === 'landmark' && (
                <>
                  <rect
                    x={loc.x + loc.width * 0.3} y={loc.y - 8}
                    width={loc.width * 0.4} height={8}
                    fill={loc.color} opacity="0.9"
                  />
                  <circle cx={loc.x + loc.width / 2} cy={loc.y - 12} r="4" fill="#ffd700" />
                </>
              )}
              {/* Building name */}
              <text
                x={loc.x + loc.width / 2}
                y={loc.y + loc.height / 2 - 2}
                fill="white"
                fontSize="6"
                textAnchor="middle"
                fontWeight="bold"
              >
                {loc.name.length > 18 ? loc.name.substring(0, 18) + '..' : loc.name}
              </text>
              {/* Mission marker */}
              {isMissionTarget && (
                <g>
                  <circle
                    cx={loc.x + loc.width / 2}
                    cy={loc.y - 15}
                    r="8"
                    fill="#ffff00"
                    opacity="0.9"
                  >
                    <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <text
                    x={loc.x + loc.width / 2}
                    y={loc.y - 12}
                    fill="black"
                    fontSize="8"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    !
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Street lights */}
        {streetLights.map((light, i) => (
          <g key={`light-${i}`}>
            <line x1={light.x} y1={light.y} x2={light.x} y2={light.y - 8} stroke="#666" strokeWidth="1" />
            <circle
              cx={light.x} cy={light.y - 9} r="2"
              fill={timeOfDay === 'night' ? '#ffd700' : '#999'}
              opacity={timeOfDay === 'night' ? 0.8 : 0.3}
            />
            {timeOfDay === 'night' && (
              <circle cx={light.x} cy={light.y - 9} r="6" fill="#ffd700" opacity="0.15" />
            )}
          </g>
        ))}

        {/* Vehicles */}
        <rect x="300" y="196" width="16" height="8" fill="#f39c12" rx="2" />
        <rect x="500" y="347" width="12" height="6" fill="#e74c3c" rx="2" />
        <rect x="197" y="300" width="4" height="8" fill="#2c3e50" rx="1" />
        <rect x="447" y="150" width="8" height="14" fill="#f39c12" rx="2" />
        <rect x="650" y="347" width="18" height="8" fill="#7f8c8d" rx="2" />

        {/* NPCs */}
        <circle cx="420" cy="300" r="4" fill="#e17055" opacity="0.7" />
        <circle cx="350" cy="250" r="4" fill="#00b894" opacity="0.7" />
        <circle cx="500" cy="400" r="4" fill="#fdcb6e" opacity="0.7" />
        <circle cx="250" cy="180" r="4" fill="#a29bfe" opacity="0.7" />
        <circle cx="650" cy="300" r="4" fill="#ff7675" opacity="0.7" />

        {/* Player */}
        <g>
          <ellipse cx={playerX} cy={playerY + 8} rx="6" ry="3" fill="rgba(0,0,0,0.4)" />
          <circle cx={playerX} cy={playerY} r="7" fill="#00ff88" stroke="white" strokeWidth="2" />
          {/* Direction indicator */}
          <circle
            cx={playerX + (playerDirection === 'right' ? 5 : playerDirection === 'left' ? -5 : 0)}
            cy={playerY + (playerDirection === 'down' ? 5 : playerDirection === 'up' ? -5 : 0)}
            r="2"
            fill="white"
          />
          {/* Movement glow */}
          {isMoving && (
            <circle cx={playerX} cy={playerY} r="10" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.5">
              <animate attributeName="r" values="8;14;8" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="0.5s" repeatCount="indefinite" />
            </circle>
          )}
          {/* Name */}
          <text x={playerX} y={playerY - 14} fill="#00ff88" fontSize="6" textAnchor="middle" fontWeight="bold">
            KWAME
          </text>
        </g>

        {/* Time overlay */}
        <rect x={cameraX} y={cameraY} width={viewWidth} height={viewHeight} fill={getTimeOverlay()} pointerEvents="none" />

        {/* Neon signs at night */}
        {timeOfDay === 'night' && (
          <g opacity="0.7">
            <text x="430" y="240" fill="#ff00ff" fontSize="8" fontWeight="bold">SUYA SPOT</text>
            <text x="340" y="140" fill="#00ffff" fontSize="6">MOSQUE</text>
            <text x="680" y="395" fill="#ffff00" fontSize="6">TRO-TRO</text>
            <text x="170" y="340" fill="#ff6600" fontSize="6">SAFEHOUSE</text>
          </g>
        )}
      </svg>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)' }}
      />
    </div>
  );
};

export default GameWorld;
