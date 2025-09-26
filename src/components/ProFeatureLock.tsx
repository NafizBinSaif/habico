import React from 'react';

interface ProFeatureLockProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const ProFeatureLock: React.FC<ProFeatureLockProps> = ({ title, description, icon, onClick }) => {
  return (
    <div className="bg-habico-background dark:bg-dark-habico-background p-4 rounded-lg border border-habico-border dark:border-dark-habico-border h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-3">
          {icon && <div className="mr-2 text-habico-blue dark:text-dark-habico-blue">{icon}</div>}
          <h3 className="text-lg font-semibold text-habico-text-primary dark:text-dark-habico-text-primary">{title}</h3>
        </div>
        <p className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary">
          {description}
        </p>
      </div>
      <button
        onClick={onClick}
        className="w-full text-center font-bold py-2 px-4 mt-4 rounded-lg transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
      >
        Upgrade to Pro
      </button>
    </div>
  );
};