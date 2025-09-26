import React, { useState } from 'react';
import { Rock } from '../Rock';

interface StepProps {
  onNext: () => void;
}

export const Step3_GiveIn: React.FC<StepProps> = ({ onNext }) => {
  const [demoCleanliness, setDemoCleanliness] = useState(25); // Start from previous step's state
  const [isRevealed, setIsRevealed] = useState(false);

  const handleRevealDirty = () => {
    setDemoCleanliness(10);
    setIsRevealed(true);
  };
  
  return (
    <>
      <h1 className="text-4xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-4">
        And when you give in...
      </h1>
      <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-8">
        ...we get a little muddy. It happens. The goal is to learn from it, not to be perfect.
      </p>
      
      <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] mx-auto my-8">
        <Rock cleanliness={demoCleanliness} />
      </div>

      {!isRevealed ? (
         <button
          onClick={handleRevealDirty}
          className="w-full max-w-xs mx-auto text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-red dark:bg-dark-habico-red text-white focus:ring-red-300 dark:focus:ring-red-800"
        >
          Show Me
        </button>
      ) : (
        <button
          onClick={onNext}
          className="w-full max-w-xs mx-auto text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800 animate-bubble-in"
        >
          I Understand
        </button>
      )}
    </>
  );
};
