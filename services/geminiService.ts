
import { GoogleGenAI, Type } from '@google/genai';
import { GeminiResponse, Connection, SwipeCard } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

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

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      profile: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          summary: { type: Type.STRING },
          lookingFor: { type: Type.STRING },
          offering: { type: Type.STRING },
          interests: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Extract 5-7 short keyword tags from the user's interests."
          }
        },
        required: ['name', 'summary', 'lookingFor', 'offering', 'interests']
      },
      connections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            bio: { type: Type.STRING },
            sharedInterests: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['name', 'bio', 'sharedInterests']
        }
      },
      groups: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            posts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  author: { type: Type.STRING },
                  content: { type: Type.STRING },
                  timeAgo: { type: Type.STRING }
                },
                required: ['author', 'content', 'timeAgo']
              }
            }
          },
          required: ['name', 'description', 'posts']
        }
      }
    },
    required: ['profile', 'connections', 'groups']
  };

  try {
    const result = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = result.text.trim();
    const cleanedJsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const parsedData = JSON.parse(cleanedJsonText);
    
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
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      bio: { type: Type.STRING },
      sharedInterests: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['name', 'bio', 'sharedInterests']
  };

  const result = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 1.0,
    },
  });

   const cleanedJsonText = result.text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
   return JSON.parse(cleanedJsonText);
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

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['person', 'quote', 'fact', 'joke'] },
        content: { type: Type.STRING },
        subContent: { type: Type.STRING },
        theme: { type: Type.STRING },
        rarity: { type: Type.STRING, enum: ['common', 'rare', 'legendary'] }
      },
      required: ['id', 'type', 'content', 'theme', 'rarity']
    }
  };

  const result = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 1.1,
    },
  });

  const cleanedJsonText = result.text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
  return JSON.parse(cleanedJsonText);
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

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      message: { type: Type.STRING }
    },
    required: ['name', 'message']
  };

  const result = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 1.0,
    },
  });

  const cleanedJsonText = result.text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
  return JSON.parse(cleanedJsonText);
}
