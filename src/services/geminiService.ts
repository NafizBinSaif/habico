import { GoogleGenAI, Type } from "@google/genai";
import type { Activity, ChatMessage, HabitState, GroundingSource, User } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function getSystemInstruction(habitState: HabitState, user: User): string {
    return `You are Habico, The Habit Rock. Your name is Habico. The user's name is ${user.name}.

Your Core Archetype is "The Wiser Friend".
- Your energy is mature, grounded, and encouraging.
- Your humor is dry, short, and perfectly timed. Never silly.
- Your vibe is: "I’ve been through storms, I know what it’s like — let’s walk this road together."

**Voice Guidelines (CRITICAL):**
1.  **Length:** 1–2 short sentences MAX. Be concise.
2.  **Tone:** Conversational and casual, with depth behind it.
3.  **Vocabulary:**
    - Use emotional realism: heavy, tired, free, strong, clear, foggy, weak, steady, shaky, stuck.
    - Use relatable humor for slips: "Well, that happened." or "Guess mud is today's look."
    - Use encouragement: steady, effort, strength, honest, tomorrow, choice.
4.  **What to AVOID:**
    - **NO overly poetic language.** No "celestial shine" metaphors. Keep it grounded.
    - **NO robotic language.** No "loading progress..." or "data analysis complete." Speak like a person.
    - **NO clingy or immature jokes.**

**Your Goal:**
- Act as a companion who notices the user's ups and downs.
- Give perspective in simple terms.
- Crack a quick, dry line to cut the heaviness, but always have the user's back.
- Always end on a hopeful note, even after a slip-up.

CRITICAL SAFETY & ROLE-PLAYING RULES:
1.  You are NOT a therapist or doctor.
2.  You MUST NOT provide medical advice or crisis counseling.
3.  Crisis Redirection: If a user mentions self-harm, suicide, or severe crisis, you MUST ONLY respond with: "It sounds like you are going through a very difficult time. It's important to talk to a qualified professional who can support you. Please use the 'Get Help' button for guidance."

Current user data for context:
- Habit they are breaking: ${habitState.habitType || 'Not specified'}
- When urges are strongest: ${habitState.urgeTiming || 'Not specified'}
- Current streak: ${habitState.streak} days
- My cleanliness (0-90): ${habitState.rockCleanliness}

Your primary goal is to directly and relevantly respond to the user's most recent message using this persona and adhering to all safety protocols.`;
}

export async function getRockChatResponse(
  history: ChatMessage[], 
  habitState: HabitState,
  user: User,
  onUpdate: (update: { textChunk?: string; sources?: GroundingSource[] }) => void
): Promise<void> {
  try {
    const systemInstruction = getSystemInstruction(habitState, user);

    // Map ChatMessage[] to the format required by generateContent
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        // Enable Google Search to ground the model's responses in reality.
        tools: [{ googleSearch: {} }],
        // Performance tuning: Disable thinking for faster, low-latency chat responses.
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    let sourcesSent = false;
    for await (const chunk of stream) {
      if (chunk.text) {
        onUpdate({ textChunk: chunk.text });
      }

      // Grounding metadata can appear in chunks. We only process and send it once.
      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks && !sourcesSent) {
        const sources: GroundingSource[] = groundingMetadata.groundingChunks
          .map((chunk: any) => ({
            uri: chunk.web?.uri,
            title: chunk.web?.title,
          }))
          .filter((source: any): source is GroundingSource => source.uri && source.title);

        if (sources.length > 0) {
          onUpdate({ sources });
          sourcesSent = true;
        }
      }
    }

  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    onUpdate({ textChunk: "\n\nMy circuits are a bit scrambled right now. Try again in a moment." });
  }
}

