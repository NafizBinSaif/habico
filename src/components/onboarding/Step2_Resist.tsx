import React, { useState } from 'react';
import { Rock } from '../Rock';
import type { User } from '../../types';

interface StepProps {
  onNext: () => void;
  user: User;
}

export const Step2_Resist: React.FC<StepProps> = ({ onNext, user }) => {
  const [demoCleanliness, setDemoCleanliness] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const hasCustomName = user && user.name !== 'Friend';

  const handleRevealClean = () => {
    setDemoCleanliness(25);
    setIsRevealed(true);
  };
  
  return (
    <>
      {hasCustomName && (
        <p className="text-xl text-habico-text-secondary dark:text-dark-habico-text-secondary mb-2 animate-bubble-in">
          Right, {user.name}! Now I remember.
        </p>
      )}
      <h1 className="text-4xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-4">
        When you resist...
      </h1>
      <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-8">
        ...you help me get clean. A small win for you is a big deal for me.
      </p>
      
      <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] mx-auto my-8">
        <Rock cleanliness={demoCleanliness} />
      </div>

      {!isRevealed ? (
        <button
          onClick={handleRevealClean}
          className="w-full max-w-xs mx-auto text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          See How It Works
        </button>
      ) : (
        <button
          onClick={onNext}
          className="w-full max-w-xs mx-auto text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800 animate-bubble-in"
        >
          Continue
        </button>
      )}
    </>
  );
};