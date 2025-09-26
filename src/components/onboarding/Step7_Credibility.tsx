import React from 'react';
import { Rock } from '../Rock';

interface StepProps {
  onNext: () => void;
}

export const Step7_Credibility: React.FC<StepProps> = ({ onNext }) => (
  <>
    <div className="w-[250px] h-[250px] mx-auto mb-6">
      <Rock cleanliness={30} />
    </div>
    <h1 className="text-3xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-3">
      This is a real journey.
    </h1>
    <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-8">
      Breaking free takes time. Science shows it's a marathon, not a sprint. We're in this for the long haul.
    </p>
    <div className="bg-habico-border/50 dark:bg-dark-habico-border/50 p-4 rounded-lg text-left text-sm mb-8">
        <p className="text-habico-text-primary dark:text-dark-habico-text-primary mb-2">
          On average, it takes more than 2 months before a new behavior becomes automatic — 66 days to be exact. In Lally's study, it took anywhere from 18 days to 254 days for people to form a new habit.
        </p>
        <p className="text-habico-text-primary dark:text-dark-habico-text-primary">
          In other words, if you want to set your expectations appropriately, the truth is that it will probably take you anywhere from two months to eight months to build a new behavior into your life — not 21 days.
        </p>
        <a href="https://jamesclear.com/new-habit#:~:text=On%20average%2C%20it%20takes%20more,your%20life%20%E2%80%94%20not%2021%20days." target="_blank" rel="noopener noreferrer" className="text-xs text-habico-blue dark:text-dark-habico-blue hover:underline mt-2 inline-block">
           Source: James Clear, "Atomic Habits"
        </a>
    </div>
    <div className="flex flex-col space-y-3 w-full max-w-xs mx-auto">
      <button
        onClick={onNext}
        className="w-full text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        I'm ready. Let's do this.
      </button>
      <button
        onClick={onNext}
        className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary hover:underline"
      >
        Continue
      </button>
    </div>
  </>
);
