
import React, { useState, useEffect, useRef } from 'react';
import { SwipeCard } from '../types';
import { generateSwipeDeck } from '../services/geminiService';
import { Loader } from './Loader';
import { SparklesIcon } from './icons/SparklesIcon';
import { FlameIcon } from './icons/FlameIcon';

interface SwipeDeckProps {
  theme: string;
  onCollect: (card: SwipeCard) => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ theme, onCollect }) => {
  const [cards, setCards] = useState<SwipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Swipe State
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Initial Load & Theme Change
  useEffect(() => {
    setCards([]);
    setCurrentIndex(0);
    setLoading(true);
    fetchDeck(theme);
  }, [theme]);

  const fetchDeck = async (themeName: string) => {
    try {
      const newCards = await generateSwipeDeck(themeName);
      setCards(prev => [...prev, ...newCards]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Refill Logic
  useEffect(() => {
    if (!loading && cards.length > 0 && (cards.length - currentIndex) < 3) {
      // Silently fetch more
      fetchDeck(theme);
    }
  }, [currentIndex, cards.length, loading, theme]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 100;

    if (dragOffset.x > threshold) {
      completeSwipe('right');
    } else if (dragOffset.x < -threshold) {
      completeSwipe('left');
    } else if (dragOffset.y < -threshold) {
        completeSwipe('up');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const completeSwipe = (direction: 'left' | 'right' | 'up') => {
    const currentCard = cards[currentIndex];
    
    // Logic based on direction
    if (direction === 'right') {
        onCollect(currentCard);
    } else if (direction === 'up') {
        // Up is "Love"
        onCollect({...currentCard, rarity: 'legendary'});
    }

    setDragOffset({ x: direction === 'right' ? 500 : direction === 'left' ? -500 : 0, y: direction === 'up' ? -500 : 0 });
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const currentCard = cards[currentIndex];

  // Loading Initial State
  if (loading && cards.length === 0) {
      return (
         <div className="h-full flex flex-col items-center justify-center p-8">
            <Loader />
            <p className="mt-4 text-purple-400 font-bold animate-pulse">Generating "{theme}" Cards...</p>
         </div>
      );
  }

  if (!currentCard) {
      return (
         <div className="h-full flex flex-col items-center justify-center p-8 text-center">
             <p className="text-gray-400">Out of cards. Fetching more...</p>
         </div>
      );
  }

  // Calculate rotation based on drag
  const rotation = dragOffset.x * 0.05;

  // Card Style
  const getCardStyle = (card: SwipeCard) => {
      const baseStyle = "absolute inset-0 rounded-3xl p-6 flex flex-col justify-between shadow-2xl border-4 select-none";
      switch(card.rarity) {
          case 'legendary': return `${baseStyle} bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-900 border-yellow-500/50`;
          case 'rare': return `${baseStyle} bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 border-purple-500/50`;
          default: return `${baseStyle} bg-gray-800 border-gray-700`;
      }
  };

  return (
    <div className="relative w-full h-full max-w-sm mx-auto flex flex-col justify-center items-center py-4">
        
        {/* Swipe Guides */}
        {isDragging && (
            <>
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 transition-opacity duration-200 ${dragOffset.x < -50 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-red-500/20 border-2 border-red-500 text-red-500 font-bold text-2xl rounded-full w-20 h-20 flex items-center justify-center transform -rotate-12">
                        NOPE
                    </div>
                </div>
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-20 transition-opacity duration-200 ${dragOffset.x > 50 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-green-500/20 border-2 border-green-500 text-green-500 font-bold text-2xl rounded-full w-20 h-20 flex items-center justify-center transform rotate-12">
                        LIKE
                    </div>
                </div>
            </>
        )}

        <div className="relative w-full aspect-[3/4] perspective-1000">
            {/* Background Card (Next) */}
            {cards[currentIndex + 1] && (
                <div 
                    className={`${getCardStyle(cards[currentIndex + 1])} scale-95 opacity-50 translate-y-4`} 
                    style={{ zIndex: 0 }}
                >
                </div>
            )}

            {/* Active Card */}
            <div 
                ref={cardRef}
                className={`${getCardStyle(currentCard)} cursor-grab active:cursor-grabbing`}
                style={{
                    zIndex: 10,
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                    {/* Card Content */}
                    <div className="w-full">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/10">
                            {currentCard.theme}
                        </span>
                        {currentCard.rarity === 'legendary' && <SparklesIcon className="w-6 h-6 text-yellow-400 animate-pulse" />}
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-white leading-tight drop-shadow-lg mt-4">
                        {currentCard.content}
                    </h2>
                    </div>

                    <div className="w-full space-y-4">
                    {currentCard.subContent && (
                        <p className="text-white/80 text-lg font-medium italic border-l-4 border-white/30 pl-3">
                            "{currentCard.subContent}"
                        </p>
                    )}
                    
                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                        <div className="text-xs font-bold text-white/50 uppercase">
                            {currentCard.type}
                        </div>
                        <div className="flex gap-2">
                             {currentCard.type === 'person' && <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Matches to Inbox</span>}
                        </div>
                    </div>
                    </div>
            </div>
        </div>

        {/* Controls */}
        <div className="flex gap-8 mt-8 z-10">
            <button onClick={() => completeSwipe('left')} className="p-4 rounded-full bg-gray-800 text-red-500 border border-red-500/30 hover:bg-red-500/20 transition-all transform hover:scale-110 shadow-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button onClick={() => completeSwipe('up')} className="p-4 rounded-full bg-gray-800 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all transform hover:scale-110 shadow-lg">
                <FlameIcon className="w-8 h-8" />
            </button>
            <button onClick={() => completeSwipe('right')} className="p-4 rounded-full bg-gray-800 text-green-500 border border-green-500/30 hover:bg-green-500/20 transition-all transform hover:scale-110 shadow-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" /></svg>
            </button>
        </div>
    </div>
  );
};
