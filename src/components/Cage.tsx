import React from 'react';
import { Rock } from './Rock';

interface CageProps {
  isShattered: boolean;
  topTrigger: string;
}

export const Cage: React.FC<CageProps> = ({ isShattered, topTrigger }) => {
  const barClasses = `cage-bar fill-current text-habico-text-secondary/50 dark:text-dark-habico-text-secondary/50`;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-[80%] h-[80%]">
        <Rock cleanliness={isShattered ? 90 : 15} />
      </div>

      <svg
        className={`absolute inset-0 w-full h-full overflow-visible ${isShattered ? 'shattered' : ''}`}
        viewBox="0 0 300 300"
      >
        {/* Vertical Bars */}
        <rect x="70" y="50" width="8" height="200" rx="4" className={`${barClasses} cage-bar-1`} />
        <rect x="146" y="50" width="8" height="200" rx="4" className={`${barClasses} cage-bar-2`} />
        <rect x="222" y="50" width="8" height="200" rx="4" className={`${barClasses} cage-bar-3`} />
        
        {/* Horizontal Bars */}
        <rect x="50" y="90" width="200" height="8" rx="4" className={`${barClasses} cage-bar-4`} />
        <rect x="50" y="202" width="200" height="8" rx="4" className={`${barClasses} cage-bar-5`} />
      </svg>
      
      {!isShattered && topTrigger && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-habico-red/80 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-bubble-in">
          Trigger: {topTrigger}
        </div>
      )}
    </div>
  );
};