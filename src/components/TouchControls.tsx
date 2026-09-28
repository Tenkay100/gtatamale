import React from 'react';

interface TouchControlsProps {
  onDirectionChange: (direction: string | null) => void;
  onAction: () => void;
  onMap: () => void;
}

const TouchControls: React.FC<TouchControlsProps> = ({ onDirectionChange, onAction, onMap }) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-between items-end px-4 md:hidden pointer-events-none">
      {/* D-Pad */}
      <div className="pointer-events-auto relative w-28 h-28">
        <button
          className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white active:bg-white/40"
          onTouchStart={(e) => { e.preventDefault(); onDirectionChange('up'); }}
          onTouchEnd={() => onDirectionChange(null)}
        >▲</button>
        <button
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white active:bg-white/40"
          onTouchStart={(e) => { e.preventDefault(); onDirectionChange('down'); }}
          onTouchEnd={() => onDirectionChange(null)}
        >▼</button>
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white active:bg-white/40"
          onTouchStart={(e) => { e.preventDefault(); onDirectionChange('left'); }}
          onTouchEnd={() => onDirectionChange(null)}
        >◀</button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white active:bg-white/40"
          onTouchStart={(e) => { e.preventDefault(); onDirectionChange('right'); }}
          onTouchEnd={() => onDirectionChange(null)}
        >▶</button>
      </div>

      {/* Action buttons */}
      <div className="pointer-events-auto flex flex-col gap-2">
        <button
          className="w-11 h-11 bg-yellow-500/30 rounded-full border-2 border-yellow-400 flex items-center justify-center text-yellow-300 font-bold active:bg-yellow-500/50"
          onTouchStart={(e) => { e.preventDefault(); onAction(); }}
        >E</button>
        <button
          className="w-11 h-11 bg-cyan-500/30 rounded-full border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold active:bg-cyan-500/50"
          onTouchStart={(e) => { e.preventDefault(); onMap(); }}
        >M</button>
      </div>
    </div>
  );
};

export default TouchControls;
