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
  completedMissions,
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

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      <svg
        viewBox={`${cameraX} ${cameraY} ${viewWidth} ${viewHeight}`}
        className="w-full h-full"
        style={{ imageRendering: 'auto' }}
      >
        {/* Ground */}
        <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#2d3436" />

        {/* Grass/park areas */}
        <rect x="50" y="50" width="100" height="80" fill="#1e5631" opacity="0.3" rx="5" />
        <rect x="750" y="500" width="120" height="100" fill="#1e5631" opacity="0.3" rx="5" />
        <rect x="800" y="80" width="80" height="60" fill="#1e5631" opacity="0.2" rx="5" />

        {/* Trees (decorative) */}
        {[
          [70, 70], [90, 85], [120, 65], [130, 95],
          [770, 520], [790, 540], [810, 510], [830, 560],
          [810, 90], [830, 110], [850, 95],
          [60, 250], [80, 270], [55, 290],
          [820, 300], [840, 320],
        ].map(([x, y], i) => (
          <g key={`tree-${i}`}>
            <circle cx={x} cy={y} r="5" fill="#2d6a4f" opacity="0.7" />
            <circle cx={x} cy={y - 2} r="4" fill="#40916c" opacity="0.6" />
          </g>
        ))}

        {/* Water feature / pond */}
        <ellipse cx="830" cy="100" rx="25" ry="15" fill="#1a5276" opacity="0.5" />
        <ellipse cx="830" cy="100" rx="20" ry="12" fill="#2980b9" opacity="0.3" />

        {/* Roads */}
        {roads.map((road, index) => (
          <g key={index}>
            <line
              x1={road.x1}
              y1={road.y1}
              x2={road.x2}
              y2={road.y2}
              stroke="#555"
              strokeWidth={road.width + 4}
              strokeLinecap="round"
            />
            <line
              x1={road.x1}
              y1={road.y1}
              x2={road.x2}
              y2={road.y2}
              stroke="#666"
              strokeWidth={road.width}
              strokeLinecap="round"
            />
            {/* Road markings */}
            <line
              x1={road.x1}
              y1={road.y1}
              x2={road.x2}
              y2={road.y2}
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
          const isCompleted = currentMission && completedMissions.includes(currentMission.id);

          return (
            <g key={loc.id}>
              {/* Building shadow */}
              <rect
                x={loc.x + 3}
                y={loc.y + 3}
                width={loc.width}
                height={loc.height}
                fill="rgba(0,0,0,0.3)"
                rx="3"
              />
              {/* Building */}
              <rect
                x={loc.x}
                y={loc.y}
                width={loc.width}
                height={loc.height}
                fill={loc.color}
                stroke={isMissionTarget ? '#ffff00' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isMissionTarget ? 3 : 1}
                rx="3"
                opacity={0.85}
              />
              {/* Building details */}
              {loc.type === 'landmark' && (
                <>
                  <rect
                    x={loc.x + loc.width * 0.3}
                    y={loc.y - 8}
                    width={loc.width * 0.4}
                    height={8}
                    fill={loc.color}
                    opacity="0.9"
                  />
                  <circle
                    cx={loc.x + loc.width / 2}
                    cy={loc.y - 12}
                    r="4"
                    fill="#ffd700"
                  />
                </>
              )}
              {/* Building name */}
              <text
                x={loc.x + loc.width / 2}
                y={loc.y + loc.height / 2 - 4}
                fill="white"
                fontSize="6"
                textAnchor="middle"
                fontWeight="bold"
                style={{ textShadow: '1px 1px 2px black' }}
              >
                {loc.name.length > 18 ? loc.name.substring(0, 18) + '..' : loc.name}
              </text>
              <text
                x={loc.x + loc.width / 2}
                y={loc.y + loc.height / 2 + 6}
                fill="rgba(255,255,255,0.6)"
                fontSize="5"
                textAnchor="middle"
              >
                {loc.description.length > 25 ? loc.description.substring(0, 25) + '..' : loc.description}
              </text>
              {/* Mission marker */}
              {isMissionTarget && !isCompleted && (
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

        {/* NPC characters (decorative) */}
        <g opacity="0.7">
          <circle cx="420" cy="300" r="4" fill="#e17055" />
          <circle cx="350" cy="250" r="4" fill="#00b894" />
          <circle cx="500" cy="400" r="4" fill="#fdcb6e" />
          <circle cx="250" cy="180" r="4" fill="#a29bfe" />
          <circle cx="650" cy="300" r="4" fill="#ff7675" />
          <circle cx="150" cy="400" r="4" fill="#74b9ff" />
        </g>

        {/* Vehicles on roads - tro-tros and cars */}
        <g>
          {/* Tro-tro (minibus) */}
          <rect x="300" y="196" width="16" height="8" fill="#f39c12" rx="2" stroke="#e67e22" strokeWidth="0.5" />
          <rect x="302" y="197" width="4" height="3" fill="#85c1e9" opacity="0.7" />
          <rect x="308" y="197" width="4" height="3" fill="#85c1e9" opacity="0.7" />
          {/* Car */}
          <rect x="500" y="347" width="12" height="6" fill="#e74c3c" rx="2" />
          {/* Okada (motorbike) */}
          <rect x="197" y="300" width="4" height="8" fill="#2c3e50" rx="1" />
          <circle cx="199" cy="298" r="2" fill="#e74c3c" />
          {/* Another tro-tro */}
          <rect x="447" y="150" width="8" height="14" fill="#f39c12" rx="2" stroke="#e67e22" strokeWidth="0.5" />
          {/* Truck */}
          <rect x="650" y="347" width="18" height="8" fill="#7f8c8d" rx="2" />
          <rect x="652" y="348" width="5" height="4" fill="#85c1e9" opacity="0.5" />
          {/* Bicycle */}
          <circle cx="380" cy="350" r="3" fill="none" stroke="#333" strokeWidth="0.5" />
          <line x1="380" y1="347" x2="380" y2="353" stroke="#333" strokeWidth="0.5" />
        </g>

        {/* Street lights */}
        {[
          [200, 150], [200, 250], [200, 400], [200, 500],
          [450, 150], [450, 300], [450, 450],
          [700, 200], [700, 350], [700, 500],
        ].map(([x, y], i) => (
          <g key={`light-${i}`}>
            <line x1={x} y1={y} x2={x} y2={y - 8} stroke="#666" strokeWidth="1" />
            <circle cx={x} cy={y - 9} r="2" fill={timeOfDay === 'night' ? '#ffd700' : '#999'} opacity={timeOfDay === 'night' ? 0.8 : 0.3} />
            {timeOfDay === 'night' && (
              <circle cx={x} cy={y - 9} r="6" fill="#ffd700" opacity="0.15" />
            )}
          </g>
        ))}

        {/* Player */}
        <g>
          {/* Player shadow */}
          <ellipse
            cx={playerX}
            cy={playerY + 8}
            rx="6"
            ry="3"
            fill="rgba(0,0,0,0.4)"
          />
          {/* Player body */}
          <circle
            cx={playerX}
            cy={playerY}
            r="7"
            fill="#00ff88"
            stroke="white"
            strokeWidth="2"
          />
          {/* Direction indicator */}
          <circle
            cx={playerX + (playerDirection === 'right' ? 5 : playerDirection === 'left' ? -5 : 0)}
            cy={playerY + (playerDirection === 'down' ? 5 : playerDirection === 'up' ? -5 : 0)}
            r="2"
            fill="white"
          />
          {/* Player glow when moving */}
          {isMoving && (
            <circle
              cx={playerX}
              cy={playerY}
              r="10"
              fill="none"
              stroke="#00ff88"
              strokeWidth="1"
              opacity="0.5"
            >
              <animate attributeName="r" values="8;14;8" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="0.5s" repeatCount="indefinite" />
            </circle>
          )}
          {/* Name tag */}
          <text
            x={playerX}
            y={playerY - 14}
            fill="#00ff88"
            fontSize="6"
            textAnchor="middle"
            fontWeight="bold"
          >
            KWAME
          </text>
        </g>

        {/* Time overlay */}
        <rect
          x={cameraX}
          y={cameraY}
          width={viewWidth}
          height={viewHeight}
          fill={getTimeOverlay()}
          pointerEvents="none"
        />

        {/* Neon signs effect at night */}
        {timeOfDay === 'night' && (
          <g opacity="0.6">
            <text x="430" y="240" fill="#ff00ff" fontSize="8" fontWeight="bold">SUYA SPOT</text>
            <text x="340" y="140" fill="#00ffff" fontSize="6">MOSQUE</text>
            <text x="680" y="395" fill="#ffff00" fontSize="6">TRO-TRO</text>
            <text x="170" y="340" fill="#ff6600" fontSize="6">SAFEHOUSE</text>
          </g>
        )}
      </svg>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)'
        }}
      />

      {/* Vice City style scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
        }}
      />
    </div>
  );
};

export default GameWorld;
