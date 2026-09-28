import React, { useState, useEffect } from 'react';
import { storyIntro } from '../data/story';

interface StoryIntroProps {
  onStart: () => void;
}

const StoryIntro: React.FC<StoryIntroProps> = ({ onStart }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentLine < storyIntro.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentLine]);

  const handleSkip = () => {
    setCurrentLine(storyIntro.length);
    setIsComplete(true);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-pink-900/50" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,255,0.03) 2px, rgba(255,0,255,0.03) 4px)`,
          }}
        />
      </div>

      {/* Retro grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30"
        style={{
          background: 'linear-gradient(to top, rgba(255,0,255,0.4), transparent)',
          backgroundImage: `
            linear-gradient(to right, rgba(255,0,255,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,0,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Title */}
      <div className="relative mb-6 text-center px-4">
        <div className="text-pink-400 text-xs tracking-[0.5em] mb-2 uppercase opacity-80">
          Rockstar Northern Games presents
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 tracking-wider leading-tight"
          style={{ fontFamily: "'Arial Black', sans-serif" }}>
          GTA
        </h1>
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 tracking-widest"
          style={{ fontFamily: "'Arial Black', sans-serif" }}>
          TAMALE VICE
        </h2>
        <p className="text-pink-300 text-sm md:text-lg mt-2 tracking-[0.3em]">
          A NORTHERN REGION STORY
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-500" />
          <span className="text-yellow-400 text-xs">🇬🇭</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-500" />
        </div>
      </div>

      {/* Story text */}
      <div className="relative max-w-2xl mx-auto px-6 h-48 overflow-y-auto mb-4">
        <div className="space-y-1">
          {storyIntro.slice(0, currentLine).map((line, index) => (
            <p
              key={index}
              className={`font-mono text-xs md:text-sm transition-all duration-300 ${
                line === '' ? 'h-2' : ''
              } ${index === currentLine - 1 ? 'text-white' : 'text-green-300/70'}`}
              style={{
                textShadow: index === currentLine - 1
                  ? '0 0 10px rgba(255,255,255,0.5)'
                  : '0 0 5px rgba(0,255,0,0.3)',
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Controls - ALWAYS visible */}
      <div className="relative mt-2 flex flex-col items-center gap-3 px-4">
        {!isComplete ? (
          <button
            onClick={handleSkip}
            className="px-6 py-2 bg-gray-800 border border-gray-600 text-gray-300 rounded-lg
            hover:bg-gray-700 hover:text-white transition-colors text-sm"
          >
            Skip Intro →
          </button>
        ) : (
          <button
            onClick={onStart}
            className="px-10 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xl rounded-lg
            hover:from-pink-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-200
            shadow-lg shadow-pink-500/50 border border-pink-400/30 animate-pulse"
          >
            🎮 START GAME
          </button>
        )}

        <div className="flex flex-wrap justify-center gap-3 text-gray-500 text-xs mt-2">
          <span>⌨️ WASD / Arrows to move</span>
          <span>🔑 E to interact</span>
          <span>🗺️ M for map</span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 left-4 text-pink-500/40 text-xs">
        © 2024 TAMALE VICE STUDIOS
      </div>
      <div className="absolute bottom-3 right-4 text-cyan-500/40 text-xs">
        NORTHERN REGION, GHANA 🇬🇭
      </div>
    </div>
  );
};

export default StoryIntro;
