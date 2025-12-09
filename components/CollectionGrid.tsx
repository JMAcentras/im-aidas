
import React from 'react';
import { CollectionItem, SwipeCard } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface CollectionGridProps {
  collections: CollectionItem[];
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({ collections }) => {
  if (collections.length === 0) {
      return (
          <div className="bg-gray-800/40 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-2">Your collection is empty.</p>
              <p className="text-xs text-gray-500">Use the Swipe Deck to find unique cards.</p>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      {collections.map((col, idx) => (
        <div key={idx} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {col.theme}
                    <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Lvl {col.level}</span>
                </h3>
                <div className="w-32 h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${(col.cards.length % 5) * 20}%` }}></div>
                </div>
            </div>
            <span className="text-sm text-gray-400 font-mono">{col.cards.length} cards</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {col.cards.map((card, cIdx) => (
              <div 
                key={cIdx} 
                className={`relative p-3 rounded-lg border min-h-[100px] flex flex-col justify-between transition-transform hover:scale-105 cursor-pointer
                    ${card.rarity === 'legendary' ? 'bg-yellow-900/20 border-yellow-500/50' : 
                      card.rarity === 'rare' ? 'bg-indigo-900/20 border-indigo-500/50' : 
                      'bg-gray-700/30 border-gray-600'}
                `}
              >
                 {card.rarity === 'legendary' && <SparklesIcon className="absolute top-1 right-1 w-3 h-3 text-yellow-400" />}
                 <p className="text-xs font-medium text-gray-200 line-clamp-3 leading-snug">
                     {card.content}
                 </p>
                 <span className="text-[10px] text-gray-500 uppercase mt-2">{card.type}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
