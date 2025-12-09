
export interface Profile {
  name: string;
  summary: string; // Short tagline
  aboutMe?: string; // Longer description
  lookingFor: string;
  offering: string; // New field: What the user brings to the table
  karma: number;
  interests: string[];
  badges?: string[];
  contributions?: SwipeCard[]; // Cards created by the user
}

export interface Connection {
  name: string;
  bio: string;
  sharedInterests: string[];
}

export interface Post {
  author: string;
  content: string;
  timeAgo: string;
}

export interface Group {
  name: string;
  description: string;
  posts: Post[];
}

export type CardRarity = 'common' | 'rare' | 'legendary';
// Update: CardType can now be a custom string
export type CardType = 'person' | 'quote' | 'joke' | 'fact' | string;

export interface SwipeCard {
  id: string;
  type: CardType;
  content: string; // The main text/bio
  subContent?: string; // Tagline or extra info
  theme: string; // e.g., "Tech", "Philosophy", "Humor"
  rarity: CardRarity;
  color?: string; // Visual hint
}

export interface CollectionItem {
  theme: string;
  count: number;
  cards: SwipeCard[];
  level: number;
}

export interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  name: string; // The person you are talking to
  avatarChar: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
  isLive?: boolean; // Context for live chat
  themeContext?: string;
}

export interface GeminiResponse {
  profile: Profile;
  connections: Connection[];
  groups: Group[];
}
