import React from 'react';
import { Mission } from '../data/story';

interface MissionPanelProps {
  mission: Mission;
  currentDialogueIndex: number;
  onAdvanceDialogue: () => void;
  onCompleteMission: () => void;
  onClose: () => void;
}

const MissionPanel: React.FC<MissionPanelProps> = ({
  mission,
  currentDialogueIndex,
  onAdvanceDialogue,
  onCompleteMission,
  onClose,
}) => {
  const isDialogueComplete = currentDialogueIndex >= mission.dialogue.length;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-purple-600 rounded-xl max-w-2xl w-full p-6 shadow-2xl shadow-purple-500/20">
        {/* Mission Title */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
            {mission.title}
          </h2>
          <span className="text-yellow-400 text-sm font-bold">
            Reward: GH₵{mission.reward.toLocaleString()}
          </span>
        </div>

        {/* Location */}
        <div className="text-cyan-400 text-sm mb-4">
          📍 {mission.location}
        </div>

        {/* Dialogue */}
        <div className="bg-black/50 rounded-lg p-4 mb-4 min-h-[120px] border border-gray-700">
          {!isDialogueComplete ? (
            <div className="space-y-2">
              {mission.dialogue.slice(0, currentDialogueIndex + 1).map((line, index) => (
                <p
                  key={index}
                  className={`font-mono text-sm ${
                    index === currentDialogueIndex ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-green-400 text-lg font-bold mb-2">✅ Mission Complete!</p>
              <p className="text-yellow-400">+GH₵{mission.reward.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {!isDialogueComplete ? (
            <button
              onClick={onAdvanceDialogue}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg
              hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105"
            >
              {currentDialogueIndex < mission.dialogue.length - 1 ? 'Continue ▶' : 'Finish ▶'}
            </button>
          ) : (
            <button
              onClick={onCompleteMission}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg
              hover:from-green-500 hover:to-emerald-500 transition-all transform hover:scale-105"
            >
              Collect Reward 💰
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex gap-1">
          {mission.dialogue.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= currentDialogueIndex ? 'bg-purple-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionPanel;