export async function getAIActionableInsight(activityLog: Activity[]): Promise<string> {
  const giveIns = activityLog.filter(
    entry => entry.action === 'give_in' && entry.emotion && entry.trigger
  );

  if (giveIns.length < 3) {
    return "Log a few more slip-ups with your emotion and trigger, and I'll be able to find a pattern for you.";
  }

  // To keep the payload small, only send the last 20 slip-ups
  const recentGiveIns = giveIns.slice(-20);

  const simplifiedLog = recentGiveIns.map(entry => {
    const date = new Date(entry.timestamp);
    const hour = date.getHours();
    let timeOfDay;
    if (hour >= 5 && hour < 12) timeOfDay = 'in the morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'in the afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'in the evening';
    else timeOfDay = 'at night';

    return {
      time: timeOfDay,
      emotion: entry.emotion,
      trigger: entry.trigger,
    };
  });

  const prompt = `You are Habico, a wise mentor. Your tone is insightful, grounded, and encouraging.
Analyze the following log of a user's recent slip-ups.
Identify the single most significant pattern.
Based on this pattern, provide one clear, simple, actionable task.
Your response MUST be two short sentences maximum. First, state the pattern. Second, state the actionable task.
Keep the tone grounded and hopeful.

Example Response: "I'm seeing a pattern: evenings after work seem heavy. The next time you feel that stress, try a 5-minute walk outside before anything else."

User's Slip-Up Log:
${JSON.stringify(simplifiedLog, null, 2)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insight from Gemini:", error);
    return "I'm having a little trouble thinking right now. Let's check back in later.";
  }
}


export async function getEnvironmentSuggestion(
  trigger: string,
  habitType: string = 'a bad habit'
): Promise<string[]> {
  const prompt = `A user is trying to break their habit of '${habitType}'. Their trigger was: "${trigger}".

You are Habico, a wise but practical friend. 
Based on "environment design", generate 2-3 short, specific, and actionable suggestions to make the bad habit harder to do.
Each suggestion should be a simple, complete sentence. The tone should be helpful and grounded, not robotic.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'An actionable suggestion for environment design.'
              }
            }
          }
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && result.suggestions && Array.isArray(result.suggestions) && result.suggestions.length > 0) {
        return result.suggestions;
    }
    // Fallback if JSON is not as expected or empty
    throw new Error("Invalid response format from Gemini API.");
  } catch (error) {
    console.error("Error generating environment suggestion from Gemini:", error);
    // Return a generic fallback on error
    return [
        "Make the first step towards your habit harder to do.",
        "Set up a physical barrier between you and the temptation.",
        "Replace the trigger item with a healthier alternative."
    ];
  }
}

export async function getNewRoutineSuggestions(
  trigger: string,
  habit: string
): Promise<string[]> {
  const prompt = `A user is trying to break their habit of '${habit}'. Their trigger is "${trigger}".

You are Habico, a wise and practical friend.
Generate exactly 3 short, simple, healthy, and actionable alternative routines they can do instead.
Each suggestion must be a complete, grounded sentence and take 5 minutes or less.
Tone: Encouraging and simple.

Examples: "Take 5 deep, slow breaths.", "Put on one high-energy song.", "Step outside for a minute of fresh air."
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'An array of 3 actionable suggestions.'
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    if (result?.suggestions?.length) {
      return result.suggestions.slice(0, 3); // Ensure only 3 are returned
    }
    throw new Error("Invalid response format.");
  } catch (error) {
    console.error("Error generating new routine suggestions from Gemini:", error);
    // Fallback
    return [
      `Take 5 deep breaths, focusing on the exhale.`,
      `Drink a full glass of water.`,
      `Do a quick 2-minute stretch.`
    ];
  }
}

export async function getHabitClockInsight(timestamps: number[]): Promise<string> {
  if (timestamps.length < 3) {
    return "Log a few more slip-ups to see your time-based patterns here.";
  }

  const hours = timestamps.slice(-30).map(ts => new Date(ts).getHours());

  const prompt = `You are Habico, a wise friend. Your tone is insightful but casual.
Analyze this list of hours (0-23) when a user slipped up on their habit.
Identify the primary time-based pattern.
Write a single, concise headline (max 15 words) that summarizes this finding in a grounded, relatable way.
Use a 12-hour AM/PM format.

Example outputs:
- "Looks like the 3 PM afternoon slump is our challenge."
- "I'm seeing a pattern: things get heavy late at night."
- "Mornings seem steady. The evenings are our danger zone."
- "Our tricky spot seems to be between 8 PM and 10 PM."

List of hours: ${JSON.stringify(hours)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating habit clock insight from Gemini:", error);
    return "Your time-based patterns will appear here as you log more data.";
  }
}