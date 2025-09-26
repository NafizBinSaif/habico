import React, { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { habitInsights } from '../services/habitInsights';
import { WisdomCard } from '../components/WisdomCard';
import { EmptyState } from '../components/EmptyState';

gsap.registerPlugin(Draggable);

// Helper function to shuffle an array
const shuffleArray = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SwipeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l-5 5 2-11 11 2z" />
    </svg>
);

const ReloadIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);


export const WisdomPage: React.FC = () => {
  const [cards, setCards] = useState<string[]>([]);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const draggableInstance = useRef<Draggable[]>([]);
  const activeCardIndex = useMemo(() => cards.length - 1, [cards]);

  // Initial shuffle on component mount
  useEffect(() => {
    setCards(shuffleArray(habitInsights));
  }, []);

  const removeCard = (index: number, direction: 'left' | 'right') => {
    gsap.to(`.wisdom-card-${index}`, {
      x: direction === 'right' ? '100vw' : '-100vw',
      rotation: direction === 'right' ? 30 : -30,
      opacity: 0,
      duration: 0.5,
      ease: 'power1.in',
      onComplete: () => {
        setCards(prev => prev.slice(0, prev.length - 1));
      }
    });
  };

  useEffect(() => {
    if (activeCardIndex < 0 || !cardContainerRef.current) return;

    // Cleanup previous draggable instance
    if (draggableInstance.current[0]) {
      draggableInstance.current[0].kill();
    }

    const activeCardElement = cardContainerRef.current.querySelector(`.wisdom-card-${activeCardIndex}`);
    if (!activeCardElement) return;

    draggableInstance.current = Draggable.create(activeCardElement, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: 'body',
      onDrag: function() {
        const rotation = this.x / 20;
        gsap.to(this.target, { rotation, duration: 0.1 });
      },
      onDragEnd: function() {
        if (Math.abs(this.x) > 120) {
          removeCard(activeCardIndex, this.x > 0 ? 'right' : 'left');
        } else {
          gsap.to(this.target, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: 'power2.out' });
        }
      }
    });

    return () => {
        if (draggableInstance.current[0]) {
           draggableInstance.current[0].kill();
        }
    }
  }, [activeCardIndex]);

  const resetDeck = () => {
    setCards(shuffleArray(habitInsights));
  };


  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full max-w-md mx-auto relative">
      <div ref={cardContainerRef} className="relative w-full h-[80%] aspect-[3/4] max-h-[500px]">
        {cards.length > 0 ? (
          cards.map((text, index) => {
            const isTopCard = index === cards.length - 1;
            return (
              <div
                key={text}
                className={`wisdom-card-${index} absolute w-full h-full transition-transform duration-300 ease-out origin-bottom ${isTopCard ? 'cursor-grab active:cursor-grabbing' : ''}`}
                style={{
                  transform: `scale(${1 - (cards.length - 1 - index) * 0.05}) translateY(-${(cards.length - 1 - index) * 10}px)`,
                  zIndex: index,
                }}
              >
                <WisdomCard text={text} />
              </div>
            );
          })
        ) : (
          <EmptyState
            icon={<ReloadIcon />}
            title="That's All For Now"
            message="You've seen all the wisdom cards. Come back later for more inspiration or reshuffle the deck."
            actionButton={{ text: "Reshuffle", onClick: resetDeck }}
          />
        )}
      </div>

       {cards.length > 0 && (
         <div className="mt-8 flex flex-col items-center justify-center text-center text-habico-text-secondary dark:text-dark-habico-text-secondary">
            <SwipeIcon />
            <p className="text-sm font-semibold mt-2">Swipe or drag a card to dismiss</p>
         </div>
       )}
    </div>
  );
};