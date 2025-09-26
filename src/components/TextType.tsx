// FIX: Added default React import to resolve "Cannot find namespace 'React'" error.
import React, { ElementType, useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

interface TextTypeProps {
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | React.ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
}

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  
  // Use refs for animation state to prevent stale closures in timeouts
  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const isAnimating = useRef(false); // To prevent multiple loops from starting

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Observe only once
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible || textArray.length === 0 || textArray[0] === '' || isAnimating.current) return;
    
    // Reset state when text prop changes
    setDisplayedText('');
    textIndex.current = 0;
    charIndex.current = 0;
    isDeleting.current = false;
    
    // Fix: Use ReturnType<typeof setTimeout> for portability between environments (browser vs. node).
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const currentSentence = textArray[textIndex.current];
      const speed = variableSpeed ? getRandomSpeed() : typingSpeed;

      if (isDeleting.current) {
        // Deleting phase
        if (charIndex.current > 0) {
          setDisplayedText(currentSentence.substring(0, charIndex.current - 1));
          charIndex.current--;
          timeout = setTimeout(type, deletingSpeed);
        } else {
          // Finished deleting
          isDeleting.current = false;
          textIndex.current = (textIndex.current + 1) % textArray.length;

          // Stop if we've completed the cycle and loop is false
          if (textIndex.current === 0 && !loop) {
             isAnimating.current = false;
             return;
          }
          
          // Pause briefly before typing the next sentence
          timeout = setTimeout(type, typingSpeed); 
        }
      } else {
        // Typing phase
        if (charIndex.current < currentSentence.length) {
          setDisplayedText(currentSentence.substring(0, charIndex.current + 1));
          charIndex.current++;
          timeout = setTimeout(type, speed);
        } else {
          // Finished typing a sentence
          if (onSentenceComplete) {
            onSentenceComplete(currentSentence, textIndex.current);
          }
          
          // If there's more text or we're looping, start deleting after a pause
          if (textArray.length > 1 || loop) {
            isDeleting.current = true;
            timeout = setTimeout(type, pauseDuration);
          } else {
            isAnimating.current = false;
          }
        }
      }
    };

    // Start the animation after the initial delay
    isAnimating.current = true;
    timeout = setTimeout(type, initialDelay);

    // Cleanup function to clear timeout on component unmount or dependency change
    return () => {
        isAnimating.current = false;
        clearTimeout(timeout);
    };
  }, [
    textArray,
    isVisible,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    loop,
    initialDelay,
    onSentenceComplete,
    getRandomSpeed,
    variableSpeed
  ]);

  const isCurrentlyTyping = charIndex.current < (textArray[textIndex.current]?.length || 0) && !isDeleting.current;
  const shouldHideCursor = hideCursorWhileTyping && (isCurrentlyTyping || isDeleting.current);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props
    },
    <span className="text-type__content">
      {displayedText}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
      >
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;