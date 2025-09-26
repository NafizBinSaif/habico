import React, { useState, useEffect, useRef } from 'react';
import { Rock } from '../components/Rock';
import { ActionButtons } from '../components/ActionButtons';
import { SpeechBubble } from '../components/SpeechBubble';
import { GiveInModal } from '../components/GiveInModal';
import { ResistModal } from '../components/ResistModal';
import { getPreMadeRockMessage, getAmbientRockMessage } from '../services/rockMessages';
import type { HabitState, User } from '../types';
import StarBorder from '../components/StarBorder';
import { HabitInsightsCard } from '../components/HabitInsightsCard';

type ActionType = 'resist' | 'give_in';

interface RockPageProps {
  state: HabitState;
  user: User;
  handleResist: () => void;
  handleGiveIn: (details: { emotion: string; trigger: string; timestamp: number }) => void;
}

export const RockPage: React.FC<RockPageProps> = ({ state, user, handleResist, handleGiveIn }) => {
  const [rockMessage, setRockMessage] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [lastAction, setLastAction] = useState<{ type: ActionType; timestamp: number; wasStreakBroken: boolean } | null>(null);
  const [isGiveInModalOpen, setIsGiveInModalOpen] = useState(false);
  const [isResistModalOpen, setIsResistModalOpen] = useState(false);
  const [resistMessage, setResistMessage] = useState<string | undefined>();
  const [isCircleAnimating, setIsCircleAnimating] = useState(false);
  
  const messageTimerRef = useRef<number | null>(null);
  const isPaidUser = user.plan !== 'free';

  const displayMessage = (message: string, duration: number = 8000) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }
    setRockMessage(message);
    setShowBubble(true);
    messageTimerRef.current = window.setTimeout(() => {
      setShowBubble(false);
      messageTimerRef.current = null;
    }, duration);
  };

  // Effect to show AMBIENT message on page load (Pro users only)
  useEffect(() => {
    if (!isPaidUser) return;

    const ambientTimer = setTimeout(() => {
      if (!showBubble && !isGiveInModalOpen && !isResistModalOpen) {
        const message = getAmbientRockMessage();
        displayMessage(message, 10000);
      }
    }, 2500);

    return () => {
      clearTimeout(ambientTimer);
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, [isPaidUser]);

  // Effect to show ACTION message for GIVING IN after modal closes
  useEffect(() => {
    if (!lastAction || lastAction.type !== 'give_in') {
      return;
    }
    const message = getPreMadeRockMessage(
      lastAction.type, 
      state.rockCleanliness, 
      lastAction.wasStreakBroken,
      state.habitType,
      state.urgeTiming
    );
    displayMessage(message, 8000);
  }, [lastAction, state.rockCleanliness, state.habitType, state.urgeTiming]);

  const onResist = () => {
    // Clear any ambient message timers.
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
      messageTimerRef.current = null;
    }
    setShowBubble(false);

    // Calculate the upcoming cleanliness level to generate the correct message, including streak bonus.
    const newCleanliness = Math.min(90, state.rockCleanliness + 1 + Math.floor(state.streak / 5));

    // Update the habit data state
    handleResist();
    setIsCircleAnimating(true);
    
    // Prepare the message for the modal (only for paid users)
    const message = isPaidUser ? getPreMadeRockMessage(
      'resist', 
      newCleanliness, 
      false,
      state.habitType,
      state.urgeTiming
    ) : undefined;
    setResistMessage(message);

    // Set last action to trigger rock animations
    setLastAction({ type: 'resist', timestamp: Date.now(), wasStreakBroken: false });
    
    // Open the new modal
    setIsResistModalOpen(true);
  };

  const onGiveInClick = () => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
      messageTimerRef.current = null;
    }

    if (showBubble) {
      setShowBubble(false);
      setTimeout(() => {
        setIsGiveInModalOpen(true);
      }, 200);
    } else {
      setIsGiveInModalOpen(true);
    }
  };

  const handleGiveInSubmit = (details: { emotion: string; trigger: string; timestamp: number }) => {
    setIsGiveInModalOpen(false);
    const wasStreakBroken = state.streak > 0;
    handleGiveIn(details);
    setLastAction({ type: 'give_in', timestamp: Date.now(), wasStreakBroken });
    setIsCircleAnimating(true);
  };

  const progress = state.rockCleanliness > 0 ? (state.rockCleanliness / 90) * 100 : 0;

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Main Rock Section */}
        <div className="w-full flex flex-col items-center justify-center space-y-4">
          <div 
            className="w-full grid transition-[grid-template-rows] duration-500 ease-in-out"
            style={{ gridTemplateRows: showBubble ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              {rockMessage && <SpeechBubble message={rockMessage} isVisible={showBubble} />}
            </div>
          </div>

          <div 
            className={`relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] ${isCircleAnimating ? 'animate-progress-pulse' : ''}`}
            onAnimationEnd={() => setIsCircleAnimating(false)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" className="text-habico-border dark:text-dark-habico-border" strokeWidth="3" />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="currentColor" 
                  className="text-habico-blue dark:text-dark-habico-blue"
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  strokeDasharray={`${progress * 3.01}, 301.59`}
                  style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              </svg>
              <Rock cleanliness={state.rockCleanliness} />
            </div>
          </div>
          <ActionButtons onResist={onResist} onGiveIn={onGiveInClick} />
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <StarBorder as="div" color='var(--habico-blue-color)' speed='8s' className="md:col-span-1">
                <div className="p-2 h-full flex flex-col justify-center">
                    <p className="text-4xl sm:text-5xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary">
                        Day {state.day}
                        <span className="text-3xl sm:text-4xl text-habico-text-secondary dark:text-dark-habico-text-secondary"> / 90</span>
                    </p>
                    <p className="mt-1 text-habico-text-secondary dark:text-dark-habico-text-secondary">
                        Streak: <span className="font-semibold text-habico-blue dark:text-dark-habico-blue">{state.streak} days</span>
                    </p>
                </div>
            </StarBorder>
            
            <StarBorder as="div" color='var(--habico-green-color)' speed='7s' className="h-full md:col-span-1">
                <div className="flex flex-col items-center justify-center text-center h-full p-2">
                    <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary">
                        Best Streak
                    </p>
                    <p className="text-4xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary my-1">
                        {state.bestStreak}
                    </p>
                    <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary">
                        days
                    </p>
                </div>
            </StarBorder>

            <div className="md:col-span-1 h-full">
                <HabitInsightsCard />
            </div>
        </div>
      </div>

      <GiveInModal
        isOpen={isGiveInModalOpen}
        user={user}
        onClose={() => setIsGiveInModalOpen(false)}
        onComplete={handleGiveInSubmit}
        activityLog={state.activityLog}
        habitType={state.habitType}
      />
      <ResistModal
        isOpen={isResistModalOpen}
        onClose={() => setIsResistModalOpen(false)}
        message={resistMessage}
      />
    </>
  );
};