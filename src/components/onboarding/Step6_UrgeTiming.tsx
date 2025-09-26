import React, { useState } from 'react';
import { Rock } from '../Rock';
import { SurveyProgressDots } from './SurveyProgressDots';

interface SurveyStepProps {
  onNext: (answer: string) => void;
  onSkip: () => void;
}

export const Step6_UrgeTiming: React.FC<SurveyStepProps> = ({ onNext, onSkip }) => {
  const [isRockGlowing, setIsRockGlowing] = useState(false);
  const timeOptions = ["Morning", "Afternoon", "Evening / Night", "All Day"];

  const handleSelect = (option: string) => {
    setIsRockGlowing(true);
     // Short delay for visual feedback before advancing
    setTimeout(() => {
      onNext(option);
    }, 500);
  };
  
  return (
    <>
      <SurveyProgressDots current={2} />
      <h1 className="text-3xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-2">
        When's our biggest challenge?
      </h1>
      <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">
        Knowing when you struggle most helps me prepare. It's our 'danger zone'.
      </p>
      <div className={`w-[200px] h-[200px] mx-auto mb-6 ${isRockGlowing ? 'rock-glow' : ''}`}>
        <Rock cleanliness={15} />
      </div>
      <div className="flex flex-col space-y-3 w-full max-w-xs mx-auto">
        {timeOptions.map(option => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className="w-full text-center font-semibold py-3 px-2 rounded-lg transition-all duration-200 border-2 border-habico-border dark:border-dark-habico-border text-habico-text-primary dark:text-dark-habico-text-primary hover:border-habico-blue dark:hover:border-dark-habico-blue hover:bg-habico-border dark:hover:bg-dark-habico-border focus:outline-none focus:ring-2 focus:ring-habico-blue animate-button-press"
          >
            {option}
          </button>
        ))}
      </div>
      <button onClick={onSkip} className="mt-6 text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary hover:underline">
        Skip for now
      </button>
    </>
  );
};
