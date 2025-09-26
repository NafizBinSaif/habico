import React, { useState, useEffect } from 'react';
import type { HabitState, User } from '../types';
import type { ThemeSetting } from '../App';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ToggleSwitch } from '../components/ToggleSwitch';

interface SettingsPageProps {
  state: HabitState;
  resetData: () => void;
  user: User;
  updateUser: (details: Partial<User>) => void;
  savePersonalization: (details: { habitType?: string; urgeTiming?: string }) => void;
  logout: () => void;
  deleteAccount: () => void;
  themeSetting: ThemeSetting;
  changeTheme: (theme: ThemeSetting) => void;
}

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-habico-background dark:bg-dark-habico-background p-4 sm:p-6 rounded-lg shadow-sm border border-habico-border dark:border-dark-habico-border ${className}`}>
    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-habico-text-primary dark:text-dark-habico-text-primary">{title}</h3>
    <div className="space-y-4">
        {children}
    </div>
  </div>
);

const SettingsRow: React.FC<{ label: string; sublabel?: string; children: React.ReactNode; isButton?: boolean; onClick?: () => void; }> = ({ label, sublabel, children, isButton, onClick }) => (
    <div 
        className={`flex items-center justify-between ${isButton ? 'cursor-pointer hover:bg-habico-border/50 dark:hover:bg-dark-habico-border/50 -m-2 p-2 rounded-lg transition-colors' : ''}`}
        onClick={onClick}
    >
        <div>
            <p className="font-medium text-habico-text-primary dark:text-dark-habico-text-primary">{label}</p>
            {sublabel && <p className="text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary">{sublabel}</p>}
        </div>
        <div className="flex items-center space-x-2">
            {children}
        </div>
    </div>
);

const ProBadge = () => (
    <span className="text-xs font-semibold bg-yellow-400/80 text-yellow-900 px-2 py-0.5 rounded-full">Pro</span>
);


export const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const { state, resetData, user, updateUser, savePersonalization, logout, deleteAccount, themeSetting, changeTheme } = props;
  
  const [name, setName] = useState(user.name);
  const [habitType, setHabitType] = useState(state.habitType || '');
  
  // Modals
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Notifications
  const [dailyReminder, setDailyReminder] = useState(true);
  const [rockMessages, setRockMessages] = useState(true);
  const [urgencyAlerts, setUrgencyAlerts] = useState(false);
  
  const isPaidUser = user.plan !== 'free';

  useEffect(() => { setName(user.name); }, [user.name]);
  useEffect(() => { setHabitType(state.habitType || ''); }, [state.habitType]);

  const handleNameSave = () => {
    if (name.trim() && name.trim() !== user.name) {
      updateUser({ name: name.trim() });
    }
  };

  const handleHabitSave = () => savePersonalization({ habitType });
  
  const handleExport = () => alert("Exporting data... (not implemented)");
  
  const planText = user.plan === 'lifetime' ? 'Lifetime' : user.plan === 'monthly' ? 'Monthly' : 'Free';

  return (
    <>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Account */}
        <SettingsCard title="Account">
            <SettingsRow label="Profile">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-habico-blue dark:bg-dark-habico-blue flex items-center justify-center text-white font-bold text-lg">
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary">{user.email}</p>
                    </div>
                </div>
            </SettingsRow>
             <SettingsRow label="Manage Account" isButton onClick={() => alert('Manage Account page (not implemented)')}>
                <ChevronRightIcon />
            </SettingsRow>
            <SettingsRow label="Subscription Plan" sublabel={`Currently on ${planText} Plan`}>
                 <button className="text-sm font-semibold py-1 px-3 rounded-md bg-habico-blue text-white transition-colors hover:bg-blue-700">
                    {isPaidUser ? 'Manage Billing' : 'Upgrade'}
                </button>
            </SettingsRow>
            <SettingsRow label="Restore Purchases" isButton onClick={() => alert('Restoring purchases...')}>
                <ChevronRightIcon />
            </SettingsRow>
        </SettingsCard>

        {/* Habits & Data */}
        <SettingsCard title="Habits & Data">
             <SettingsRow label="Manage Habits" isButton onClick={() => alert('Manage habits page (not implemented)')}>
                <ChevronRightIcon />
            </SettingsRow>
             <SettingsRow label="Daily Reminder Time">
                <input type="time" defaultValue="09:00" className="bg-habico-card dark:bg-dark-habico-card border border-habico-border dark:border-dark-habico-border rounded-md px-2 py-1 text-sm"/>
            </SettingsRow>
            <SettingsRow label="Export Data">
                {!isPaidUser && <ProBadge />}
                <button onClick={handleExport} disabled={!isPaidUser} className="text-sm font-semibold py-1 px-3 rounded-md bg-habico-blue text-white disabled:bg-gray-400 disabled:cursor-not-allowed">Export</button>
            </SettingsRow>
             <SettingsRow label="Reset Progress" isButton onClick={() => setIsResetModalOpen(true)}>
                <p className="text-sm font-semibold text-habico-red dark:text-dark-habico-red">Reset...</p>
            </SettingsRow>
        </SettingsCard>
        
        {/* Notifications */}
        <SettingsCard title="Notifications">
            <SettingsRow label="Daily Check-In Reminder">
                {!isPaidUser && <ProBadge />}
                <ToggleSwitch enabled={dailyReminder && isPaidUser} onChange={setDailyReminder} disabled={!isPaidUser}/>
            </SettingsRow>
            <SettingsRow label="Motivational Rock Messages">
                {!isPaidUser && <ProBadge />}
                <ToggleSwitch enabled={rockMessages && isPaidUser} onChange={setRockMessages} disabled={!isPaidUser}/>
            </SettingsRow>
            <SettingsRow label="Urgency Alerts">
                {!isPaidUser && <ProBadge />}
                <ToggleSwitch enabled={urgencyAlerts && isPaidUser} onChange={setUrgencyAlerts} disabled={!isPaidUser} />
            </SettingsRow>
        </SettingsCard>

        {/* Appearance & Experience */}
        <SettingsCard title="Appearance & Experience">
            <SettingsRow label="Theme">
                 <div className="flex items-center space-x-1 bg-habico-border dark:bg-dark-habico-border p-1 rounded-lg">
                    <ThemeButton current={themeSetting} value="light" onClick={() => changeTheme('light')}>Light</ThemeButton>
                    <ThemeButton current={themeSetting} value="dark" onClick={() => changeTheme('dark')}>Dark</ThemeButton>
                    <ThemeButton current={themeSetting} value="system" onClick={() => changeTheme('system')}>System</ThemeButton>
                 </div>
            </SettingsRow>
        </SettingsCard>
        
        {/* Privacy & Security */}
        <SettingsCard title="Privacy & Security">
             <SettingsRow label="Data Policy" isButton onClick={() => alert('Privacy Policy page (not implemented)')}><ChevronRightIcon /></SettingsRow>
             <SettingsRow label="Delete Account" isButton onClick={() => setIsDeleteModalOpen(true)}>
                 <p className="text-sm font-semibold text-habico-red dark:text-dark-habico-red">Delete...</p>
             </SettingsRow>
        </SettingsCard>
        
         {/* Help & Support */}
        <SettingsCard title="Help & Support">
             <SettingsRow label="FAQ / Help Center" isButton onClick={() => alert('Help page (not implemented)')}><ChevronRightIcon /></SettingsRow>
             <SettingsRow label="Contact Support" isButton onClick={() => alert('Contact form (not implemented)')}><ChevronRightIcon /></SettingsRow>
             <SettingsRow label="Send Feedback" isButton onClick={() => alert('Feedback form (not implemented)')}><ChevronRightIcon /></SettingsRow>
        </SettingsCard>
        
        {/* About */}
        <div className="text-center text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary space-y-1">
            <p>App Version v1.0.3</p>
            <p>Built with ❤️ by Habico</p>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} onConfirm={() => { resetData(); setIsResetModalOpen(false); }} title="Reset Progress?" message="This will permanently delete your streak, activity log, and rock cleanliness. Your account will not be affected." confirmText="Yes, Reset" confirmColor="red" />
      <ConfirmationModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={logout} title="Log Out?" message="Are you sure you want to log out?" confirmText="Log Out" confirmColor="red" />
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={deleteAccount} title="Delete Account?" message="This will permanently delete your account and all associated data. This action cannot be undone." confirmText="Delete Forever" confirmColor="red" />
    </>
  );
};

const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-habico-text-secondary dark:text-dark-habico-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

const ThemeButton: React.FC<{current: ThemeSetting, value: ThemeSetting, onClick: () => void, children: React.ReactNode}> = ({ current, value, onClick, children }) => (
    <button onClick={onClick} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${current === value ? 'bg-habico-card dark:bg-dark-habico-card text-habico-text-primary dark:text-dark-habico-text-primary' : 'text-habico-text-secondary dark:text-dark-habico-text-secondary hover:bg-habico-card/50 dark:hover:bg-dark-habico-card/50'}`}>
        {children}
    </button>
);