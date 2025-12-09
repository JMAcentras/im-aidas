
import Groq from 'groq-sdk';
import { GeminiResponse, Connection, SwipeCard } from '../types';

// Groq key is embedded because this runs fully in the browser.
const GROQ_API_KEY = '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';
// Using Groq-hosted OpenAI GPT OSS 120B (largest OpenAI-branded option available).
const modelName = 'openai/gpt-oss-120b';
const groq = new Groq({ apiKey: GROQ_API_KEY });

function parseJsonContent(content: string) {
  const cleaned = (content ?? '').trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  return JSON.parse(cleaned);
}

async function createJsonCompletion(prompt: string, temperature = 0.8, forceObject = false) {
  const completion = await groq.chat.completions.create({
    model: modelName,
    messages: [{ role: 'user', content: prompt }],
    temperature,
    ...(forceObject ? { response_format: { type: 'json_object' } } : {}),
  });

  const message = completion.choices[0]?.message?.content || '';
  return parseJsonContent(message);
}

export async function generateInterestProfile(interests: string, currentProfileContext?: string): Promise<GeminiResponse> {
  const prompt = `
    User Context/Interests: "${interests}"
    ${currentProfileContext ? `Additional User Request/Edit: "${currentProfileContext}"` : ''}

    Task:
    1. Generate/Update a creative anonymous public handle (nickname).
    2. Write/Update a fun profile summary (2-3 sentences).
    3. Write a "Looking For" statement (e.g., "Looking for hiking buddies" or "Seeking tech co-founders").
    4. Write an "Offering" statement (e.g., "I offer great travel tips", "I bring snacks to every meeting", "I can teach you Python").
    5. Create 3 fictional user personas (connections) who match these interests.
    6. Create 3 fictional community groups relevant to these interests.

    Return the response in a structured JSON format.
  `;

  try {
    const parsedData = await createJsonCompletion(prompt, 0.8, true);

    return {
      profile: {
        ...parsedData.profile,
        karma: 30, // Default starting karma
      },
      connections: parsedData.connections,
      groups: parsedData.groups
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate profile.");
  }
}

export async function generateRandomConnection(interests: string): Promise<Connection> {
  const prompt = `Based on these interests: "${interests}", generate ONE unique, random fictional user persona that would be an interesting match. JSON format.`;

  const parsed = await createJsonCompletion(prompt, 1.0, true);
  return parsed as Connection;
}

export async function generateSwipeDeck(theme: string): Promise<SwipeCard[]> {
  const prompt = `
    Target Theme: "${theme}".
    Task: Generate 6 "Collectible Cards" for a swipe deck centered around this theme.
    
    Mix different types:
    - 'person': A fictional person who is deeply into this theme.
    - 'quote': A famous or funny quote about this theme.
    - 'fact': A surprising fact about this theme.
    - 'joke': A joke about this theme.

    Assign the 'theme' field as "${theme}".
    Assign a 'rarity' (common, rare, legendary) randomly.
    
    Content should be engaging, short, and formatted for a mobile card.
  `;

  const parsed = await createJsonCompletion(prompt, 1.1, false);
  return parsed as SwipeCard[];
}

export async function generateLiveChatMatch(theme: string, userKarma: number): Promise<{ name: string, message: string }> {
  // Simulate finding someone with similar karma
  const karmaVariance = Math.floor(Math.random() * 5);
  const matchKarma = userKarma + (Math.random() > 0.5 ? karmaVariance : -karmaVariance);

  const prompt = `
    Generate a short introductory message from a fictional user who is "Online" right now in a chat app.
    Theme of the chat room: "${theme}".
    The user's Karma level is ${matchKarma} (which is very close to the current user's level of ${userKarma}).
    
    Task:
    1. Create a username.
    2. Write a 1-sentence opening message related to ${theme}.
    
    Return JSON.
  `;

  const parsed = await createJsonCompletion(prompt, 1.0, true);
  return parsed as { name: string; message: string };
}
