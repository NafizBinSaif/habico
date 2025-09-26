import React, { useState, useEffect, useMemo } from 'react';
import type { Activity, User } from '../types';
import { getEnvironmentSuggestion } from '../services/geminiService';


interface GiveInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (details: { emotion: string; trigger: string; timestamp: number }) => void;
  activityLog: Activity[];
  habitType?: string;
  user: User;
}

const emotions = ['Stressed', 'Bored', 'Tired', 'Sad', 'Anxious', 'Happy'];

export const GiveInModal: React.FC<GiveInModalProps> = ({ isOpen, onClose, onComplete, activityLog, habitType, user }) => {
  const [step, setStep] = useState(1);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [triggerText, setTriggerText] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  
  // State for new environment step
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const isPaidUser = user.plan !== 'free';

  // Reset state when modal is closed/opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedEmotion('');
      setTriggerText('');
      setEventDate(new Date());
      setSuggestions([]);
      setIsLoadingSuggestions(false);
    }
  }, [isOpen]);

  const recentTriggers = useMemo(() => {
    if (!activityLog) return [];
    const triggers = activityLog
      .map(a => a.trigger)
      .filter((t): t is string => !!t);
    const uniqueTriggers = [...new Set(triggers)];
    return uniqueTriggers.slice(-3).reverse();
  }, [activityLog]);

  if (!isOpen) {
    return null;
  }

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setStep(2);
  };

  const handleTriggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (triggerText.trim()) {
      setStep(3);
    }
  };

  const handleTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isPaidUser) {
        setIsLoadingSuggestions(true);
        setStep(4);
        try {
            const newSuggestions = await getEnvironmentSuggestion(triggerText.trim(), habitType);
            setSuggestions(newSuggestions);
        } catch (error) {
            console.error("Failed to get environment suggestions:", error);
            setSuggestions([
                "Remove temptation from your line of sight.",
                "Add one extra step between you and the habit.",
                "Ask a friend to hold you accountable to changing your space."
            ]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    } else {
        // Free users skip the suggestion step
        handleFinalSubmit();
    }
  };


  const handleFinalSubmit = () => {
    onComplete({ emotion: selectedEmotion, trigger: triggerText.trim(), timestamp: eventDate.getTime() });
  };
  
  const handleDateSelection = (day: 'today' | 'yesterday') => {
    const newDate = new Date(eventDate);
    const targetDate = new Date();
    if (day === 'yesterday') {
      targetDate.setDate(targetDate.getDate() - 1);
    }
    newDate.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    setEventDate(newDate);
  };

  const handleTimeChange = (part: 'hour' | 'minute' | 'period', value: number | 'AM' | 'PM') => {
      const newDate = new Date(eventDate);
      const currentHour = newDate.getHours();

      if (part === 'hour' && typeof value === 'number') {
          const isPM = currentHour >= 12;
          let newHour = value === 12 ? 0 : value; // 12 AM is 0, 12 PM is 12
          if (isPM) {
              newHour += 12;
              if (newHour === 24) newHour = 12; // 12 PM
          }
          newDate.setHours(newHour);
      } else if (part === 'minute' && typeof value === 'number') {
          newDate.setMinutes(value);
      } else if (part === 'period') {
          if (value === 'PM' && currentHour < 12) {
              newDate.setHours(currentHour + 12);
          } else if (value === 'AM' && currentHour >= 12) {
              newDate.setHours(currentHour - 12);
          }
      }
      setEventDate(newDate);
  };

  const isToday = new Date().toDateString() === eventDate.toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = yesterday.toDateString() === eventDate.toDateString();

  const renderTimePicker = () => {
    const currentHour = eventDate.getHours();
    const currentMinute = eventDate.getMinutes();
    const isAM = currentHour < 12;

    let displayHour = currentHour % 12;
    if (displayHour === 0) displayHour = 12; // 12 AM & 12 PM should show as 12

    const selectClasses = "w-full px-3 py-3 bg-habico-background dark:bg-dark-habico-background border-2 border-habico-border dark:border-dark-habico-border rounded-lg text-habico-text-primary dark:text-dark-habico-text-primary text-center text-lg focus:outline-none focus:ring-2 focus:ring-habico-blue dark:focus:ring-dark-habico-blue";

    return (
        <div className="flex items-center justify-center space-x-2">
            <select
                value={displayHour}
                onChange={(e) => handleTimeChange('hour', parseInt(e.target.value, 10))}
                className={selectClasses}
            >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="text-xl font-bold">:</span>
            <select
                value={currentMinute}
                onChange={(e) => handleTimeChange('minute', parseInt(e.target.value, 10))}
                className={selectClasses}
            >
                {Array.from({ length: 60 }, (_, i) => i).map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
            </select>
            <div className="flex flex-col space-y-1">
                <button
                    type="button"
                    onClick={() => handleTimeChange('period', 'AM')}
                    className={`w-12 py-1 text-sm font-semibold rounded-t-md border-2 transition-colors ${isAM ? 'bg-habico-blue text-white border-habico-blue' : 'border-habico-border dark:border-dark-habico-border hover:border-habico-blue dark:hover:border-dark-habico-blue'}`}
                >
                    AM
                </button>
                <button
                    type="button"
                    onClick={() => handleTimeChange('period', 'PM')}
                    className={`w-12 py-1 text-sm font-semibold rounded-b-md border-2 transition-colors ${!isAM ? 'bg-habico-blue text-white border-habico-blue' : 'border-habico-border dark:border-dark-habico-border hover:border-habico-blue dark:hover:border-dark-habico-blue'}`}
                >
                    PM
                </button>
            </div>
        </div>
    );
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-bubble-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-habico-card dark:bg-dark-habico-card rounded-2xl shadow-xl w-full max-w-md p-6 relative text-habico-text-primary dark:text-dark-habico-text-primary">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-habico-text-secondary dark:text-dark-habico-text-secondary hover:bg-habico-border dark:hover:bg-dark-habico-border focus:outline-none focus:ring-2 focus:ring-habico-blue"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">It's okay. Let's understand.</h2>
            <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">How were you feeling right before?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => handleEmotionSelect(emotion)}
                  className="w-full text-center font-semibold py-3 px-2 rounded-lg transition-colors duration-200 border-2 border-habico-border dark:border-dark-habico-border hover:bg-habico-border dark:hover:bg-dark-habico-border hover:border-habico-blue dark:hover:border-dark-habico-blue"
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleTriggerSubmit}>
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">And what was the trigger?</h2>
                <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">What was happening that led to the urge?</p>
            </div>
            <textarea
              value={triggerText}
              onChange={(e) => setTriggerText(e.target.value)}
              placeholder="e.g., Scrolling on my phone, finished a stressful meeting, felt lonely..."
              className="w-full h-28 px-3 py-2 bg-habico-background dark:bg-dark-habico-background border border-habico-border dark:border-dark-habico-border rounded-lg text-habico-text-primary dark:text-dark-habico-text-primary focus:outline-none focus:ring-2 focus:ring-habico-blue dark:focus:ring-dark-habico-blue"
              required
            />
             {recentTriggers.length > 0 && (
                <div className="my-4 text-left">
                    <p className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary mb-2">Recent triggers:</p>
                    <div className="flex flex-wrap gap-2">
                        {recentTriggers.map((trigger, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setTriggerText(trigger)}
                                className="px-3 py-1.5 text-sm bg-habico-border dark:bg-dark-habico-border text-habico-text-secondary dark:text-dark-habico-text-secondary rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {trigger}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <button
              type="submit"
              className="w-full mt-4 text-center text-lg font-bold py-3 rounded-xl transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue hover:bg-blue-500 dark:hover:bg-blue-400 text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Next
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleTimeSubmit}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">When did it happen?</h2>
              <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">Pinpointing the time helps us see patterns.</p>
            </div>
            <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => handleDateSelection('today')} className={`py-3 font-semibold rounded-lg border-2 transition-colors ${isToday ? 'bg-habico-blue text-white border-habico-blue' : 'border-habico-border dark:border-dark-habico-border hover:border-habico-blue dark:hover:border-dark-habico-blue'}`}>Today</button>
                    <button type="button" onClick={() => handleDateSelection('yesterday')} className={`py-3 font-semibold rounded-lg border-2 transition-colors ${isYesterday ? 'bg-habico-blue text-white border-habico-blue' : 'border-habico-border dark:border-dark-habico-border hover:border-habico-blue dark:hover:border-dark-habico-blue'}`}>Yesterday</button>
                 </div>
                 {renderTimePicker()}
            </div>
            <button
              type="submit"
              className="w-full mt-6 text-center text-lg font-bold py-3 rounded-xl transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue hover:bg-blue-500 dark:hover:bg-blue-400 text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              {isPaidUser ? 'Get Environment Tip' : 'Confirm & Log Slip-up'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center animate-bubble-in">
            <h2 className="text-2xl font-bold mb-2">Let's Make Next Time Easier</h2>
            <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">Discipline is overrated. A better environment is key. Here are some ideas based on your trigger:</p>
            
            {isLoadingSuggestions ? (
                <div className="flex items-center justify-center space-x-2 h-24">
                    <div className="w-2.5 h-2.5 bg-habico-text-secondary dark:bg-dark-habico-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2.5 h-2.5 bg-habico-text-secondary dark:bg-dark-habico-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2.5 h-2.5 bg-habico-text-secondary dark:bg-dark-habico-text-secondary rounded-full animate-bounce"></div>
                </div>
            ) : (
                <div className="space-y-3 text-left">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-habico-background dark:bg-dark-habico-background p-4 rounded-lg border border-habico-border dark:border-dark-habico-border flex items-start space-x-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.032-5.657l-.707-.707M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>
                           <p className="text-habico-text-primary dark:text-dark-habico-text-primary text-sm">{suggestion}</p>
                        </div>
                    ))}
                </div>
            )}

            <button
              onClick={handleFinalSubmit}
              className="w-full mt-6 text-center text-lg font-bold py-3 rounded-xl transition-colors duration-300 bg-habico-red dark:bg-dark-habico-red hover:bg-red-500 dark:hover:bg-red-400 text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              Confirm & Log Slip-up
            </button>
          </div>
        )}

      </div>
    </div>
  );
};