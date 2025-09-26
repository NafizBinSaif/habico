
export type UrgeTiming = 'Morning' | 'Afternoon' | 'Evening / Night' | 'All Day';

// Morning: 5am - 11:59am
// Afternoon: 12pm - 4:59pm
// Evening / Night: 5pm - 4:59am
export const analyzeUrgeTimings = (timestamps: number[]): UrgeTiming | null => {
  const MIN_SAMPLES = 5;
  if (timestamps.length < MIN_SAMPLES) {
    return null;
  }

  const counts = {
    'Morning': 0,
    'Afternoon': 0,
    'Evening / Night': 0,
  };

  timestamps.forEach(ts => {
    const hour = new Date(ts).getHours();
    if (hour >= 5 && hour < 12) {
      counts['Morning']++;
    } else if (hour >= 12 && hour < 17) {
      counts['Afternoon']++;
    } else {
      counts['Evening / Night']++;
    }
  });

  const sortedCounts = Object.entries(counts).sort(([, a], [, b]) => b - a);
  
  const [dominantPeriod, dominantCount] = sortedCounts[0];
  const [secondPeriod, secondCount] = sortedCounts[1];

  // Threshold logic: The dominant period must be significantly more frequent.
  // e.g., at least 1.5 times more frequent than the second most common period.
  // And must account for at least 40% of all slip-ups.
  const DOMINANCE_RATIO = 1.5;
  const MINIMUM_PERCENTAGE = 0.4;
  
  if (dominantCount > (secondCount || 0) * DOMINANCE_RATIO && dominantCount / timestamps.length >= MINIMUM_PERCENTAGE) {
    return dominantPeriod as UrgeTiming;
  }
  
  // If no single period is dominant, check if it's spread out
  const totalCounted = counts.Morning + counts.Afternoon + counts['Evening / Night'];
  if (counts.Morning > 0 && counts.Afternoon > 0 && counts['Evening / Night'] > 0) {
      // Check if they are somewhat evenly distributed
      const avg = totalCounted / 3;
      const isEvenlyDistributed = Object.values(counts).every(count => count > avg * 0.5);
      if (isEvenlyDistributed) {
          return 'All Day';
      }
  }

  return null; // No clear pattern found
};
