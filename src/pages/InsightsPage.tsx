import React, { useEffect, useState, useMemo } from 'react';
import type { HabitState, User } from '../types';
import { getAIActionableInsight, getHabitClockInsight } from '../services/geminiService';
import StarBorder from '../components/StarBorder';
import { RewireJourney } from '../components/RewireJourney';
import { HabitClock } from '../components/HabitClock';
import { analyzeUrgeTimings, UrgeTiming } from '../utils/timeAnalysis';
import { ProFeatureLock } from '../components/ProFeatureLock';

interface InsightsPageProps {
  state: HabitState;
  user: User;
  setAiInsight: (insight: string) => void;
  savePersonalization: (details: { habitType?: string; urgeTiming?: string }) => void;
  setActiveTab: (tab: string) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; starColor: string; }> = ({ title, value, icon, color, starColor }) => (
    <StarBorder as="div" className="w-full h-full" color={starColor} speed="8s" thickness={1}>
        <div className="flex items-center space-x-4 h-full">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary text-sm">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </StarBorder>
);

const TimingSuggestionCard: React.FC<{
  suggestion: UrgeTiming;
  onUpdate: () => void;
  onDismiss: () => void;
}> = ({ suggestion, onUpdate, onDismiss }) => (
  <div className="bg-habico-blue/10 dark:bg-dark-habico-blue/20 p-4 rounded-lg border border-habico-blue/30 dark:border-dark-habico-blue/30 animate-bubble-in">
    <h3 className="text-lg font-semibold mb-2 flex items-center text-habico-blue dark:text-dark-habico-blue">
      <InfoIcon /> <span className="ml-2">I think I'm seeing a pattern.</span>
    </h3>
    <p className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary mb-4">
      I've noticed most of our slip-ups happen in the <strong>{suggestion}</strong>. Should we update our setting so I can give you more relevant advice?
    </p>
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
      <button
        onClick={onUpdate}
        className="w-full text-center font-bold py-2 px-4 rounded-lg transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Yes, Update Now
      </button>
      <button
        onClick={onDismiss}
        className="w-full text-center font-semibold py-2 px-4 rounded-lg transition-colors duration-200 border border-habico-border dark:border-dark-habico-border hover:bg-habico-border dark:hover:bg-dark-habico-border"
      >
        No, Thanks
      </button>
    </div>
  </div>
);


