import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-red-500';
    if (streak >= 3) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Legendary!';
    if (streak >= 14) return 'On fire!';
    if (streak >= 7) return 'Great streak!';
    if (streak >= 3) return 'Building momentum!';
    if (streak >= 1) return 'Keep going!';
    return 'Start your streak!';
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
      <Flame className={`w-5 h-5 ${getStreakColor(streak)}`} />
      <div className="text-sm">
        <div className="font-bold">{streak}</div>
        <div className="text-xs opacity-90">{getStreakMessage(streak)}</div>
      </div>
    </div>
  );
};