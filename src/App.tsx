import React, { useState, useEffect, useCallback, useRef } from 'react';
import StoryIntro from './components/StoryIntro';
import GameWorld from './components/GameWorld';
import HUD from './components/HUD';
import MissionPanel from './components/MissionPanel';
import FullMap from './components/FullMap';
import TouchControls from './components/TouchControls';
import MiniMap from './components/MiniMap';
import { randomEvents, RandomEventPopup, RandomEvent } from './components/RandomEvents';
import { missions, Mission } from './data/story';
import { MAP_WIDTH, MAP_HEIGHT } from './data/tamaleMap';

type GameState = 'intro' | 'playing' | 'mission' | 'map' | 'gameover';

function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(300);
  const [playerDirection, setPlayerDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [health, setHealth] = useState(100);
  const [money, setMoney] = useState(200);
  const [wantedLevel, setWantedLevel] = useState(0);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showMissionPanel, setShowMissionPanel] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night' | 'sunset'>('day');
  const [isMobile, setIsMobile] = useState(false);
  const [touchDirection, setTouchDirection] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [eventCooldown, setEventCooldown] = useState(false);

  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>();

  const currentMission: Mission | null = currentMissionIndex < missions.length
    ? missions[currentMissionIndex]
    : null;

  // Detect mobile
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Time of day cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(prev => {
        if (prev === 'day') return 'sunset';
        if (prev === 'sunset') return 'night';
        return 'day';
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Show notification
  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      if (e.key.toLowerCase() === 'm' && gameState === 'playing') {
        setShowMap(prev => !prev);
      }
      if (e.key.toLowerCase() === 'e' && gameState === 'playing') {
        checkMissionInteraction();
      }
      if (e.key === 'Escape') {
        setShowMap(false);
        setShowMissionPanel(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, currentMissionIndex, playerX, playerY]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const speed = 3;

    const gameLoop = () => {
      const keys = keysPressed.current;
      let moved = false;

      let newX = playerX;
      let newY = playerY;

      // Keyboard input
      if (keys.has('w') || keys.has('arrowup') || touchDirection === 'up') {
        newY = Math.max(10, playerY - speed);
        setPlayerDirection('up');
        moved = true;
      }
      if (keys.has('s') || keys.has('arrowdown') || touchDirection === 'down') {
        newY = Math.min(MAP_HEIGHT - 10, playerY + speed);
        setPlayerDirection('down');
        moved = true;
      }
      if (keys.has('a') || keys.has('arrowleft') || touchDirection === 'left') {
        newX = Math.max(10, playerX - speed);
        setPlayerDirection('left');
        moved = true;
      }
      if (keys.has('d') || keys.has('arrowright') || touchDirection === 'right') {
        newX = Math.min(MAP_WIDTH - 10, playerX + speed);
        setPlayerDirection('right');
        moved = true;
      }

      if (moved) {
        setPlayerX(newX);
        setPlayerY(newY);
      }
      setIsMoving(moved);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, playerX, playerY, touchDirection]);

  // Check if player is near mission location
  const checkMissionInteraction = useCallback(() => {
    if (!currentMission) return;

    const dist = Math.sqrt(
      Math.pow(playerX - currentMission.locationX, 2) +
      Math.pow(playerY - currentMission.locationY, 2)
    );

    if (dist < 60) {
      setShowMissionPanel(true);
      setCurrentDialogueIndex(0);
      setGameState('mission');
    } else {
      showNotification('📍 Get closer to the mission marker!');
    }
  }, [currentMission, playerX, playerY, showNotification]);

  // Advance dialogue
  const advanceDialogue = () => {
    if (!currentMission) return;
    if (currentDialogueIndex < currentMission.dialogue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      setCurrentDialogueIndex(currentMission.dialogue.length);
    }
  };

  // Complete mission
  const completeMission = () => {
    if (!currentMission) return;
    setMoney(prev => prev + currentMission.reward);
    setCompletedMissions(prev => [...prev, currentMission.id]);
    setShowMissionPanel(false);
    setCurrentMissionIndex(prev => prev + 1);
    setGameState('playing');
    showNotification(`✅ Mission Complete! +GH₵${currentMission.reward.toLocaleString()}`);

    if (Math.random() > 0.6) {
      setWantedLevel(prev => Math.min(5, prev + 1));
    }
  };

  // Start game
  const startGame = () => {
    setGameState('playing');
    showNotification('🏠 Welcome to Tamale, Kwame. Find your way to New Town.');
  };

  // Handle game over
  useEffect(() => {
    if (health <= 0) {
      setGameState('gameover');
    }
  }, [health]);

  // Wanted level decay
  useEffect(() => {
    if (wantedLevel > 0) {
      const timer = setTimeout(() => {
        setWantedLevel(prev => Math.max(0, prev - 1));
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [wantedLevel]);

  // Random events
  useEffect(() => {
    if (gameState !== 'playing' || eventCooldown) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !currentEvent) {
        const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        setCurrentEvent(event);

        if (event.type === 'reward') {
          const reward = event.message.includes('100') ? 100 : 50;
          setMoney(prev => prev + reward);
        }
        if (event.type === 'danger') {
          setHealth(prev => Math.max(0, prev - 5));
        }

        setEventCooldown(true);
        setTimeout(() => {
          setCurrentEvent(null);
          setEventCooldown(false);
        }, 5000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [gameState, eventCooldown, currentEvent]);

  // Space key to dismiss events
  useEffect(() => {
    const handleSpace = (e: KeyboardEvent) => {
      if (e.code === 'Space' && currentEvent) {
        e.preventDefault();
        setCurrentEvent(null);
      }
    };
    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [currentEvent]);

  // Touch control handlers
  const handleTouchDirection = (direction: string | null) => {
    setTouchDirection(direction);
  };

  const handleTouchAction = () => {
    checkMissionInteraction();
  };

  const handleTouchMap = () => {
    setShowMap(prev => !prev);
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden select-none">
      {/* Intro Screen */}
      {gameState === 'intro' && (
        <StoryIntro onStart={startGame} />
      )}

      {/* Game Screen */}
      {(gameState === 'playing' || gameState === 'mission') && (
        <div className="w-full h-full relative">
          <GameWorld
            playerX={playerX}
            playerY={playerY}
            currentMission={currentMission}
            completedMissions={completedMissions}
            playerDirection={playerDirection}
            isMoving={isMoving}
            timeOfDay={timeOfDay}
          />

          <HUD
            health={health}
            money={money}
            wantedLevel={wantedLevel}
            currentMission={currentMission ? currentMission.title : 'Free Roam'}
            missionObjective={currentMission ? currentMission.objective : 'Explore Tamale'}
            showMap={showMap}
          />

          {/* Mini Map */}
          {!showMap && (
            <MiniMap
              playerX={playerX}
              playerY={playerY}
              currentMission={currentMission}
            />
          )}

          {/* Notification */}
          {notification && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50
              bg-black/80 border border-purple-500 rounded-lg px-4 py-2 text-white text-sm
              animate-bounce">
              {notification}
            </div>
          )}

          {/* Random Events */}
          <RandomEventPopup
            event={currentEvent}
            onCollect={() => setCurrentEvent(null)}
          />

          {/* Mission proximity indicator */}
          {currentMission && gameState === 'playing' && (
            <MissionIndicator
              playerX={playerX}
              playerY={playerY}
              missionX={currentMission.locationX}
              missionY={currentMission.locationY}
            />
          )}

          {/* Mission Panel */}
          {showMissionPanel && currentMission && (
            <MissionPanel
              mission={currentMission}
              currentDialogueIndex={currentDialogueIndex}
              onAdvanceDialogue={advanceDialogue}
              onCompleteMission={completeMission}
              onClose={() => {
                setShowMissionPanel(false);
                setGameState('playing');
              }}
            />
          )}

          {/* Full Map */}
          {showMap && (
            <FullMap
              playerX={playerX}
              playerY={playerY}
              currentMission={currentMission}
              completedMissions={completedMissions}
              onClose={() => setShowMap(false)}
            />
          )}

          {/* Time indicator */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-black/60 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center gap-2">
              <span>{timeOfDay === 'day' ? '☀️' : timeOfDay === 'sunset' ? '🌅' : '🌙'}</span>
              <span className="capitalize">{timeOfDay}</span>
              <span className="text-gray-500">|</span>
              <span>Tamale, Ghana 🇬🇭</span>
            </div>
          </div>

          {/* Touch Controls for Mobile */}
          {isMobile && (
            <TouchControls
              onDirectionChange={handleTouchDirection}
              onAction={handleTouchAction}
              onMap={handleTouchMap}
            />
          )}
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4" style={{ textShadow: '0 0 20px rgba(255,0,0,0.5)' }}>
              WASTED
            </h1>
            <p className="text-gray-400 mb-2 text-lg">Kwame has fallen on the streets of Tamale...</p>
            <p className="text-gray-500 mb-8 text-sm">The Northern Region claims another soul</p>
            <button
              onClick={() => {
                setHealth(100);
                setPlayerX(100);
                setPlayerY(300);
                setWantedLevel(0);
                setMoney(prev => Math.max(0, prev - 500));
                setGameState('playing');
                showNotification('🏥 Respawned at Tamale Teaching Hospital. -GH₵500');
              }}
              className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors
              shadow-lg shadow-red-500/30"
            >
              🏥 RESPAWN AT HOSPITAL (-GH₵500)
            </button>
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {completedMissions.length === missions.length && gameState === 'playing' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center max-w-lg px-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-4">
              MISSION PASSED!
            </h1>
            <p className="text-3xl text-yellow-400 mb-4">🏆 RESPECT +</p>
            <p className="text-gray-300 mb-2 text-xl">Chapter 1 Complete</p>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Kwame Mensah has reclaimed his family's legacy and freed Tamale from the Cartel's grip.
              The Northern Region will remember the name MENSAH. But the story continues...
              More territories, more enemies, more power await in Chapter 2.
            </p>
            <div className="bg-black/50 rounded-lg p-4 mb-6 border border-yellow-800">
              <div className="text-green-400 text-lg font-bold">
                💰 Total Earnings: GH₵{missions.reduce((sum, m) => sum + m.reward, 0).toLocaleString()}
              </div>
              <div className="text-purple-400 text-sm mt-1">
                🎯 Missions Completed: {missions.length}/{missions.length}
              </div>
            </div>
            <button
              onClick={() => {
                setCompletedMissions([]);
                setCurrentMissionIndex(0);
                setMoney(200);
                setWantedLevel(0);
                setHealth(100);
                setPlayerX(100);
                setPlayerY(300);
                setGameState('playing');
                showNotification('🔄 New Game Started. Back to the streets of Tamale...');
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg
              hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30"
            >
              🔄 PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Mission distance indicator component
const MissionIndicator: React.FC<{
  playerX: number;
  playerY: number;
  missionX: number;
  missionY: number;
}> = ({ playerX, playerY, missionX, missionY }) => {
  const distance = Math.sqrt(
    Math.pow(playerX - missionX, 2) + Math.pow(playerY - missionY, 2)
  );

  const angle = Math.atan2(missionY - playerY, missionX - playerX);
  const indicatorDistance = Math.min(80, distance / 3);

  if (distance < 60) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg px-4 py-2 text-yellow-300 text-sm font-bold animate-pulse backdrop-blur-sm">
          ⚡ Press E to interact
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        top: `calc(50% + ${Math.sin(angle) * indicatorDistance}px)`,
        left: `calc(50% + ${Math.cos(angle) * indicatorDistance}px)`,
      }}
    >
      <div className="text-yellow-400 text-xl animate-bounce">
        {distance > 200 ? '📍' : '⚡'}
      </div>
      <div className="text-yellow-300 text-xs text-center whitespace-nowrap bg-black/50 rounded px-1">
        {Math.round(distance)}m
      </div>
    </div>
  );
};

export default App;
