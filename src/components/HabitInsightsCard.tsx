import React, { useState, useEffect, useCallback } from 'react';
import StarBorder from './StarBorder';
import { habitInsights } from '../services/habitInsights';

export const HabitInsightsCard: React.FC = () => {
  const [insight, setInsight] = useState('');

  const getNewInsight = useCallback(() => {
    let newInsight = insight;
    // Ensure the new insight is different from the current one, if possible
    if (habitInsights.length > 1) {
      while (newInsight === insight) {
        newInsight = habitInsights[Math.floor(Math.random() * habitInsights.length)];
      }
    } else {
      newInsight = habitInsights[0] || '';
    }
    setInsight(newInsight);
  }, [insight]);

  useEffect(() => {
    // Set the initial insight when the component mounts
    getNewInsight();
  }, []);

  return (
    <StarBorder as="div" color="var(--habico-yellow-color)" speed="9s">
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-semibold text-habico-text-primary dark:text-dark-habico-text-primary mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.032-5.657l-.707-.707M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>
            Habit Wisdom
          </h3>
          <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary text-sm">
            "{insight}"
          </p>
        </div>
        <button
          onClick={getNewInsight}
          className="w-full text-center font-semibold py-2 px-4 mt-4 rounded-lg transition-colors duration-200 border border-habico-border dark:border-dark-habico-border hover:bg-habico-border dark:hover:bg-dark-habico-border text-xs flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>
          New Tip
        </button>
      </div>
    </StarBorder>
  );
};