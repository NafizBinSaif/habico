import React, { useEffect, useState } from 'react';
import TextType from './TextType';

interface SpeechBubbleProps {
  message: string;
  isVisible: boolean;
  className?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  message,
  isVisible,
  className = '',
}) => {
  // Keep the node mounted until the exit animation finishes
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) setShouldRender(true);
  }, [isVisible]);

  const handleAnimationEnd = () => {
    // After exit animation completes, unmount
    if (!isVisible) setShouldRender(false);
  };

  if (!shouldRender) return null;

  const animationClass = isVisible ? 'animate-bubble-in' : 'animate-bubble-out';

  return (
    <div
      // Re-trigger enter animation when message changes while visible
      key={isVisible ? message : 'hidden'}
      onAnimationEnd={handleAnimationEnd}
      className={[
        'relative w-full max-w-sm mx-auto mb-4',
        'bg-habico-speech-bubble dark:bg-dark-habico-speech-bubble',
        'text-habico-text-primary dark:text-dark-habico-text-primary',
        'font-medium px-4 py-3 rounded-xl shadow-md',
        'origin-bottom will-change-[opacity,transform]',
        animationClass,
        className,
      ].join(' ')}
      role="alert"
      aria-live="assertive"
    >
      <div className="text-sm sm:text-base text-center">
        <TextType
            key={message}
            as="p"
            text={message}
            typingSpeed={50}
            loop={false}
            showCursor={true}
            cursorCharacter="|"
        />
      </div>


      {/* Tail */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
          border-l-8 border-l-transparent
          border-r-8 border-r-transparent
          border-t-8 border-t-habico-speech-bubble
          dark:border-t-dark-habico-speech-bubble"
      />
    </div>
  );
};