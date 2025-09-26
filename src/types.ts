export interface User {
  name: string;
  email: string;
  plan?: 'free' | 'monthly' | 'lifetime';
}

export interface Activity {
  timestamp: number;
  action: 'resist' | 'give_in';
  emotion?: string;
  trigger?: string;
}

export interface AiInsight {
  text: string;
  generatedAt: number | null;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: GroundingSource[];
}

export interface ChatCount {
  daily: number;
  monthly: number;
  lastChatDate: string; // YYYY-MM-DD
}

export interface HabitState {
  day: number;
  streak: number;
  bestStreak: number;
  rockCleanliness: number;
  lastUpdate: number | null;
  activityLog: Activity[];
  aiInsight: AiInsight;
  giveInsSinceLastInsight: number;
  habitType?: string;
  urgeTiming?: string;
  chatHistory: ChatMessage[];
  chatCount: ChatCount;
}