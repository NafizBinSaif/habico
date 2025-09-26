import React, { useState } from 'react';
import { Step1_Welcome } from '../components/onboarding/Step1_Welcome';
import { Step2_Name } from '../components/onboarding/Step2_Name';
import { Step2_Resist } from '../components/onboarding/Step2_Resist';
import { Step3_GiveIn } from '../components/onboarding/Step3_GiveIn';
import { Step4_Goal } from '../components/onboarding/Step4_Goal';
import { Step5_HabitType } from '../components/onboarding/Step5_HabitType';
import { Step6_UrgeTiming } from '../components/onboarding/Step6_UrgeTiming';
import { Step7_Credibility } from '../components/onboarding/Step7_Credibility';
import { Step8_Paywall } from '../components/onboarding/Step8_Paywall';
import { Step9_Account } from '../components/onboarding/Step9_Account';
import type { User } from '../types';

interface OnboardingPageProps {
  onComplete: (surveyData: { habitType?: string; urgeTiming?: string }) => void;
  theme: 'light' | 'dark';
  user: User;
  updateUser: (details: Partial<User>) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, theme, user, updateUser }) => {
  const [step, setStep] = useState(1);
  const [surveyData, setSurveyData] = useState<{ habitType?: string; urgeTiming?: string }>({});
  const [chosePaidPlan, setChosePaidPlan] = useState(false);

  const handleNextStep = () => setStep(prev => prev + 1);

  const handleNameSet = (name: string) => {
    updateUser({ name });
    handleNextStep();
  };

  const handleSetHabitType = (habit: string) => {
    setSurveyData(prev => ({ ...prev, habitType: habit }));
    handleNextStep();
  };

  const handleSetUrgeTiming = (timing: string) => {
    setSurveyData(prev => ({ ...prev, urgeTiming: timing }));
    handleNextStep();
  };
  
  const handlePaywallChoice = (plan: 'free' | 'monthly' | 'lifetime') => {
    const isPaid = plan !== 'free';
    setChosePaidPlan(isPaid);
    updateUser({ plan });
    handleNextStep();
  };

  const handleAccountCreationAndComplete = (userDetails?: Partial<User>) => {
    if (userDetails) {
      updateUser(userDetails);
    }
    onComplete(surveyData);
  };
  
  const renderContent = () => {
    switch (step) {
      case 1: return <Step1_Welcome onNext={handleNextStep} />;
      case 2: return <Step2_Name onNext={handleNameSet} />;
      case 3: return <Step2_Resist onNext={handleNextStep} user={user} />;
      case 4: return <Step3_GiveIn onNext={handleNextStep} />;
      case 5: return <Step4_Goal onNext={handleNextStep} />;
      case 6: return <Step5_HabitType onNext={handleSetHabitType} onSkip={handleNextStep} />;
      case 7: return <Step6_UrgeTiming onNext={handleSetUrgeTiming} onSkip={handleNextStep} />;
      case 8: return <Step7_Credibility onNext={handleNextStep} />;
      case 9: return <Step8_Paywall onNext={handlePaywallChoice} />;
      case 10: return <Step9_Account onComplete={handleAccountCreationAndComplete} theme={theme} hideSkip={chosePaidPlan} />;
      default: return <Step1_Welcome onNext={handleNextStep} />;
    }
  };

  return (
    <div className="bg-habico-background dark:bg-dark-habico-background min-h-screen flex flex-col items-center justify-center p-4 text-center text-habico-text-primary dark:text-dark-habico-text-primary">
      <div className="w-full max-w-md animate-bubble-in" key={step}>
        {renderContent()}
      </div>
    </div>
  );
};