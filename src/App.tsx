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

type GameState = 'intro' | 'playing' | 'mission' | 'gameover' | 'victory';

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
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);

  // Use refs for game loop to avoid re-render issues
  const keysRef = useRef<Set<string>>(new Set());
  const playerXRef = useRef(100);
  const playerYRef = useRef(300);
  const gameStateRef = useRef<GameState>('intro');
  const touchDirRef = useRef<string | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Keep refs in sync with state
  useEffect(() => { playerXRef.current = playerX; }, [playerX]);
  useEffect(() => { playerYRef.current = playerY; }, [playerY]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

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

  // Notification helper
  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Mission interaction
  const checkMissionInteraction = useCallback(() => {
    if (!currentMission || gameStateRef.current !== 'playing') return;

    const px = playerXRef.current;
    const py = playerYRef.current;
    const dist = Math.sqrt(
      Math.pow(px - currentMission.locationX, 2) +
      Math.pow(py - currentMission.locationY, 2)
    );

    if (dist < 70) {
      setShowMissionPanel(true);
      setCurrentDialogueIndex(0);
      setGameState('mission');
    } else {
      showNotification('📍 Get closer to the mission marker! (' + Math.round(dist) + 'm away)');
    }
  }, [currentMission, showNotification]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.add(key);

      if (key === 'm' && gameStateRef.current === 'playing') {
        setShowMap(prev => !prev);
      }
      if (key === 'e' && gameStateRef.current === 'playing') {
        checkMissionInteraction();
      }
      if (key === 'escape') {
        setShowMap(false);
        if (showMissionPanel) {
          setShowMissionPanel(false);
          setGameState('playing');
        }
      }
      if (key === ' ' && currentEvent) {
        e.preventDefault();
        setCurrentEvent(null);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [checkMissionInteraction, showMissionPanel, currentEvent]);

  // Game loop - uses refs to avoid re-render loop
  useEffect(() => {
    const speed = 3;

    const gameLoop = (timestamp: number) => {
      if (gameStateRef.current !== 'playing') {
        animFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Throttle to ~60fps
      if (timestamp - lastTimeRef.current < 16) {
        animFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      lastTimeRef.current = timestamp;

      const keys = keysRef.current;
      const touchDir = touchDirRef.current;
      let newX = playerXRef.current;
      let newY = playerYRef.current;
      let moved = false;
      let dir = '';

      if (keys.has('w') || keys.has('arrowup') || touchDir === 'up') {
        newY = Math.max(10, newY - speed);
        dir = 'up';
        moved = true;
      }
      if (keys.has('s') || keys.has('arrowdown') || touchDir === 'down') {
        newY = Math.min(MAP_HEIGHT - 10, newY + speed);
        dir = 'down';
        moved = true;
      }
      if (keys.has('a') || keys.has('arrowleft') || touchDir === 'left') {
        newX = Math.max(10, newX - speed);
        dir = 'left';
        moved = true;
      }
      if (keys.has('d') || keys.has('arrowright') || touchDir === 'right') {
        newX = Math.min(MAP_WIDTH - 10, newX + speed);
        dir = 'right';
        moved = true;
      }

      if (moved) {
        playerXRef.current = newX;
        playerYRef.current = newY;
        setPlayerX(newX);
        setPlayerY(newY);
        if (dir) setPlayerDirection(dir);
      }
      setIsMoving(moved);

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []); // Empty deps - runs once

  // Random events
  useEffect(() => {
    if (gameState !== 'playing') return;

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

        setTimeout(() => setCurrentEvent(null), 5000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [gameState, currentEvent]);

  // Game over check
  useEffect(() => {
    if (health <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [health, gameState]);

  // Victory check
  useEffect(() => {
    if (completedMissions.length === missions.length && missions.length > 0 && gameState === 'playing') {
      setGameState('victory');
    }
  }, [completedMissions, gameState]);

  // Wanted level decay
  useEffect(() => {
    if (wantedLevel > 0) {
      const timer = setTimeout(() => {
        setWantedLevel(prev => Math.max(0, prev - 1));
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [wantedLevel]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    showNotification('🏠 Welcome to Tamale, Kwame. Navigate to the mission marker (yellow !) and press E.');
  };

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

  // Touch handlers
  const handleTouchDirection = (direction: string | null) => {
    touchDirRef.current = direction;
  };

  const handleTouchAction = () => {
    checkMissionInteraction();
  };

  const handleTouchMap = () => {
    setShowMap(prev => !prev);
  };

  // Focus handler for iframe environments
  const containerRef = useRef<HTMLDivElement>(null);
  const handleContainerClick = () => {
    containerRef.current?.focus();
  };

  // Auto-focus when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      containerRef.current?.focus();
    }
  }, [gameState]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={handleContainerClick}
      className="w-screen h-screen bg-black overflow-hidden select-none outline-none"
      style={{ touchAction: 'none' }}
    >
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
          {!showMap && !showMissionPanel && (
            <MiniMap
              playerX={playerX}
              playerY={playerY}
              currentMission={currentMission}
            />
          )}

          {/* Notification */}
          {notification && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50
              bg-black/90 border border-purple-500 rounded-lg px-4 py-2 text-white text-sm
              animate-bounce max-w-sm text-center">
              {notification}
            </div>
          )}

          {/* Random Events */}
          {!showMissionPanel && (
            <RandomEventPopup
              event={currentEvent}
              onCollect={() => setCurrentEvent(null)}
            />
          )}

          {/* Mission proximity indicator */}
          {currentMission && gameState === 'playing' && !showMissionPanel && (
            <MissionIndicator
              playerX={playerX}
              playerY={playerY}
              missionX={currentMission.locationX}
              missionY={currentMission.locationY}
              onInteract={checkMissionInteraction}
            />
          )}

          {/* On-screen interact button (always visible) */}
          {gameState === 'playing' && !showMissionPanel && !showMap && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">
              <button
                onClick={checkMissionInteraction}
                className="bg-yellow-500/30 border border-yellow-500/50 rounded-lg px-4 py-2 text-yellow-300 text-xs font-bold backdrop-blur-sm hover:bg-yellow-500/50 active:bg-yellow-500/70 transition-colors"
              >
                ⚡ Interact (E)
              </button>
              <button
                onClick={() => setShowMap(prev => !prev)}
                className="bg-cyan-500/30 border border-cyan-500/50 rounded-lg px-4 py-2 text-cyan-300 text-xs font-bold backdrop-blur-sm hover:bg-cyan-500/50 active:bg-cyan-500/70 transition-colors"
              >
                🗺️ Map (M)
              </button>
            </div>
          )}

          {/* Tutorial overlay */}
          {showTutorial && gameState === 'playing' && (
            <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setShowTutorial(false)}>
              <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-6 max-w-md text-center">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">🎮 How to Play</h2>
                <div className="space-y-3 text-left text-sm">
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-xl">⌨️</span>
                    <span><strong className="text-white">WASD / Arrow Keys</strong> - Move Kwame around Tamale</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-xl">🔑</span>
                    <span><strong className="text-white">E key / Interact button</strong> - Start mission when near marker</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-xl">🗺️</span>
                    <span><strong className="text-white">M key / Map button</strong> - Open full city map</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-xl">📍</span>
                    <span><strong className="text-white">Yellow ! marker</strong> - Your current mission target</span>
                  </div>
                </div>
                <p className="text-yellow-400 text-xs mt-4">
                  Navigate to the yellow marker and press E to start the mission!
                </p>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Got it! Let's play →
                </button>
              </div>
            </div>
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
            <div className="bg-black/70 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center gap-2 border border-gray-700">
              <span>{timeOfDay === 'day' ? '☀️' : timeOfDay === 'sunset' ? '🌅' : '🌙'}</span>
              <span className="capitalize">{timeOfDay}</span>
              <span className="text-gray-500">|</span>
              <span>Tamale, Ghana 🇬🇭</span>
            </div>
          </div>

          {/* Touch Controls for Mobile */}
          {isMobile && !showMissionPanel && !showMap && (
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
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-red-500 mb-4"
              style={{ textShadow: '0 0 30px rgba(255,0,0,0.7)', fontFamily: 'Arial Black, sans-serif' }}>
              WASTED
            </h1>
            <p className="text-gray-400 mb-2 text-lg">Kwame has fallen on the streets of Tamale...</p>
            <p className="text-gray-500 mb-8 text-sm">The Northern Region claims another soul</p>
            <button
              onClick={() => {
                setHealth(100);
                setPlayerX(100);
                setPlayerY(300);
                playerXRef.current = 100;
                playerYRef.current = 300;
                setWantedLevel(0);
                setMoney(prev => Math.max(0, prev - 500));
                setGameState('playing');
                showNotification('🏥 Respawned at Tamale Teaching Hospital. -GH₵500');
              }}
              className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors
              shadow-lg shadow-red-500/30 text-lg"
            >
              🏥 RESPAWN AT HOSPITAL (-GH₵500)
            </button>
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {gameState === 'victory' && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="text-center max-w-lg px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-4">
              MISSION PASSED!
            </h1>
            <p className="text-3xl text-yellow-400 mb-4">🏆 RESPECT +</p>
            <p className="text-gray-300 mb-2 text-xl">Chapter 1 Complete</p>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Kwame Mensah has reclaimed his family's legacy and freed Tamale from the Cartel's grip.
              The Northern Region will remember the name MENSAH.
            </p>
            <div className="bg-black/50 rounded-lg p-4 mb-6 border border-yellow-800">
              <div className="text-green-400 text-lg font-bold">
                💰 Total Earnings: GH₵{missions.reduce((sum, m) => sum + m.reward, 0).toLocaleString()}
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
                playerXRef.current = 100;
                playerYRef.current = 300;
                setGameState('playing');
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg
              hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30 text-lg"
            >
              🔄 PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Mission distance indicator
const MissionIndicator: React.FC<{
  playerX: number;
  playerY: number;
  missionX: number;
  missionY: number;
  onInteract: () => void;
}> = ({ playerX, playerY, missionX, missionY, onInteract }) => {
  const distance = Math.sqrt(
    Math.pow(playerX - missionX, 2) + Math.pow(playerY - missionY, 2)
  );

  const angle = Math.atan2(missionY - playerY, missionX - playerX);
  const indicatorDistance = Math.min(80, distance / 3);

  if (distance < 70) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <button
          onClick={onInteract}
          className="bg-yellow-500/30 border-2 border-yellow-400 rounded-lg px-6 py-3 text-yellow-300 text-sm font-bold animate-pulse backdrop-blur-sm hover:bg-yellow-500/50 transition-colors"
        >
          ⚡ Press E / Tap to interact
        </button>
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
      <div className="text-yellow-300 text-xs text-center whitespace-nowrap bg-black/70 rounded px-1">
        {Math.round(distance)}m
      </div>
    </div>
  );
};

export default App;
