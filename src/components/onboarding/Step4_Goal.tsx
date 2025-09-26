import React, { useState } from 'react';
import { Rock } from '../Rock';

interface StepProps {
  onNext: () => void;
}

// FIX: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'".
const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start text-left space-x-4 p-3 bg-habico-background dark:bg-dark-habico-background rounded-lg border border-habico-border dark:border-dark-habico-border">
    <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-habico-blue/10 dark:bg-dark-habico-blue/20 rounded-full text-habico-blue dark:text-dark-habico-blue">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-habico-text-primary dark:text-dark-habico-text-primary">{title}</h3>
      <p className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary">{description}</p>
    </div>
  </div>
);

// Icons
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6.343 6.343l-2.828 2.828M17.657 17.657l2.828 2.828M18 5h-4M21 3v4M12 3v4M12 21v-4M12 9a3 3 0 100 6 3 3 0 000-6z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;

export const Step4_Goal: React.FC<StepProps> = ({ onNext }) => {
    const [showFeatures, setShowFeatures] = useState(false);

    const handleContinue = () => {
        if (!showFeatures) {
            setShowFeatures(true);
        } else {
            onNext();
        }
    }

    return (
        <>
            {!showFeatures ? (
                 <div className="animate-bubble-in">
                    <h1 className="text-4xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-4">
                        In 90 days...
                    </h1>
                    <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-8">
                        ...I'll be shining. That's how we'll know you've built a new, stronger habit.
                    </p>
                    <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] mx-auto my-8">
                        <Rock cleanliness={90} />
                    </div>
                </div>
            ) : (
                <div className="animate-bubble-in">
                    <h1 className="text-4xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-4">
                        I'm more than just a rock.
                    </h1>
                    <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-8">
                        I'm a companion built on science. Here are some of the ways I'll help us on this journey.
                    </p>
                    <div className="space-y-4 my-8">
                        <Feature
                            icon={<SparklesIcon />}
                            title="AI-Powered Companion"
                            description="Your rock talks back, offering personalized encouragement and insights when you need them most."
                        />
                        <Feature
                            icon={<ChartIcon />}
                            title="Actionable Insights"
                            description="Go beyond streaks. We analyze your slip-ups to find patterns and suggest your next best action."
                        />
                        <Feature
                            icon={<HomeIcon />}
                            title="Environment Design"
                            description="After a slip-up, get smart suggestions to change your environment, making your bad habit harder to do."
                        />
                    </div>
                </div>
            )}


            <button
                onClick={handleContinue}
                className="w-full max-w-xs mx-auto text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800"
            >
                Continue
            </button>
        </>
    );
};
