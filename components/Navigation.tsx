
import React from 'react';
import { FlameIcon } from './icons/FlameIcon';
import { UsersIcon } from './icons/UsersIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MapIcon } from './icons/MapIcon';

interface NavigationProps {
  activeTab: 'swipe' | 'inbox' | 'collections' | 'profile' | 'map';
  onTabChange: (tab: 'swipe' | 'inbox' | 'collections' | 'profile' | 'map') => void;
  unreadCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, unreadCount }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button 
          onClick={() => onTabChange('swipe')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'swipe' ? 'text-purple-500' : 'text-gray-500'}`}
        >
          <FlameIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">Swipe</span>
        </button>

        <button 
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'map' ? 'text-green-500' : 'text-gray-500'}`}
        >
          <MapIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">Radar</span>
        </button>

        <button 
          onClick={() => onTabChange('collections')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'collections' ? 'text-purple-500' : 'text-gray-500'}`}
        >
          <SparklesIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">Collect</span>
        </button>

        <button 
          onClick={() => onTabChange('inbox')}
          className={`relative flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'inbox' ? 'text-purple-500' : 'text-gray-500'}`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-gray-900"></span>
            )}
          </div>
          <span className="text-[10px] font-medium">Inbox</span>
        </button>

        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'profile' ? 'text-purple-500' : 'text-gray-500'}`}
        >
          <UsersIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};
