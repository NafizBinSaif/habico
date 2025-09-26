import React from 'react';
import { Rock } from '../Rock';

interface StepProps {
  onNext: () => void;
}

export const Step1_Welcome: React.FC<StepProps> = ({ onNext }) => (
  <>
    <h1 className="text-4xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-4">
      Hi, I'm Habico.
    </h1>
    <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-8">
      Think of me as a reflection of your inner strength. That one habit you're here to break has left me muddy and weighed down. But you're here to change that.
    </p>
    
    <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] mx-auto my-8">
      <Rock cleanliness={0} />
    </div>

    <button
      onClick={onNext}
      className="w-full max-w-xs mx-auto text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800"
    >
      Let's Go
    </button>
  </>
);
