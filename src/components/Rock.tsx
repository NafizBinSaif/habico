import React from 'react';

interface RockProps {
  cleanliness: number; // 0 to 90
}

// Corresponds to images 0.png (dirtiest) to 9.png (cleanest)
const rockImagePaths = Array.from({ length: 10 }, (_, i) => `/images/rock/${i}.png`);

export const Rock: React.FC<RockProps> = ({ cleanliness }) => {
  const normalizedCleanliness = Math.max(0, Math.min(90, cleanliness));

  const getImageIndex = (cleanlinessValue: number): number => {
    // cleanlinessValue is 0-90. We need to map this to an image index 0-9.
    // 0-9.99 cleanliness -> index 0 (dirtiest)
    // 10-19.99 cleanliness -> index 1
    // ...
    // 80-89.99 cleanliness -> index 8
    // 90 cleanliness -> index 9 (cleanest)
    if (cleanlinessValue >= 90) {
      return 9;
    }
    return Math.floor(cleanlinessValue / 10);
  };

  const imageIndex = getImageIndex(normalizedCleanliness);
  const imageUrl = rockImagePaths[imageIndex];

  const progress = normalizedCleanliness / 90;
  const scaleEffect = 1 + Math.max(0, (progress - 0.75) / 0.25) * 0.05;

  return (
    <div 
      className="w-full h-full relative transition-transform duration-1000"
      style={{ transform: `scale(${scaleEffect})` }}
    >
      <img
        src={imageUrl}
        alt="Habit Rock"
        // Add key to re-trigger animation on image change
        key={imageUrl} 
        className="w-full h-full object-contain drop-shadow-xl animate-float animate-bubble-in"
      />
    </div>
  );
};
