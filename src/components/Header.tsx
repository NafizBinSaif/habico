import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    theme: 'light' | 'dark';
    toggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void;
    user: User;
}

const ThemeToggleButton: React.FC<{ theme: 'light' | 'dark'; toggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void }> = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full flex items-center justify-center text-habico-text-secondary dark:text-dark-habico-text-secondary hover:bg-habico-border dark:hover:bg-dark-habico-border focus:outline-none focus:ring-2 focus:ring-habico-blue dark:focus:ring-dark-habico-blue transition-colors duration-300"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
        <div className="relative w-6 h-6">
            {/* Sun Icon */}
            <svg
                xmlns="http://www.w.org/2000/svg"
                className={`absolute inset-0 w-6 h-6 transition-all duration-500 transform ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {/* Moon Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute inset-0 w-6 h-6 transition-all duration-500 transform ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        </div>
    </button>
);

const Avatar: React.FC<{ user: User }> = ({ user }) => {
    const initials = user.name ? user.name.charAt(0).toUpperCase() : '?';
    return (
        <div className="w-8 h-8 rounded-full bg-habico-blue dark:bg-dark-habico-blue flex items-center justify-center text-white font-bold text-sm">
            {initials}
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, theme, toggleTheme, user }) => {
    const navItems = ['Rock', 'Chat', 'Insights', 'Settings'];

    return (
        <header className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" className="fill-habico-blue dark:fill-dark-habico-blue"/>
                    <path d="M16.5116 11.2326C14.7791 11.2326 13.3488 12.6628 13.3488 14.3953C13.3488 17.5814 16.5116 21.6047 16.5116 21.6047C16.5116 21.6047 19.6744 17.5814 19.6744 14.3953C19.6744 12.6628 18.2442 11.2326 16.5116 11.2326Z" fill="white"/>
                </svg>
                <h1 className="text-3xl font-bold text-habico-blue dark:text-dark-habico-blue">Habico</h1>
            </div>
            <nav className="hidden sm:flex items-center space-x-6">
                {navItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`text-lg transition-colors duration-300 ${activeTab === item ? 'text-habico-text-primary dark:text-dark-habico-text-primary font-semibold' : 'text-habico-text-secondary dark:text-dark-habico-text-secondary hover:text-habico-text-primary dark:hover:text-dark-habico-text-primary'}`}
                    >
                        {item}
                    </button>
                ))}
            </nav>
            <div className="flex items-center space-x-4">
                 <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
                 <Avatar user={user} />
            </div>
        </header>
    );
};