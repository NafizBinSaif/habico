import React from 'react';

interface ChatDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDisclaimerModal: React.FC<ChatDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-bubble-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-habico-card dark:bg-dark-habico-card rounded-2xl shadow-xl w-full max-w-md p-6 relative text-habico-text-primary dark:text-dark-habico-text-primary">
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-4">
                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Important Notice</h2>
            <div className="text-sm text-habico-text-secondary dark:text-dark-habico-text-secondary space-y-3">
                <p>
                    The Habit Rock is an AI data analyst designed for motivation and habit-tracking. It is not a therapist, doctor, or a substitute for professional medical or mental health advice.
                </p>
                <p>
                    It cannot diagnose conditions or provide crisis support. Your conversations are analyzed to improve the service and are not private in the way a conversation with a doctor would be.
                </p>
                <p className="font-semibold">
                    If you are in crisis or feeling overwhelmed, please contact a qualified professional or a crisis support service in your area immediately.
                </p>
            </div>
            <button
              onClick={onClose}
              className="w-full mt-6 text-center text-lg font-bold py-3 rounded-xl transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue hover:bg-blue-500 dark:hover:bg-blue-400 text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              I Understand
            </button>
        </div>
      </div>
    </div>
  );
};