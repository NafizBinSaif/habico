import React, { useState } from 'react';

interface ActionButtonsProps {
  onResist: () => void;
  onGiveIn: () => void;
}

const Button: React.FC<{
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}> = ({ onClick, className, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <button
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      className={`w-40 sm:w-48 text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-opacity-75 ${isAnimating ? 'animate-button-press' : ''} ${className}`}
    >
      {children}
    </button>
  );
};


export const ActionButtons: React.FC<ActionButtonsProps> = ({ onResist, onGiveIn }) => {
  return (
    <div className="flex space-x-4">
      <Button
        onClick={onResist}
        className="bg-habico-blue dark:bg-dark-habico-blue hover:bg-blue-500 dark:hover:bg-blue-400 text-white focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        I Resisted
      </Button>
      <Button
        onClick={onGiveIn}
        className="bg-habico-red dark:bg-dark-habico-red hover:bg-red-500 dark:hover:bg-red-400 text-white focus:ring-red-300 dark:focus:ring-red-800"
      >
        I Gave In
      </Button>
    </div>
  );
};