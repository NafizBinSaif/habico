import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'blue' | 'red';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'red',
}) => {
  if (!isOpen) {
    return null;
  }

  const colorClasses = confirmColor === 'red' 
    ? 'bg-habico-red text-white hover:bg-red-500 focus:ring-red-300' 
    : 'bg-habico-blue text-white hover:bg-blue-500 focus:ring-blue-300';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-bubble-in"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirmation-title"
    >
      <div className="bg-habico-card dark:bg-dark-habico-card rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <h2 id="confirmation-title" className="text-xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-2">
          {title}
        </h2>
        <p className="text-habico-text-secondary dark:text-dark-habico-text-secondary mb-6">
          {message}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="w-full font-semibold py-2 px-4 rounded-lg transition-colors border border-habico-border dark:border-dark-habico-border hover:bg-habico-border dark:hover:bg-dark-habico-border"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-75 ${colorClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
