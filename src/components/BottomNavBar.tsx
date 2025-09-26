import React from 'react';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavItem: React.FC<{
  label: string;
  // FIX: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'".
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 space-y-1 transition-colors duration-300 focus:outline-none ${
      isActive
        ? 'text-habico-blue dark:text-dark-habico-blue'
        : 'text-habico-text-secondary dark:text-dark-habico-text-secondary hover:text-habico-text-primary dark:hover:text-dark-habico-text-primary'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const RockIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const ChatIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);


const InsightsIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

const SettingsIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { label: 'Rock', icon: RockIcon },
    { label: 'Chat', icon: ChatIcon },
    { label: 'Insights', icon: InsightsIcon },
    { label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-habico-card dark:bg-dark-habico-card border-t border-habico-border dark:border-dark-habico-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)] z-40">
      <div className="flex justify-around h-full">
        {navItems.map(({ label, icon: Icon }) => (
          <NavItem
            key={label}
            label={label}
            icon={<Icon isActive={activeTab === label} />}
            isActive={activeTab === label}
            onClick={() => setActiveTab(label)}
          />
        ))}
      </div>
    </nav>
  );
};