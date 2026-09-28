import React from 'react';

interface RandomEvent {
  id: string;
  message: string;
  type: 'info' | 'danger' | 'reward' | 'story';
  icon: string;
}

const randomEvents: RandomEvent[] = [
  { id: '1', message: 'A tro-tro driver offers you a ride. "Where you dey go, boss?"', type: 'info', icon: '🚐' },
  { id: '2', message: 'You spot a suya spot. The aroma of grilled meat fills the air.', type: 'info', icon: '🍖' },
  { id: '3', message: 'A street vendor shouts: "Pure water! Cold pure water!"', type: 'info', icon: '💧' },
  { id: '4', message: 'You hear music from a nearby bar. "Ayioo, come and enjoy the highlife!"', type: 'info', icon: '🎵' },
  { id: '5', message: 'An old man under a neem tree says: "Young man, be careful in these streets."', type: 'story', icon: '👴' },
  { id: '6', message: 'You find GH₵50 on the ground! Lucky day!', type: 'reward', icon: '💰' },
  { id: '7', message: 'A group of area boys eye you suspiciously...', type: 'danger', icon: '⚠️' },
  { id: '8', message: 'Radio plays: "RTU scores again at the Aliu Mahama Stadium!"', type: 'info', icon: '📻' },
  { id: '9', message: 'A woman selling shea butter calls out: "Madam, come buy original shea butter!"', type: 'info', icon: '🧴' },
  { id: '10', message: 'You pass by the famous Tamale polo grounds. The horses are magnificent.', type: 'story', icon: '🐴' },
  { id: '11', message: 'A motorbike zooms past. "Okada! Fast delivery!"', type: 'info', icon: '🏍️' },
  { id: '12', message: 'The call to prayer echoes from the Central Mosque. Peace fills the air.', type: 'story', icon: '🕌' },
  { id: '13', message: 'You notice a Cartel member watching you from across the street...', type: 'danger', icon: '👁️' },
  { id: '14', message: 'A child runs past chasing a football. "Goal! Goal!"', type: 'info', icon: '⚽' },
  { id: '15', message: 'You find a hidden stash behind a building. +GH₵100!', type: 'reward', icon: '📦' },
  { id: '16', message: 'The harmattan wind blows dust across the streets. Visibility drops.', type: 'info', icon: '🌪️' },
  { id: '17', message: 'A UDS student approaches: "Are you the new lecturer?"', type: 'info', icon: '🎓' },
  { id: '18', message: 'You overhear: "The Dagbon Cartel is planning something big tonight..."', type: 'story', icon: '🤫' },
  { id: '19', message: 'An elderly woman blesses you: "May God protect you on your journey, my son."', type: 'story', icon: '🙏' },
  { id: '20', message: 'You spot your father\'s old business partner across the road!', type: 'story', icon: '👤' },
];

interface RandomEventPopupProps {
  event: RandomEvent | null;
  onCollect: () => void;
}

const RandomEventPopup: React.FC<RandomEventPopupProps> = ({ event, onCollect }) => {
  if (!event) return null;

  const borderColor = {
    info: 'border-blue-500',
    danger: 'border-red-500',
    reward: 'border-yellow-500',
    story: 'border-purple-500',
  }[event.type];

  const bgColor = {
    info: 'bg-blue-900/30',
    danger: 'bg-red-900/30',
    reward: 'bg-yellow-900/30',
    story: 'bg-purple-900/30',
  }[event.type];

  return (
    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-45 max-w-sm w-full px-4">
      <div className={`${bgColor} backdrop-blur-sm border ${borderColor} rounded-lg p-3 
        animate-fadeIn shadow-lg`}>
        <div className="flex items-start gap-2">
          <span className="text-2xl">{event.icon}</span>
          <p className="text-white text-sm flex-1">{event.message}</p>
        </div>
        <button
          onClick={onCollect}
          className="mt-2 w-full text-center text-xs text-gray-400 hover:text-white transition-colors"
        >
          [Click or press Space to continue]
        </button>
      </div>
    </div>
  );
};

export { randomEvents, RandomEventPopup };
export type { RandomEvent };
