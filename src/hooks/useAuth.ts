import { useState, useCallback } from 'react';
import type { User } from '../types';

const USER_KEY = 'habico-user';
const HABIT_DATA_KEY = 'habicoData';
const ONBOARDING_KEY = 'habico-onboarding-complete';


const initializeUser = (): User => {
  try {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error("Failed to load user from localStorage", error);
  }
  
  const defaultUser: User = {
    name: 'Friend',
    email: 'friend@habico.app',
    plan: 'free',
  };

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
  } catch (error) {
    console.error("Failed to save default user", error);
  }

  return defaultUser;
};


export const useAuth = () => {
  const [user, setUser] = useState<User>(initializeUser);

  const logout = useCallback(() => {
    try {
      // For this app, logging out is the same as deleting local data and starting fresh
      // In a real app with a server, this would just clear a token.
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(HABIT_DATA_KEY);
      localStorage.removeItem(ONBOARDING_KEY);
      window.location.reload();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  }, []);
  
  const deleteAccount = useCallback(() => {
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(HABIT_DATA_KEY);
      localStorage.removeItem(ONBOARDING_KEY);
      window.location.reload(); // Force a full refresh to clear all state
    } catch (error) {
      console.error("Failed to delete account", error);
    }
  }, []);

  const updateUser = useCallback((details: Partial<User>) => {
    const updatedUser = { ...user, ...details };
     try {
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
     } catch (error) {
      console.error("Failed to update user in localStorage", error);
     }
  }, [user]);

  return { user, logout, deleteAccount, updateUser };
};
