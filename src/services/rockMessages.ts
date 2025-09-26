// resistMessages: Grounded celebration of effort.
const resistMessages = {
  dirty: (habitType?: string) => [
    "Good. That's one honest step.",
    "Effort. That's what I felt just now.",
    "A small choice, a big difference. Keep going.",
    `Nice. You chose strength over the urge.`,
  ],
  cleaning: (habitType?: string) => [
    "Alright, that feels lighter. We're getting somewhere.",
    "Keep this up. I'm starting to feel steady.",
    "Now we're talking. That felt clear.",
    "You're building something real. I can feel it.",
  ],
  shiny: (habitType?: string) => [
    "Look at that. That's the result of honest work.",
    "This is what strength looks like. Well done.",
    `We're making real progress. This feels different.`,
    "This feels free. Thank you.",
  ],
};

// giveInMessages: Dry, relatable humor to cut the heaviness, but always hopeful.
const giveInMessages = {
  streakBroken: (habitType?: string, urgeTiming?: string) => [
    "Well, that happened. The streak is gone, but we're not.",
    "A stumble. It’s part of the road. Let's get up.",
    "Not perfect, but not quitting. That's what matters. Tomorrow.",
    "Guess mud is today's look. It's okay, it washes off.",
  ],
  other: (habitType?: string, urgeTiming?: string) => [
    "Okay, a slip. Let's be honest about it and move on.",
    "Another one for the books. What did we learn?",
    `The ${urgeTiming?.toLowerCase() || 'usual time'} got us. Good to know.`,
    "No judgment. Just data. Let's use it.",
  ],
};

// ambientMessages: "Wiser Friend" mode - short, calm, insightful.
export const ambientMessages = [
  "Today might feel heavy. That's okay.",
  "Steady now. Just this moment.",
  "A stumble is not a fall. The path is still here.",
  "Feel that? The quiet effort. It's working.",
  "This is a choice. You're making it right now.",
  "The urge feels big, but it's temporary. You're not.",
  "Clarity comes from small, honest steps.",
  "I'm with you. We can carry this together.",
  "Just breathe. The feeling will pass.",
  "You're stronger than you were yesterday. Feel it."
];

export const getAmbientRockMessage = (): string => {
  return ambientMessages[Math.floor(Math.random() * ambientMessages.length)];
};


export const getPreMadeRockMessage = (
  action: 'resist' | 'give_in',
  cleanliness: number,
  wasStreakBroken: boolean,
  habitType?: string,
  urgeTiming?: string
): string => {
  let category: 'dirty' | 'cleaning' | 'shiny';
  if (cleanliness < 30) {
    category = 'dirty';
  } else if (cleanliness < 60) {
    category = 'cleaning';
  } else {
    category = 'shiny';
  }

  if (action === 'resist') {
    const messages = resistMessages[category](habitType);
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = wasStreakBroken
      ? giveInMessages.streakBroken(habitType, urgeTiming)
      : giveInMessages.other(habitType, urgeTiming);
    return messages[Math.floor(Math.random() * messages.length)];
  }
};