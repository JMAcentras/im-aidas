
import React, { useState, useEffect, useCallback } from 'react';
import { ProfileCard } from './components/ProfileCard';
import { CollectionGrid } from './components/CollectionGrid';
import { SwipeDeck } from './components/SwipeDeck';
import { ThemeSelector } from './components/ThemeSelector';
import { Inbox } from './components/Inbox';
import { Navigation } from './components/Navigation';
import { IntroGame } from './components/IntroGame'; 
import { QuizModal, QuizType } from './components/QuizModal';
import { CreateCardModal } from './components/CreateCardModal'; // New Component
import { RadarMap } from './components/RadarMap'; // New Component
import { Loader } from './components/Loader';
import { generateInterestProfile, generateLiveChatMatch } from './services/geminiService';
import { Profile, SwipeCard, CollectionItem, Conversation, Message, CardType, CardRarity } from './types';

const DEFAULT_THEMES = [
  "Humor", "Tech", "Travel", "Deep Thoughts", "Startups", "Foodie", "Music", "Cinema", "Nature"
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'swipe' | 'inbox' | 'collections' | 'profile' | 'map'>('swipe');
  const [currentTheme, setCurrentTheme] = useState<string>("Humor");
  const [availableThemes, setAvailableThemes] = useState<string[]>(DEFAULT_THEMES);
  
  // Data State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);
  const [showCreateCard, setShowCreateCard] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizType | null>(null);

  // 1. Logic for Intro Game Completion
  const handleGameComplete = useCallback(async (interests: string[]) => {
    if (interests.length === 0) {
      setError('You must select at least one interest to start.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const interestsStr = interests.join(', ');

    try {
      const response = await generateInterestProfile(interestsStr);
      setProfile({
          ...response.profile,
          contributions: [] // Init empty contributions
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  const handleAddTheme = (newTheme: string) => {
    // Prevent duplicates
    if (!availableThemes.includes(newTheme)) {
      setAvailableThemes(prev => [newTheme, ...prev]);
    }
    // Auto-select the new theme
    setCurrentTheme(newTheme);
  };

  const handleCardCollected = (card: SwipeCard) => {
      // 1. Add to Collection
      setCollections(prev => {
          const existingCollectionIndex = prev.findIndex(c => c.theme === card.theme);
          if (existingCollectionIndex > -1) {
              const newCollections = [...prev];
              const col = newCollections[existingCollectionIndex];
              col.cards.push(card);
              col.count = col.cards.length;
              col.level = Math.floor(col.count / 5) + 1;
              return newCollections;
          } else {
              return [...prev, { theme: card.theme, count: 1, cards: [card], level: 1 }];
          }
      });

      // 2. If it's a "Person" card and we "Liked" (right swipe), add to Inbox
      if (card.type === 'person') {
          const newConv: Conversation = {
              id: card.id + Date.now(),
              name: card.content.split(',')[0], 
              avatarChar: card.content.charAt(0),
              lastMessage: "You matched! Say hello.",
              unreadCount: 1,
              messages: []
          };
          setConversations(prev => [newConv, ...prev]);
      }

      // 3. Karma
      if (profile) {
          setProfile({ 
              ...profile, 
              karma: profile.karma + (card.rarity === 'legendary' ? 10 : 2) 
          });
      }
  };

  const handleSendMessage = (conversationId: string, text: string) => {
      setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
              const newMessage: Message = {
                  id: Date.now().toString(),
                  sender: 'me',
                  text: text,
                  timestamp: new Date()
              };
              return {
                  ...c,
                  messages: [...c.messages, newMessage],
                  lastMessage: text,
                  unreadCount: 0
              };
          }
          return c;
      }));
  };

  const handleQuizComplete = (points: number, badge: string) => {
    setProfile(prev => {
        if (!prev) return null;
        const currentBadges = prev.badges || [];
        const updatedBadges = currentBadges.includes(badge) ? currentBadges : [...currentBadges, badge];
        return { 
            ...prev, 
            karma: prev.karma + points,
            badges: updatedBadges
        };
    });
    setActiveQuiz(null);
  };

  // --- NEW FEATURES LOGIC ---

  const handleStartLiveChat = async (theme: string) => {
      if (!profile) return;
      setIsSearchingLive(true);
      
      try {
        const match = await generateLiveChatMatch(theme, profile.karma);
        
        const newConv: Conversation = {
            id: 'live-' + Date.now(),
            name: match.name,
            avatarChar: match.name.charAt(0),
            lastMessage: match.message,
            unreadCount: 1,
            isLive: true,
            themeContext: theme,
            messages: [{
                id: 'first-msg',
                sender: 'them',
                text: match.message,
                timestamp: new Date()
            }]
        };

        setConversations(prev => [newConv, ...prev]);
        setActiveTab('inbox');
      } catch (e) {
        console.error("Live chat failed", e);
      } finally {
        setIsSearchingLive(false);
      }
  };

  const handleCreateCard = (content: string, type: CardType, rarity: CardRarity) => {
      if (!profile) return;

      const newCard: SwipeCard = {
          id: 'custom-' + Date.now(),
          content: content,
          type: type,
          theme: currentTheme,
          rarity: rarity
      };

      setProfile(prev => {
          if(!prev) return null;
          return {
              ...prev,
              karma: prev.karma + 50, // Big karma reward for contributing
              contributions: [newCard, ...(prev.contributions || [])]
          }
      });

      setShowCreateCard(false);
      // Optional: Flash success toast
  };

  // VIEW LOGIC
  
  // 1. Intro Game (If no profile)
  if (!profile && !isLoading) {
    return (
        <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center p-4">
             <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8">InterestMeet</h1>
             <IntroGame onComplete={handleGameComplete} />
             {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
    );
  }

  // 2. Loading State
  if (isLoading) {
      return (
          <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center">
              <Loader />
              <p className="mt-4 text-purple-400 font-bold animate-pulse">Building your personality profile...</p>
          </div>
      )
  }

  // Live Chat Searching Overlay
  if (isSearchingLive) {
     return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-8 text-center">
            <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Loader />
            </div>
            <h2 className="text-2xl font-bold text-white mt-8 mb-2">Scanning Frequency...</h2>
            <p className="text-green-400 font-mono text-sm">Target: Theme "{currentTheme}"</p>
            <p className="text-green-400 font-mono text-sm">Level Match: {Math.floor((profile?.karma || 0) / 10) + 1}</p>
            <p className="text-green-400 font-mono text-sm mt-4">Connecting to verified users...</p>
        </div>
     );
  }

  // 3. Main Dashboard (If profile exists)
  return (
    <div className="fixed inset-0 bg-gray-950 text-white font-sans overflow-hidden flex flex-col">
      {/* Dynamic Main Content Area */}
      <div className="flex-grow overflow-hidden relative pb-16">
        
        {/* VIEW: SWIPE */}
        {activeTab === 'swipe' && profile && (
            <div className="h-full flex flex-col bg-gray-950">
                <ThemeSelector 
                    currentTheme={currentTheme} 
                    onSelect={setCurrentTheme} 
                    onStartLiveChat={handleStartLiveChat}
                    onCreateCard={() => setShowCreateCard(true)}
                    userKarma={profile.karma}
                    availableThemes={availableThemes}
                    onAddTheme={handleAddTheme}
                />
                <div className="flex-grow relative overflow-hidden">
                    <SwipeDeck 
                        theme={currentTheme} 
                        onCollect={handleCardCollected} 
                    />
                </div>
            </div>
        )}

        {/* VIEW: MAP */}
        {activeTab === 'map' && (
            <div className="h-full animate-fade-in bg-gray-950">
                <RadarMap />
            </div>
        )}

        {/* VIEW: COLLECTIONS */}
        {activeTab === 'collections' && (
            <div className="h-full overflow-y-auto p-4 animate-fade-in bg-gray-900">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">My Collections</h2>
                <CollectionGrid collections={collections} />
            </div>
        )}

        {/* VIEW: INBOX */}
        {activeTab === 'inbox' && (
            <div className="h-full animate-fade-in bg-gray-900">
                <Inbox 
                    conversations={conversations} 
                    onSendMessage={handleSendMessage} 
                />
            </div>
        )}

        {/* VIEW: PROFILE */}
        {activeTab === 'profile' && profile && (
            <div className="h-full overflow-y-auto p-4 animate-fade-in bg-gray-900">
                 <h2 className="text-2xl font-bold mb-6 text-white">My Profile</h2>
                 
                 <ProfileCard 
                    profile={profile} 
                    onUpdate={handleProfileUpdate}
                 />
                 
                 {/* Quizzes to fill profile */}
                 <div className="mt-6 bg-gray-800/40 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-4">Level Up Your Profile</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={() => setActiveQuiz('hobbies')}
                            className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700/50 transition-colors"
                        >
                            <span className="text-gray-200">The Adventurer Quiz</span>
                            <span className="text-xs text-orange-400 font-bold">+Badge</span>
                        </button>
                        <button 
                            onClick={() => setActiveQuiz('social')}
                            className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700/50 transition-colors"
                        >
                            <span className="text-gray-200">The Socialite Quiz</span>
                            <span className="text-xs text-orange-400 font-bold">+Badge</span>
                        </button>
                        <button 
                            onClick={() => setActiveQuiz('character')}
                            className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700/50 transition-colors"
                        >
                            <span className="text-gray-200">The Philosopher Quiz</span>
                            <span className="text-xs text-orange-400 font-bold">+Badge</span>
                        </button>
                    </div>
                </div>

                 <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 mb-6">
                     <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Statistics</h3>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-gray-700/50 p-3 rounded-lg">
                             <span className="block text-2xl font-bold text-white">{collections.reduce((acc, c) => acc + c.count, 0)}</span>
                             <span className="text-xs text-gray-400">Cards Collected</span>
                         </div>
                         <div className="bg-gray-700/50 p-3 rounded-lg">
                             <span className="block text-2xl font-bold text-white">{conversations.length}</span>
                             <span className="text-xs text-gray-400">Matches</span>
                         </div>
                     </div>
                 </div>
            </div>
        )}
      </div>

      {/* Navigation Bar */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        unreadCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
      />

      {/* Modals */}
      {activeQuiz && (
        <QuizModal 
          type={activeQuiz}
          onComplete={handleQuizComplete} 
          onClose={() => setActiveQuiz(null)} 
        />
      )}

      {showCreateCard && (
        <CreateCardModal 
          theme={currentTheme}
          onClose={() => setShowCreateCard(false)}
          onSubmit={handleCreateCard}
        />
      )}
    </div>
  );
};

export default App;
