import React from 'react';

interface SurveyProgressDotsProps {
  current: number;
}

export const SurveyProgressDots: React.FC<SurveyProgressDotsProps> = ({ current }) => (
  <div className="flex justify-center space-x-2 mb-8">
    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${current === 1 ? 'bg-habico-blue' : 'bg-habico-border dark:bg-dark-habico-border'}`}></div>
    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${current === 2 ? 'bg-habico-blue' : 'bg-habico-border dark:bg-dark-habico-border'}`}></div>
  </div>
);