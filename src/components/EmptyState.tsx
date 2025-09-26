import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-habico-background dark:bg-dark-habico-background rounded-lg border-2 border-dashed border-habico-border dark:border-dark-habico-border h-full animate-bubble-in">
      <div className="w-16 h-16 flex items-center justify-center bg-habico-border dark:bg-dark-habico-border rounded-full mb-4 text-habico-text-secondary dark:text-dark-habico-text-secondary">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-2">
        {title}
      </h3>
      <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary max-w-xs">
        {message}
      </p>
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="mt-6 font-semibold py-2 px-5 rounded-lg transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {actionButton.text}
        </button>
      )}
    </div>
  );
};