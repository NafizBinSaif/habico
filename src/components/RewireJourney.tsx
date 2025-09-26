import React, { useState, useMemo, useEffect } from 'react';
import type { HabitState } from '../types';
import { getNewRoutineSuggestions } from '../services/geminiService';
import { Cage } from './Cage';

interface RewireJourneyProps {
  state: HabitState;
  onClose: () => void;
}

const getTopItem = (log: HabitState['activityLog'], key: 'trigger' | 'emotion'): string => {
    const itemCounts = log
        .filter(entry => entry.action === 'give_in' && entry[key])
        .reduce((acc: Record<string, number>, entry) => {
            const item = entry[key]!;
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});

    const sortedItems = Object.entries(itemCounts).sort(([, a], [, b]) => b - a);
    return sortedItems.length > 0 ? sortedItems[0][0] : '';
};


export const RewireJourney: React.FC<RewireJourneyProps> = ({ state, onClose }) => {
  const [step, setStep] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShattered, setIsShattered] = useState(false);

  const topTrigger = useMemo(() => getTopItem(state.activityLog, 'trigger'), [state.activityLog]);
  const topEmotion = useMemo(() => getTopItem(state.activityLog, 'emotion'), [state.activityLog]);
  
  const handleNext = () => setStep(s => s + 1);

  const handleGenerateKeys = async () => {
    handleNext();
    setIsLoading(true);
    const result = await getNewRoutineSuggestions(topTrigger, state.habitType || 'your habit');
    setSuggestions(result);
    setIsLoading(false);
  };
  
  const handleKeySelection = () => {
    setIsShattered(true);
    setTimeout(handleNext, 1200); // Wait for shatter animation
  }

  const renderContent = () => {
      const currentStepKey = `step-${step}`;
      return (
         <div key={currentStepKey} className="flex flex-col items-center text-center animate-bubble-in">
             {step === 1 && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Let me show you the cage.</h2>
                    <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6 max-w-lg">Every time you repeat a habit, you're training your brain. Over time, that training builds a cage you don't even see.</p>
                    <div className="w-[300px] h-[300px] mx-auto">
                        <Cage isShattered={isShattered} topTrigger={topTrigger} />
                    </div>
                    <button onClick={handleNext} className="w-full max-w-xs mt-6 text-lg font-bold py-3 rounded-xl bg-habico-blue text-white">Continue</button>
                </>
             )}
              {step === 2 && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Your brain is on autopilot.</h2>
                    <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6 max-w-lg">Scientists call this the cue-routine-reward loop. Your brain memorizes it so well it just... happens. That's why it feels automatic.</p>
                    <div className="w-full max-w-sm space-y-4 my-6">
                        <div className="bg-habico-background dark:bg-dark-habico-background p-4 rounded-lg border border-habico-border dark:border-dark-habico-border">
                            <p className="text-sm font-semibold text-habico-text-secondary dark:text-dark-habico-text-secondary">THE CUE (Your Trigger)</p>
                            <p className="text-xl font-bold">{topEmotion || 'A certain feeling'}</p>
                        </div>
                        <div className="text-2xl font-bold text-habico-text-secondary dark:text-dark-habico-text-secondary">↓</div>
                         <div className="bg-habico-background dark:bg-dark-habico-background p-4 rounded-lg border border-habico-border dark:border-dark-habico-border">
                            <p className="text-sm font-semibold text-habico-text-secondary dark:text-dark-habico-text-secondary">THE ROUTINE (Your Habit)</p>
                            <p className="text-xl font-bold">{state.habitType || 'Giving in'}</p>
                        </div>
                         <div className="text-2xl font-bold text-habico-text-secondary dark:text-dark-habico-text-secondary">↓</div>
                         <div className="bg-habico-background dark:bg-dark-habico-background p-4 rounded-lg border border-habico-border dark:border-dark-habico-border">
                            <p className="text-sm font-semibold text-habico-text-secondary dark:text-dark-habico-text-secondary">THE REWARD (The Brain's Payoff)</p>
                            <p className="text-xl font-bold">A quick hit of relief</p>
                        </div>
                    </div>
                    <button onClick={handleGenerateKeys} className="w-full max-w-xs mt-6 text-lg font-bold py-3 rounded-xl bg-habico-blue text-white">I see it. How do I break it?</button>
                </>
             )}
             {(step === 3) && (
                 <>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">We need a new key.</h2>
                    <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6 max-w-lg">You can't just stop a routine. You have to replace it. The same loop that traps you can free you. Keep the cue, change the routine.</p>
                    {isLoading ? (
                         <div className="flex items-center justify-center space-x-2 h-48">
                            <div className="w-3 h-3 bg-habico-blue rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-3 h-3 bg-habico-blue rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-3 h-3 bg-habico-blue rounded-full animate-bounce"></div>
                         </div>
                    ) : (
                        <div className="w-full max-w-sm space-y-3 my-6">
                            <p className="font-semibold mb-4">The next time you feel <span className="text-habico-blue dark:text-dark-habico-blue">{topEmotion}</span> and are triggered by <span className="text-habico-blue dark:text-dark-habico-blue">{topTrigger}</span>, try one of these keys:</p>
                            {suggestions.map((suggestion, index) => (
                                <button key={index} onClick={handleKeySelection} className="w-full text-left p-4 rounded-lg border-2 border-habico-border dark:border-dark-habico-border hover:border-habico-blue dark:hover:border-dark-habico-blue transition-colors text-habico-text-primary dark:text-dark-habico-text-primary">
                                    <span className="font-semibold">{suggestion}</span>
                                </button>
                            ))}
                        </div>
                    )}
                 </>
             )}
             {step === 4 && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">The cage is broken.</h2>
                    <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6 max-w-lg">Each time you use your new key, you're not just resisting. You're building a new door in the wall of that cage.</p>
                    <div className="w-[300px] h-[300px] mx-auto">
                        <Cage isShattered={isShattered} topTrigger={topTrigger} />
                    </div>
                    <button onClick={onClose} className="w-full max-w-xs mt-6 text-lg font-bold py-3 rounded-xl bg-habico-blue text-white">I'm Ready</button>
                </>
             )}
         </div>
      )
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-bubble-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-habico-card dark:bg-dark-habico-card rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8 relative text-habico-text-primary dark:text-dark-habico-text-primary">
         <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-habico-text-secondary dark:text-dark-habico-text-secondary hover:bg-habico-border dark:hover:bg-dark-habico-border focus:outline-none focus:ring-2 focus:ring-habico-blue"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {renderContent()}
      </div>
    </div>
  );
};