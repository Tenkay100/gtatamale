import React from 'react';
import { storyIntro } from '../data/story';

interface StoryIntroProps {
  onStart: () => void;
}

const StoryIntro: React.FC<StoryIntroProps> = ({ onStart }) => {
  const [currentLine, setCurrentLine] = React.useState(0);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    if (!showAll && currentLine < storyIntro.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentLine, showAll]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://image.qwenlm.ai/generated-images/832a8d81-e0c7-4736-bf14-5845759c528e/_result.png"
          alt=""
          className="w-full h-full object-cover opacity-30"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,255,0.03) 2px, rgba(255,0,255,0.03) 4px)`,
          }}
        />
      </div>

      {/* Decorative grid lines */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20"
        style={{
          background: 'linear-gradient(to top, rgba(255,0,255,0.3), transparent)',
          backgroundImage: `
            linear-gradient(to right, rgba(255,0,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,0,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Title */}
      <div className="relative mb-6 text-center">
        <div className="text-pink-400 text-xs tracking-[0.5em] mb-2 uppercase">Rockstar Northern Games presents</div>
        <h1 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 tracking-wider leading-tight"
          style={{ fontFamily: "'Arial Black', sans-serif", textShadow: '0 0 40px rgba(255,0,255,0.5)' }}>
          GTA
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 tracking-widest"
          style={{ fontFamily: "'Arial Black', sans-serif" }}>
          TAMALE VICE
        </h2>
        <p className="text-pink-300 text-sm md:text-lg mt-2 tracking-[0.3em]">A NORTHERN REGION STORY</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-500" />
          <span className="text-yellow-400 text-xs">🇬🇭</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-500" />
        </div>
      </div>

      {/* Story text */}
      <div className="relative max-w-2xl mx-auto px-6 h-56 overflow-hidden">
        <div className="space-y-1.5">
          {storyIntro.slice(0, showAll ? storyIntro.length : currentLine).map((line, index) => (
            <p
              key={index}
              className={`font-mono text-xs md:text-sm transition-all duration-500 ${
                line === '' ? 'h-3' : ''
              } ${index === (showAll ? storyIntro.length : currentLine) - 1 ? 'text-white' : 'text-green-300 opacity-70'}`}
              style={{
                textShadow: index === (showAll ? storyIntro.length : currentLine) - 1 ? '0 0 10px rgba(255,255,255,0.5)' : '0 0 10px rgba(0,255,0,0.3)',
                animation: 'fadeIn 0.5s ease-in'
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="relative mt-6 flex flex-col items-center gap-4">
        {!showAll && currentLine < storyIntro.length && (
          <button
            onClick={() => setShowAll(true)}
            className="text-gray-400 hover:text-white text-sm underline transition-colors"
          >
            Skip Intro →
          </button>
        )}
        {(showAll || currentLine >= storyIntro.length) && (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onStart}
              className="px-10 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xl rounded-lg 
              hover:from-pink-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-200
              shadow-lg shadow-pink-500/50 animate-pulse border border-pink-400/30"
            >
              🎮 START GAME
            </button>
            <div className="flex gap-4 text-gray-500 text-xs">
              <span>⌨️ WASD to move</span>
              <span>🔑 E to interact</span>
              <span>🗺️ M for map</span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-4 left-4 text-pink-500/50 text-xs">
        © 2024 TAMALE VICE STUDIOS
      </div>
      <div className="absolute top-4 right-4 text-cyan-500/50 text-xs">
        NORTHERN REGION, GHANA 🇬🇭
      </div>
      <div className="absolute top-4 left-4 text-yellow-500/50 text-xs">
        RATED M FOR MATURE
      </div>
    </div>
  );
};

export default StoryIntro;
