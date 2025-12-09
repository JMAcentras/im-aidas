
import React, { useState } from 'react';
import { HashtagIcon } from './icons/HashtagIcon';
import { UsersIcon } from './icons/UsersIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ThemeSelectorProps {
  currentTheme: string;
  onSelect: (theme: string) => void;
  onStartLiveChat: (theme: string) => void;
  onCreateCard: (theme: string) => void;
  userKarma: number;
  availableThemes: string[];
  onAddTheme: (theme: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onSelect, 
  onStartLiveChat, 
  onCreateCard,
  userKarma,
  availableThemes,
  onAddTheme
}) => {
  const [customTheme, setCustomTheme] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTheme.trim()) {
      const newTheme = customTheme.trim();
      onAddTheme(newTheme);
      setCustomTheme("");
    }
  };

  const userLevel = Math.floor(userKarma / 10) + 1;

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40 shadow-xl">
       
       {/* Search / Add Theme */}
       <form onSubmit={handleSearch} className="mb-4 relative">
         <input 
            type="text" 
            value={customTheme}
            onChange={(e) => setCustomTheme(e.target.value)}
            placeholder="Search or Create a Theme (e.g., 'Retro Gaming')"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
         />
         <button type="submit" className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-500 text-white px-3 rounded-lg flex items-center justify-center transition-colors">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
         </button>
       </form>

       {/* Actions for Current Theme */}
       <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
         <button 
           onClick={() => onStartLiveChat(currentTheme)}
           className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white text-xs font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-transform"
         >
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
           </span>
           Live Chat (Lvl {userLevel})
         </button>
         
         <button 
           onClick={() => onCreateCard(currentTheme)}
           className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-lg text-white text-xs font-bold active:scale-95 transition-all"
         >
           <SparklesIcon className="w-4 h-4 text-yellow-400" />
           Add Card to {currentTheme}
         </button>
       </div>

       {/* Horizontal Scroll List */}
       <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {availableThemes.map(theme => (
           <button
             key={theme}
             onClick={() => onSelect(theme)}
             className={`
                whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-all border
                ${currentTheme === theme 
                    ? 'bg-white text-black border-white shadow-md' 
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'}
             `}
           >
             {theme}
           </button>
         ))}
       </div>
    </div>
  );
};
