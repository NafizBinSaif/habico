import { useState, useEffect, useCallback } from 'react';
import type { HabitState, AiInsight, Activity, ChatMessage, GroundingSource } from '../types';

const HABIT_DATA_KEY = 'habicoData';

const getInitialState = (): HabitState => {
  try {
    const savedData = localStorage.getItem(HABIT_DATA_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastUpdateDate = parsedData.lastUpdate ? new Date(parsedData.lastUpdate) : null;
      if (lastUpdateDate) {
          lastUpdateDate.setHours(0, 0, 0, 0);
      }
      
      return {
          day: parsedData.day || 0,
          streak: parsedData.streak || 0,
          bestStreak: parsedData.bestStreak || 0,
          rockCleanliness: parsedData.rockCleanliness || 0,
          lastUpdate: parsedData.lastUpdate || null,
          activityLog: parsedData.activityLog || [],
          aiInsight: parsedData.aiInsight || { text: '', generatedAt: null },
          giveInsSinceLastInsight: parsedData.giveInsSinceLastInsight || 0,
          habitType: parsedData.habitType,
          urgeTiming: parsedData.urgeTiming,
          chatHistory: parsedData.chatHistory || [{ role: 'model', text: "I'm Habico. This is our space to talk through the journey. What's on your mind?", timestamp: Date.now() }],
          chatCount: parsedData.chatCount || { daily: 0, monthly: 0, lastChatDate: new Date().toISOString().split('T')[0] },
      };
    }
  } catch (error) {
    console.error("Failed to load data from localStorage", error);
  }

  return {
    day: 0,
    streak: 0,
    bestStreak: 0,
    rockCleanliness: 0,
    lastUpdate: null,
    activityLog: [],
    aiInsight: { text: '', generatedAt: null },
    giveInsSinceLastInsight: 0,
    chatHistory: [{ role: 'model', text: "I'm Habico. This is our space to talk through the journey. What's on your mind?", timestamp: Date.now() }],
    chatCount: { daily: 0, monthly: 0, lastChatDate: new Date().toISOString().split('T')[0] },
  };
};

export const useHabitData = () => {
  const [state, setState] = useState<HabitState>(getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(HABIT_DATA_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [state]);

  const updateState = (updater: (prevState: HabitState) => HabitState): void => {
    setState(updater);
  };

  const handleResist = useCallback(() => {
    updateState(prevState => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const lastUpdateDate = prevState.lastUpdate ? new Date(new Date(prevState.lastUpdate).getFullYear(), new Date(prevState.lastUpdate).getMonth(), new Date(prevState.lastUpdate).getDate()) : null;
        
        // Don't allow multiple resists on the same day to affect stats.
        if (lastUpdateDate && today.getTime() === lastUpdateDate.getTime()) {
            return prevState; // No change
        }

        const newDay = Math.min(90, prevState.day + 1);
        
        let newStreak = prevState.streak;
        if (lastUpdateDate) {
            // Check if the last update was yesterday
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastUpdateDate.getTime() === yesterday.getTime()) {
                newStreak += 1; // It was yesterday, so continue the streak
            } else {
                newStreak = 1; // It was not yesterday, so reset streak to 1
            }
        } else {
            newStreak = 1; // This is the first resist
        }
       
        return {
          ...prevState,
          day: newDay,
          streak: newStreak,
          bestStreak: Math.max(prevState.bestStreak, newStreak),
          rockCleanliness: Math.min(90, prevState.rockCleanliness + 1 + Math.floor(newStreak / 5)), // Use newStreak for bonus
          lastUpdate: now.getTime(),
          activityLog: [...prevState.activityLog, { timestamp: now.getTime(), action: 'resist' }],
        };
    });
  }, []);

  const handleGiveIn = useCallback((details: { emotion: string; trigger: string; timestamp: number }) => {
     updateState(prevState => {
        const newDay = Math.max(0, prevState.day - 1); // Decrease day by 1
      
        return {
            ...prevState,
            day: newDay,
            streak: 0,
            rockCleanliness: Math.max(0, prevState.rockCleanliness - 5), // Penalty
            lastUpdate: new Date().getTime(),
            activityLog: [
                ...prevState.activityLog, 
                { 
                    timestamp: details.timestamp, 
                    action: 'give_in', 
                    emotion: details.emotion, 
                    trigger: details.trigger 
                }
            ],
            giveInsSinceLastInsight: (prevState.giveInsSinceLastInsight || 0) + 1,
        };
     });
  }, []);
  
  const setAiInsight = useCallback((insightText: string) => {
    updateState(prevState => ({
      ...prevState,
      aiInsight: {
        text: insightText,
        generatedAt: Date.now(),
      },
      giveInsSinceLastInsight: 0,
    }));
  }, []);

  const savePersonalization = useCallback((data: { habitType?: string; urgeTiming?: string }) => {
    updateState(prevState => ({
      ...prevState,
      habitType: data.habitType || prevState.habitType,
      urgeTiming: data.urgeTiming || prevState.urgeTiming,
    }));
  }, []);
  
  const resetData = useCallback(() => {
    try {
      localStorage.removeItem(HABIT_DATA_KEY);
      window.location.reload();
    } catch (error) {
      console.error("Failed to reset data in localStorage", error);
    }
  }, []);

  const addChatMessage = useCallback((message: ChatMessage) => {
    updateState(prevState => {
        const todayStr = new Date().toISOString().split('T')[0];
        let newChatCount = { ...prevState.chatCount };

        // Reset counters if the date has changed
        if (prevState.chatCount.lastChatDate !== todayStr) {
            newChatCount.daily = 0;
            // Check if month has changed
            if (prevState.chatCount.lastChatDate.substring(0, 7) !== todayStr.substring(0, 7)) {
                newChatCount.monthly = 0;
            }
            newChatCount.lastChatDate = todayStr;
        }

        // Increment counts if it's a user message
        if (message.role === 'user') {
            newChatCount.daily += 1;
            newChatCount.monthly += 1;
        }

        return {
            ...prevState,
            chatHistory: [...prevState.chatHistory, message],
            chatCount: newChatCount
        };
    });
  }, []);
  
  const updateLastChatMessage = useCallback((update: { textChunk?: string; sources?: GroundingSource[] }) => {
    updateState(prevState => {
        const newHistory = [...prevState.chatHistory];
        if (newHistory.length > 0) {
            const lastMessage = { ...newHistory[newHistory.length - 1] }; // Create a new object to ensure re-render
            if (update.textChunk) {
                lastMessage.text += update.textChunk;
            }
            if (update.sources && update.sources.length > 0) {
                lastMessage.sources = update.sources;
            }
            newHistory[newHistory.length - 1] = lastMessage;
        }
        return { ...prevState, chatHistory: newHistory };
    });
  }, []);


  return { state, handleResist, handleGiveIn, setAiInsight, resetData, savePersonalization, addChatMessage, updateLastChatMessage };
};