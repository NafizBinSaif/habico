import React, { useState, useEffect, useRef } from 'react';
import type { HabitState, ChatMessage, GroundingSource, User } from '../types';
import { getRockChatResponse } from '../services/geminiService';
import { ChatDisclaimerModal } from '../components/ChatDisclaimerModal';

interface ChatPageProps {
  state: HabitState;
  user: User;
  addChatMessage: (message: ChatMessage) => void;
  updateLastChatMessage: (update: { textChunk?: string; sources?: GroundingSource[] }) => void;
}

const DISCLAIMER_KEY = 'habico-chat-disclaimer-seen';

const RockAvatar: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-habico-border dark:bg-dark-habico-border flex items-center justify-center shrink-0">
        <svg width="20" height="20" viewBox="0 0 200 200" className="opacity-60">
             <path
                d="M162.3,101.9c-5.8,25.6-26.4,47.8-51,55.9c-24.6,8.1-51.5,1.2-69.5-16.9C24,123.1,17,96.5,23.8,70.9c6.8-25.6,27.4-47.8,52-55.9c24.6-8.1,51.5-1.2,69.5,16.9C163.1,49.7,170,76.3,162.3,101.9Z"
                className="fill-habico-text-secondary dark:fill-dark-habico-text-secondary"
             />
        </svg>
    </div>
);

const SendIcon: React.FC<{ enabled: boolean }> = ({ enabled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-200 ease-in-out ${enabled ? 'scale-100' : 'scale-90'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

const SourcePills: React.FC<{ sources: GroundingSource[] }> = ({ sources }) => (
  <div className="mt-2 flex flex-wrap gap-2 max-w-xs md:max-w-md">
    {sources.map((source, index) => (
      <a
        key={index}
        href={source.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-habico-border dark:bg-dark-habico-border px-2.5 py-1 rounded-full text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        <span className="truncate max-w-[150px]">{source.title}</span>
      </a>
    ))}
  </div>
);


export const ChatPage: React.FC<ChatPageProps> = ({ state, user, addChatMessage, updateLastChatMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const hasSeenDisclaimer = localStorage.getItem(DISCLAIMER_KEY);
      if (!hasSeenDisclaimer) {
        setShowDisclaimer(true);
      }
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
    }
  }, []);

  const handleDisclaimerClose = () => {
    try {
      localStorage.setItem(DISCLAIMER_KEY, 'true');
    } catch (error) {
      console.error("Failed to write to localStorage:", error);
    }
    setShowDisclaimer(false);
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // A slight delay ensures the scroll happens after the new message is rendered.
    setTimeout(scrollToBottom, 50);
  }, [state.chatHistory, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: trimmedInput,
      timestamp: Date.now(),
    };
    addChatMessage(userMessage);
    
    // Add a placeholder for the streaming response
    const placeholderMessage: ChatMessage = { role: 'model', text: '', timestamp: Date.now() + 1, sources: [] };
    addChatMessage(placeholderMessage);

    setInputValue('');
    setIsLoading(true);

    try {
        const historyForApi = [...state.chatHistory, userMessage];
        await getRockChatResponse(historyForApi, state, user, (update) => {
            updateLastChatMessage(update);
        });
    } catch (error) {
        console.error("Failed to get chat response:", error);
        updateLastChatMessage({ textChunk: "\n\nSorry, I'm having trouble connecting right now." });
    } finally {
        setIsLoading(false);
    }
  };
  
  const dailyLimitReached = user.plan === 'free' && (state.chatCount?.daily || 0) >= 3;
  const monthlyLimitReached = user.plan === 'free' && (state.chatCount?.monthly || 0) >= 30;
  const isChatDisabled = isLoading || dailyLimitReached || monthlyLimitReached;
  
  let limitMessage = '';
  if (dailyLimitReached) {
    limitMessage = `You've reached your daily message limit (${state.chatCount.daily}/3). Upgrade for unlimited chat.`;
  } else if (monthlyLimitReached) {
    limitMessage = `You've reached your monthly message limit (${state.chatCount.monthly}/30). Upgrade for unlimited chat.`;
  }


  return (
    <>
      <ChatDisclaimerModal isOpen={showDisclaimer} onClose={handleDisclaimerClose} />
      <div className="flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-habico-background/50 dark:bg-dark-habico-background/50 rounded-lg space-y-6">
          {state.chatHistory.map((message, index) => (
            (message.text || (isLoading && index === state.chatHistory.length - 1)) && (
              <div key={message.timestamp} className={`flex flex-col animate-bubble-in ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-start gap-3 w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'model' && <RockAvatar />}
                      <div
                          className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${
                          message.role === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-br-lg'
                              : 'bg-habico-card dark:bg-dark-habico-card text-habico-text-primary dark:text-dark-habico-text-primary rounded-bl-lg'
                          }`}
                      >
                          {message.text ? (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          ) : (
                          <div className="flex items-center space-x-1 p-1">
                              <div className="w-2 h-2 bg-habico-text-secondary dark:bg-dark-habico-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-habico-text-secondary dark:bg-dark-habico-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-habico-text-secondary dark:bg-dark-habico-text-secondary rounded-full animate-bounce"></div>
                          </div>
                          )}
                      </div>
                  </div>
                  {message.sources && message.sources.length > 0 && (
                      <div className="pl-11"> {/* Aligns with the start of the rock's message bubble */}
                          <SourcePills sources={message.sources} />
                      </div>
                  )}
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 pt-4">
           {limitMessage && (
            <div className="text-center text-sm text-habico-red dark:text-dark-habico-red p-2 mb-2 bg-red-100/50 dark:bg-red-900/20 rounded-lg">
                <p>{limitMessage}</p>
            </div>
           )}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? "Habico is thinking..." : "Ask Habico a question..."}
                className="w-full pl-4 pr-14 py-3 bg-habico-background dark:bg-dark-habico-background border-2 border-habico-border dark:border-dark-habico-border rounded-xl text-habico-text-primary dark:text-dark-habico-text-primary focus:outline-none focus:ring-2 focus:ring-habico-blue dark:focus:ring-dark-habico-blue transition-all disabled:opacity-60"
                disabled={isChatDisabled}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center bg-habico-blue dark:bg-dark-habico-blue text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-habico-blue"
                disabled={!inputValue.trim() || isChatDisabled}
                aria-label="Send message"
              >
                <SendIcon enabled={!!inputValue.trim() && !isLoading} />
              </button>
            </div>
          </form>
          <div className="mt-3 flex items-center justify-center text-center text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary">
            <span>The Rock is an AI and not a therapist.</span>
            <button
              onClick={() => setShowDisclaimer(true)}
              className="ml-2 px-2 py-1 rounded-md font-semibold text-habico-blue dark:text-dark-habico-blue hover:bg-habico-blue/10 dark:hover:bg-dark-habico-blue/20 transition-colors"
            >
              Get Help
            </button>
          </div>
        </div>
      </div>
    </>
  );
};