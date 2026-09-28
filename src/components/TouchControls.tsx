import React from 'react';

interface TouchControlsProps {
  onDirectionChange: (direction: string | null) => void;
  onAction: () => void;
  onMap: () => void;
}

const TouchControls: React.FC<TouchControlsProps> = ({ onDirectionChange, onAction, onMap }) => {
  const handleTouchStart = (direction: string) => {
    onDirectionChange(direction);
  };

  const handleTouchEnd = () => {
    onDirectionChange(null);
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-between items-end px-4 pointer-events-none md:hidden">
      {/* D-Pad */}
      <div className="pointer-events-auto relative w-32 h-32">
        {/* Up */}
        <button
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-lg
          flex items-center justify-center text-white text-xl active:bg-white/40 transition-colors"
          onTouchStart={() => handleTouchStart('up')}
          onTouchEnd={handleTouchEnd}
        >
          ▲
        </button>
        {/* Down */}
        <button
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-lg
          flex items-center justify-center text-white text-xl active:bg-white/40 transition-colors"
          onTouchStart={() => handleTouchStart('down')}
          onTouchEnd={handleTouchEnd}
        >
          ▼
        </button>
        {/* Left */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-lg
          flex items-center justify-center text-white text-xl active:bg-white/40 transition-colors"
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={handleTouchEnd}
        >
          ◀
        </button>
        {/* Right */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-lg
          flex items-center justify-center text-white text-xl active:bg-white/40 transition-colors"
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={handleTouchEnd}
        >
          ▶
        </button>
        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 rounded-full" />
      </div>

      {/* Action buttons */}
      <div className="pointer-events-auto flex flex-col gap-2">
        <button
          className="w-12 h-12 bg-yellow-500/30 backdrop-blur rounded-full border-2 border-yellow-400
          flex items-center justify-center text-yellow-300 font-bold active:bg-yellow-500/50 transition-colors"
          onTouchStart={onAction}
        >
          E
        </button>
        <button
          className="w-12 h-12 bg-cyan-500/30 backdrop-blur rounded-full border-2 border-cyan-400
          flex items-center justify-center text-cyan-300 font-bold active:bg-cyan-500/50 transition-colors"
          onTouchStart={onMap}
        >
          M
        </button>
      </div>
    </div>
  );
};

export default TouchControls;
