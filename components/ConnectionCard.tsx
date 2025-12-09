
import React from 'react';
import { Connection } from '../types';
import { HashtagIcon } from './icons/HashtagIcon';

interface ConnectionCardProps {
  connection: Connection;
  onClick?: () => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-5 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/20 ${onClick ? 'cursor-pointer hover:bg-gray-800/80' : ''}`}
    >
      <h3 className="text-xl font-bold text-purple-300">{connection.name}</h3>
      <p className="text-gray-400 mt-2 flex-grow line-clamp-3">{connection.bio}</p>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Shared Interests</h4>
        <div className="flex flex-wrap gap-2">
          {connection.sharedInterests.map((interest, index) => (
            <span key={index} className="flex items-center bg-purple-900/50 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">
              <HashtagIcon className="w-3 h-3 mr-1" />
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
