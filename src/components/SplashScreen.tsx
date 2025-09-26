import React from 'react';

const Logo: React.FC = () => (
    <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" className="fill-habico-blue dark:fill-dark-habico-blue"/>
        <path d="M16.5116 11.2326C14.7791 11.2326 13.3488 12.6628 13.3488 14.3953C13.3488 17.5814 16.5116 21.6047 16.5116 21.6047C16.5116 21.6047 19.6744 17.5814 19.6744 14.3953C19.6744 12.6628 18.2442 11.2326 16.5116 11.2326Z" fill="white"/>
    </svg>
);

export const SplashScreen: React.FC = () => {
  // This component's theme is determined by system settings on first load,
  // so we need to ensure the dark class is applied to the html element
  // before the main App component has a chance to.
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    }
    // No cleanup needed, as the App will take over management
  }, []);

  return (
    <div className="fixed inset-0 bg-habico-background dark:bg-dark-habico-background flex flex-col items-center justify-center z-50 animate-bubble-in">
      <div className="flex flex-col items-center space-y-6">
        <Logo />
        <h1 className="text-4xl font-bold text-habico-blue dark:text-dark-habico-blue">Habico</h1>
        <div className="flex items-center space-x-2 pt-4">
          <div className="w-2.5 h-2.5 bg-habico-text-secondary/50 dark:bg-dark-habico-text-secondary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2.5 h-2.5 bg-habico-text-secondary/50 dark:bg-dark-habico-text-secondary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2.5 h-2.5 bg-habico-text-secondary/50 dark:bg-dark-habico-text-secondary/50 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};