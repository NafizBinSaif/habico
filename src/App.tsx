import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RockPage } from './pages/RockPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { BottomNavBar } from './components/BottomNavBar';
import { useHabitData } from './hooks/useHabitData';
import { useAuth } from './hooks/useAuth';
import { OnboardingPage } from './pages/OnboardingPage';
import type { User } from './types';
import { ChatPage } from './pages/ChatPage';
import { preloadRockImages } from './utils/preloadImages';
import { SplashScreen } from './components/SplashScreen';

// Type definitions for the experimental View Transitions API
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

declare global {
  interface Document {
    startViewTransition?(updateCallback: () => Promise<void> | void): ViewTransition;
  }
}

const ONBOARDING_KEY = 'habico-onboarding-complete';
export type ThemeSetting = 'light' | 'dark' | 'system';

export default function App() {
  const { user, updateUser, logout, deleteAccount } = useAuth();
  const { state, handleResist, handleGiveIn, setAiInsight, resetData, savePersonalization, addChatMessage, updateLastChatMessage } = useHabitData();
  const [activeTab, setActiveTab] = useState('Rock');
  const [isLoading, setIsLoading] = useState(true);

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch {
      return false;
    }
  });
  
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>(() => {
    return (localStorage.getItem('habico-theme-setting') as ThemeSetting) || 'system';
  });
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Effect to preload critical images and manage splash screen
  useEffect(() => {
    const minDisplayTime = new Promise(resolve => setTimeout(resolve, 2500));
    const dataLoading = new Promise<void>(resolve => {
        preloadRockImages();
        // This is where you would fetch initial user data in a real app
        resolve();
    });

    Promise.all([minDisplayTime, dataLoading]).then(() => {
        setIsLoading(false);
    });
  }, []);


  // Effect to apply the chosen theme
  useEffect(() => {
    let isDark = false;
    if (themeSetting === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = themeSetting === 'dark';
    }
    
    setEffectiveTheme(isDark ? 'dark' : 'light');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('habico-theme-setting', themeSetting);
  }, [themeSetting]);

  // Effect to listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeSetting === 'system') {
        const isDark = mediaQuery.matches;
        setEffectiveTheme(isDark ? 'dark' : 'light');
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeSetting]);
  
  const changeTheme = (newTheme: ThemeSetting, event?: React.MouseEvent<HTMLButtonElement>) => {
     if (event && document.startViewTransition) {
        const x = event.clientX;
        const y = event.clientY;
        document.startViewTransition(() => {
            document.documentElement.style.setProperty('--wipe-x', `${x}px`);
            document.documentElement.style.setProperty('--wipe-y', `${y}px`);
            setThemeSetting(newTheme);
        });
     } else {
        setThemeSetting(newTheme);
     }
  };
  
  const toggleThemeFromHeader = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Simple toggle for the header button, doesn't cycle through 'system'
    changeTheme(effectiveTheme === 'light' ? 'dark' : 'light', event);
  };

  const handleOnboardingComplete = (surveyData: { habitType?: string; urgeTiming?: string }) => {
    savePersonalization(surveyData);
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error("Failed to save onboarding status:", error);
      setIsOnboardingComplete(true);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isOnboardingComplete) {
    return <OnboardingPage onComplete={handleOnboardingComplete} theme={effectiveTheme} user={user} updateUser={updateUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Rock':
        return (
          <RockPage
            state={state}
            user={user}
            handleResist={handleResist}
            handleGiveIn={handleGiveIn}
          />
        );
      case 'Chat':
        return <ChatPage state={state} user={user} addChatMessage={addChatMessage} updateLastChatMessage={updateLastChatMessage} />;
      case 'Insights':
        return <InsightsPage state={state} user={user} setAiInsight={setAiInsight} savePersonalization={savePersonalization} setActiveTab={setActiveTab} />;
      case 'Settings':
         return (
            <SettingsPage 
                state={state} 
                resetData={resetData} 
                user={user}
                updateUser={updateUser}
                savePersonalization={savePersonalization}
                logout={logout}
                deleteAccount={deleteAccount}
                themeSetting={themeSetting}
                changeTheme={changeTheme}
            />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-habico-background dark:bg-dark-habico-background min-h-screen text-habico-text-primary dark:text-dark-habico-text-primary font-sans flex flex-col items-center p-4 pb-24 sm:p-8">
      <div className="w-full max-w-5xl bg-habico-card dark:bg-dark-habico-card rounded-2xl shadow-lg p-6 sm:p-8">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} theme={effectiveTheme} toggleTheme={toggleThemeFromHeader} user={user} />
        <main className="mt-8">
          {renderContent()}
        </main>
      </div>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}