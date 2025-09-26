import React, { useState } from 'react';
import { Rock } from '../Rock';

interface StepProps {
  onNext: (name: string) => void;
}

export const Step2_Name: React.FC<StepProps> = ({ onNext }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-habico-text-primary dark:text-dark-habico-text-primary mb-2">
        Wait a second...
      </h1>
      <p className="text-lg text-habico-text-secondary dark:text-dark-habico-text-secondary mb-8">
        My memory can be a bit rocky. What was your name again?
      </p>

      <div className="w-[200px] h-[200px] mx-auto mb-8">
        <Rock cleanliness={10} />
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="w-full px-4 py-3 text-center bg-habico-card dark:bg-dark-habico-card border-2 border-habico-border dark:border-dark-habico-border rounded-lg text-habico-text-primary dark:text-dark-habico-text-primary focus:outline-none focus:ring-2 focus:ring-habico-blue dark:focus:ring-dark-habico-blue"
          required
          autoFocus
        />
        <button
          type="submit"
          className="w-full mt-4 text-center text-lg font-bold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75 bg-habico-blue dark:bg-dark-habico-blue text-white focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50"
          disabled={!name.trim()}
        >
          Right, that's me.
        </button>
      </form>
    </>
  );
};