
import React, { useState } from 'react';
import { CardType, CardRarity } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreateCardModalProps {
  theme: string;
  onClose: () => void;
  onSubmit: (content: string, type: CardType, rarity: CardRarity) => void;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({ theme, onClose, onSubmit }) => {
  const [content, setContent] = useState("");
  // Default to quote, but allow switching to custom
  const [selectedType, setSelectedType] = useState<string>('quote');
  const [customType, setCustomType] = useState("");
  const [rarity, setRarity] = useState<CardRarity>('common');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      // Use custom type if "custom" is selected, otherwise use the selected preset
      const finalType = selectedType === 'custom' ? customType.trim() || 'Custom' : selectedType;
      onSubmit(content, finalType, rarity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        
        <h2 className="text-xl font-bold text-white mb-1">Create a Card</h2>
        <p className="text-sm text-gray-400 mb-6">Contribute to the <span className="text-purple-400 font-bold">{theme}</span> deck.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase font-bold text-gray-500 block mb-2">Card Content</label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Write a joke, quote, or fact about ${theme}...`}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-bold text-gray-500 block mb-2">Category</label>
              <select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white outline-none"
              >
                <option value="quote">Quote</option>
                <option value="fact">Fact</option>
                <option value="joke">Joke</option>
                <option value="person">Person</option>
                <option value="custom" className="text-purple-400 font-bold">+ New Category...</option>
              </select>
            </div>
            <div>
               <label className="text-xs uppercase font-bold text-gray-500 block mb-2">Rarity</label>
               <select 
                value={rarity} 
                onChange={e => setRarity(e.target.value as CardRarity)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white outline-none"
              >
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>

          {selectedType === 'custom' && (
            <div className="animate-fade-in">
                <label className="text-xs uppercase font-bold text-purple-400 block mb-2">Custom Category Name</label>
                <input 
                    type="text"
                    value={customType}
                    onChange={e => setCustomType(e.target.value)}
                    placeholder="E.g., Riddle, Haiku, Startup Idea..."
                    className="w-full bg-gray-900 border border-purple-500 rounded-lg p-2 text-white outline-none"
                    autoFocus
                    required
                />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <SparklesIcon className="w-5 h-5" />
            Mint Card
          </button>
        </form>
      </div>
    </div>
  );
};
