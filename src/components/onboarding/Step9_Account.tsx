import React from 'react';
import { Rock } from '../Rock';
import type { User } from '../../types';

interface StepProps {
  onComplete: (userDetails?: Partial<User>) => void;
  theme: 'light' | 'dark';
  hideSkip?: boolean;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.61-3.317-11.28-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.845 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const AppleIcon: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.39,12.16a4.33,4.33,0,0,1-1.6,3.31,4.3,4.3,0,0,1-2.81,1.18,3.42,3.42,0,0,1-1.54-.36,3.67,3.67,0,0,1-1.22-1,2.8,2.8,0,0,1-.6-1.3,3.78,3.78,0,0,1-1.35,2.7,4.37,4.37,0,0,1-3,1.2,4.4,4.4,0,0,1-3.15-1.27,4.33,4.33,0,0,1-1.63-3.37,4.8,4.8,0,0,1,1.83-4,5.4,5.4,0,0,1,4.28-1.92,3.8,3.8,0,0,1,3.18,1.23,3.46,3.46,0,0,0,1.1-1.12,3.7,3.7,0,0,0,1.35-2.58,1.46,1.46,0,0,1,.13-.65,1.28,1.28,0,0,1,.45-.46,1.25,1.25,0,0,1,.6-.16,1.42,1.42,0,0,1,1,.34,1.3,1.3,0,0,1,.51,1,2.1,2.1,0,0,0-.17,1,3.42,3.42,0,0,0,.64,2.22A4.2,4.2,0,0,1,19.39,12.16Zm-6.42,3.6a2.2,2.2,0,0,0,1.38-2.1,2.06,2.06,0,0,0-1.38-2,2.12,2.12,0,0,0-2.76,2,2.06,2.06,0,0,0,1.38,2.1A2,2,0,0,0,13,15.76Zm-5-4.48a2.1,2.1,0,0,0-1.39,2.06,2.16,2.16,0,0,0,1.4,2.08,2.08,2.08,0,0,0,2.76-2.07,2.12,2.12,0,0,0-1.38-2.07A2.06,2.06,0,0,0,7.92,11.28Z" style={{ color: theme === 'dark' ? '#FFF' : '#000' }} />
    </svg>
);


export const Step9_Account: React.FC<StepProps> = ({ onComplete, theme, hideSkip = false }) => {
  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput ? emailInput.value : '';
    if (email.trim()) {
        onComplete({ email: email.trim() });
    }
  };

  return (
    <>
      <div className="w-[250px] h-[250px] mx-auto mb-6">
        <Rock cleanliness={45} />
      </div>
      <h1 className="text-3xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-3">
        Let's save our progress.
      </h1>
      <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-8">
        Create an account so our journey together is never lost, even if you change devices.
      </p>

      <div className="space-y-3 w-full max-w-sm mx-auto">
        <button
          onClick={() => onComplete({ email: 'user@google.com', name: 'Google User' })}
          className="w-full flex items-center justify-center font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border-2 border-habico-border dark:border-dark-habico-border text-habico-text-primary dark:text-dark-habico-text-primary hover:bg-habico-border dark:hover:bg-dark-habico-border focus:outline-none focus:ring-2 focus:ring-habico-blue"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          onClick={() => onComplete({ email: 'user@apple.com', name: 'Apple User' })}
          className="w-full flex items-center justify-center font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border-2 border-habico-border dark:border-dark-habico-border text-habico-text-primary dark:text-dark-habico-text-primary hover:bg-habico-border dark:hover:bg-dark-habico-border focus:outline-none focus:ring-2 focus:ring-habico-blue"
        >
          <AppleIcon theme={theme} />
          Continue with Apple
        </button>

        <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-habico-border dark:border-dark-habico-border"></div>
            <span className="flex-shrink mx-4 text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary">OR</span>
            <div className="flex-grow border-t border-habico-border dark:border-dark-habico-border"></div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-habico-card dark:bg-dark-habico-card border-2 border-habico-border dark:border-dark-habico-border rounded-lg text-habico-text-primary dark:text-dark-habico-text-primary focus:outline-none focus:ring-2 focus:ring-habico-blue dark:focus:ring-dark-habico-blue"
                required
            />
            <button
                type="submit"
                className="w-full text-center font-bold py-3 rounded-xl transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue hover:bg-blue-500 dark:hover:bg-blue-400 text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
                Continue with Email
            </button>
        </form>
      </div>
      
      {!hideSkip && (
        <button onClick={() => onComplete()} className="mt-6 text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary hover:underline">
          Skip for now (data won’t be saved)
        </button>
      )}
    </>
  );
};
