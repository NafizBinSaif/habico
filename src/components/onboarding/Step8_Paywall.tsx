import React, { useState } from 'react';
import { Rock } from '../Rock';

interface PaywallProps {
  onNext: (plan: 'free' | 'monthly' | 'lifetime') => void;
}

export const Step8_Paywall: React.FC<PaywallProps> = ({ onNext }) => {
  const [selectedPlan, setSelectedPlan] = useState<'lifetime' | 'monthly'>('lifetime');
  
  const planBaseClasses = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer";
  const inactiveClasses = "bg-habico-background dark:bg-dark-habico-background border-habico-border dark:border-dark-habico-border hover:border-habico-blue dark:hover:border-dark-habico-blue";
  const activeClasses = "bg-blue-50 dark:bg-blue-900/30 border-habico-blue dark:border-dark-habico-blue ring-2 ring-habico-blue/50 dark:ring-dark-habico-blue/50";

  return (
      <>
          <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] mx-auto mb-6 glow-pulse">
              <Rock cleanliness={90} />
          </div>
          <h1 className="text-3xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-3">
              Want to supercharge our journey?
          </h1>
          <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">
              The Pro plan unlocks all my features. It's a way to commit to yourself—and to helping me shine faster.
          </p>

          <div className="space-y-4 w-full max-w-sm mx-auto mb-8">
              <button 
                  onClick={() => setSelectedPlan('lifetime')}
                  className={`${planBaseClasses} ${selectedPlan === 'lifetime' ? activeClasses : inactiveClasses} relative`}
              >
                  <div className="absolute top-2 right-2 text-xs font-semibold bg-yellow-500 text-white px-2 py-0.5 rounded-full">BEST VALUE</div>
                  <p className="font-bold text-lg text-habico-text-primary dark:text-dark-habico-text-primary">Lifetime</p>
                  <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary text-sm">One payment for unlimited habits, forever.</p>
                  <p className="font-bold text-2xl mt-1 text-habico-text-primary dark:text-dark-habico-text-primary">$59</p>
              </button>
              <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`${planBaseClasses} ${selectedPlan === 'monthly' ? activeClasses : inactiveClasses}`}
              >
                  <p className="font-bold text-lg text-habico-text-primary dark:text-dark-habico-text-primary">Monthly</p>
                  <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary text-sm">Flexible commitment, renews monthly.</p>
                  <p className="font-bold text-2xl mt-1 text-habico-text-primary dark:text-dark-habico-text-primary">$12</p>
              </button>
          </div>
           <p className="text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">
              Cancel anytime. No pressure — just commitment.
          </p>

          <div className="flex flex-col space-y-3 w-full max-w-xs mx-auto">
              <button
                  onClick={() => onNext(selectedPlan)}
                  className="w-full text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                  Upgrade to Pro
              </button>
              <button
                  onClick={() => onNext('free')}
                  className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary hover:underline"
              >
                  Continue with Free Plan
              </button>
          </div>
      </>
  );
};