export const InsightsPage: React.FC<InsightsPageProps> = ({ state, user, setAiInsight, savePersonalization, setActiveTab }) => {
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [isRewireJourneyOpen, setIsRewireJourneyOpen] = useState(false);
  const [clockInsight, setClockInsight] = useState<string | null>(null);
  const [isLoadingClockInsight, setIsLoadingClockInsight] = useState(true);
  const [timingSuggestion, setTimingSuggestion] = useState<UrgeTiming | null>(null);
  const [isTimingSuggestionDismissed, setIsTimingSuggestionDismissed] = useState(() => {
    return sessionStorage.getItem('dismissedTimingSuggestion') === 'true';
  });
  
  const isPaidUser = user.plan !== 'free';
  const INSIGHT_TRIGGER_THRESHOLD = 3;

  const giveInTimestamps = useMemo(() => {
    return state.activityLog
      .filter(log => log.action === 'give_in')
      .map(log => log.timestamp);
  }, [state.activityLog]);

  useEffect(() => {
    if (!isPaidUser) return;
    const shouldFetchInsight = state.giveInsSinceLastInsight >= INSIGHT_TRIGGER_THRESHOLD;
    
    if (shouldFetchInsight && !isLoadingInsight) {
      setIsLoadingInsight(true);
      getAIActionableInsight(state.activityLog)
        .then(insight => setAiInsight(insight))
        .finally(() => setIsLoadingInsight(false));
    }
  }, [state.giveInsSinceLastInsight, state.activityLog, setAiInsight, isLoadingInsight, isPaidUser]);

  useEffect(() => {
    if (!isPaidUser) return;
    setIsLoadingClockInsight(true);
    getHabitClockInsight(giveInTimestamps)
      .then(setClockInsight)
      .finally(() => setIsLoadingClockInsight(false));
  }, [giveInTimestamps, isPaidUser]);
  
  // Effect for timing analysis
  useEffect(() => {
    if (isTimingSuggestionDismissed || !isPaidUser) return;

    const suggestion = analyzeUrgeTimings(giveInTimestamps);
    if (suggestion && suggestion !== state.urgeTiming) {
      setTimingSuggestion(suggestion);
    } else {
      setTimingSuggestion(null); // Clear suggestion if pattern no longer holds
    }
  }, [giveInTimestamps, state.urgeTiming, isTimingSuggestionDismissed, isPaidUser]);

  const handleUpdateTiming = () => {
    if (timingSuggestion) {
      savePersonalization({ urgeTiming: timingSuggestion });
      setTimingSuggestion(null);
      setIsTimingSuggestionDismissed(true);
      sessionStorage.setItem('dismissedTimingSuggestion', 'true');
    }
  };

  const handleDismissTiming = () => {
    setTimingSuggestion(null);
    setIsTimingSuggestionDismissed(true);
    sessionStorage.setItem('dismissedTimingSuggestion', 'true');
  };

  const canStartJourney = state.activityLog.filter(a => a.action === 'give_in' && a.trigger).length >= 3;

  if (!isPaidUser) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-habico-blue dark:text-dark-habico-blue">Unlock Pro Insights</h2>
                <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mt-2 max-w-xl mx-auto">Upgrade to Pro to get a deeper understanding of your habits with our full suite of analytical tools.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProFeatureLock 
                    title="Your Habit Clock" 
                    description="Visualize the exact times your urges strike to identify your personal 'danger zones'."
                    icon={<ClockIcon />}
                    onClick={() => setActiveTab('Settings')}
                />
                <ProFeatureLock 
                    title="Rewire Your Brain" 
                    description="An interactive journey to understand the science of your habit and build a new path to freedom."
                    icon={<KeyIcon />}
                    onClick={() => setActiveTab('Settings')}
                />
                 <ProFeatureLock 
                    title="Your Next Action" 
                    description="Let our AI analyze your slip-up patterns and give you a clear, actionable task to focus on."
                    icon={<SparklesIcon />}
                    onClick={() => setActiveTab('Settings')}
                />
                <ProFeatureLock 
                    title="Dynamic Urge Timing" 
                    description="The app will automatically detect your high-risk periods and suggest updates to keep your support relevant."
                    icon={<InfoIcon />}
                    onClick={() => setActiveTab('Settings')}
                />
            </div>
        </div>
    )
  }

  return (
    <>
        <div className="space-y-6">
            {/* Urge Timing Suggestion Card */}
            {timingSuggestion && (
              <TimingSuggestionCard
                suggestion={timingSuggestion}
                onUpdate={handleUpdateTiming}
                onDismiss={handleDismissTiming}
              />
            )}

            {/* Streaks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Current Streak" value={`${state.streak} days`} color="bg-blue-100 dark:bg-blue-900/50 text-habico-blue dark:text-dark-habico-blue" starColor="var(--habico-blue-color)" icon={<FlameIcon />} />
                <StatCard title="Best Streak" value={`${state.bestStreak} days`} color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400" starColor="var(--habico-green-color)" icon={<TrophyIcon />} />
                <StatCard title="Days to Goal" value={`${90 - state.day} days`} color="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400" starColor="var(--habico-yellow-color)" icon={<GoalIcon />} />
            </div>

            {/* Habit Clock */}
            <div className="bg-habico-background dark:bg-dark-habico-background p-4 rounded-lg border border-habico-border dark:border-dark-habico-border">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                   <ClockIcon /> <span className="ml-2">Your Habit Clock</span>
                </h3>
                {isLoadingClockInsight ? (
                    <div className="h-8 flex items-center">
                       <p className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary italic">Looking for patterns in our journey...</p>
                    </div>
                ) : (
                   <p className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary h-8">{clockInsight}</p>
                )}
                <HabitClock timestamps={giveInTimestamps} />
            </div>

            {/* Rewire Your Brain Journey */}
            <div className="bg-habico-background dark:bg-dark-habico-background p-4 rounded-lg border border-habico-border dark:border-dark-habico-border">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <KeyIcon /> <span className="ml-2">Rewire Your Brain</span>
                </h3>
                <p className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary mb-4">
                    I can show you the science behind our habit loop and how we can break it, based on your own data.
                </p>
                <button
                    onClick={() => setIsRewireJourneyOpen(true)}
                    disabled={!canStartJourney}
                    className="w-full text-center font-bold py-2 px-4 rounded-lg transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {canStartJourney ? "Start the Journey" : "Log 3 Slip-ups to Unlock"}
                </button>
            </div>

            {/* AI Action */}
            <div className="bg-habico-journal-bubble dark:bg-dark-habico-journal-bubble p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <SparklesIcon /> <span className="ml-2">Your Next Action</span>
                </h3>
                {isLoadingInsight ? (
                    <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary italic">Thinking about our next step...</p>
                ) : (
                    <p className="text-habico-text-primary dark:text-dark-habico-text-primary">{state.aiInsight.text || "After a few slip-ups, I'll have a clear next step for us here."}</p>
                )}
            </div>
        </div>
        
        {isRewireJourneyOpen && (
            <RewireJourney 
                state={state} 
                onClose={() => setIsRewireJourneyOpen(false)} 
            />
        )}
    </>
  );
};


// Icons
const FlameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.343 17.657a8 8 0 011.414-1.414" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m-1 5h2" /></svg>;
const GoalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.5 13.5l4 4L18 9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6.343 6.343l-2.828 2.828M17.657 17.657l2.828 2.828M18 5h-4M21 3v4M12 3v4M12 21v-4M12 9a3 3 0 100 6 3 3 0 000-6z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;