import React from 'react';
import { Rock } from './Rock';
import { SpeechBubble } from './SpeechBubble';

interface ResistModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const ResistModal: React.FC<ResistModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center p-4 animate-bubble-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-habico-card dark:bg-dark-habico-card rounded-2xl shadow-xl w-full max-w-md relative flex flex-col items-center p-6">
        {message ? (
          <SpeechBubble message={message} isVisible={true} className="!static mb-4" />
        ) : (
          <h2 className="text-3xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-4">Look at that shine.</h2>
        )}
        
        <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px]">
          {/* Always show the perfectly clean rock as a reward */}
          <Rock cleanliness={90} />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 text-center text-lg font-bold py-3 rounded-xl transition-colors duration-300 bg-habico-blue dark:bg-dark-habico-blue hover:bg-blue-500 dark:hover:bg-blue-400 text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
};