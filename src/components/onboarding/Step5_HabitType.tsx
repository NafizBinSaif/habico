import React, { useState } from 'react';
import { Rock } from '../Rock';
import { SurveyProgressDots } from './SurveyProgressDots';

interface SurveyStepProps {
  onNext: (answer: string) => void;
  onSkip: () => void;
}

export const Step5_HabitType: React.FC<SurveyStepProps> = ({ onNext, onSkip }) => {
  const [isRockGlowing, setIsRockGlowing] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherHabit, setOtherHabit] = useState('');
  const habitOptions = ["Smoking / Vaping", "Junk Food", "Social Media / Screen Time", "Other"];

  const handleSelect = (option: string) => {
    if (option === "Other") {
      setShowOtherInput(true);
    } else {
      setIsRockGlowing(true);
      // Short delay for visual feedback before advancing
      setTimeout(() => {
        onNext(option);
      }, 500);
    }
  };

  const handleOtherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otherHabit.trim()) {
      setIsRockGlowing(true);
      setTimeout(() => {
        onNext(otherHabit.trim());
      }, 500);
    }
  };

  return (
    <>
      <SurveyProgressDots current={1} />
      <h1 className="text-3xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-2">
        So, what are we up against?
      </h1>
      <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">
        Telling me helps me give you better advice. No judgment.
      </p>
      <div className={`w-[200px] h-[200px] mx-auto mb-6 ${isRockGlowing ? 'rock-glow' : ''}`}>
        <Rock cleanliness={15} />
      </div>

      {showOtherInput ? (
        <form onSubmit={handleOtherSubmit} className="w-full max-w-xs mx-auto animate-bubble-in">
          <label htmlFor="other-habit" className="block text-sm font-medium text-habico-text-secondary dark:text-dark-habico-text-secondary mb-2">Please specify your habit:</label>
          <input
            id="other-habit"
            type="text"
            value={otherHabit}
            onChange={(e) => setOtherHabit(e.target.value)}
            placeholder="e.g., Nail biting"
            className="w-full px-4 py-3 bg-habico-card dark:bg-dark-habico-card border-2 border-habico-border dark:border-dark-habico-border rounded-lg text-habico-text-primary dark:text-dark-habico-text-primary focus:outline-none focus:ring-2 focus:ring-habico-blue dark:focus:ring-dark-habico-blue"
            required
            autoFocus
          />
          <button
            type="submit"
            className="w-full mt-4 text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50"
            disabled={!otherHabit.trim()}
          >
            Continue
          </button>
           <button type="button" onClick={() => setShowOtherInput(false)} className="mt-4 text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary hover:underline">
            Back
          </button>
        </form>
      ) : (
        <>
          <div className="flex flex-col space-y-3 w-full max-w-xs mx-auto">
            {habitOptions.map(option => (
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
      )}
    </>
  );
};
