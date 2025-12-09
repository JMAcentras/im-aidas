
import React from 'react';
import { Group } from '../types';
import { UsersIcon } from './icons/UsersIcon';

interface GroupCardProps {
  group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all">
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-purple-500" />
              {group.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{group.description}</p>
          </div>
          <button className="text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors">
            Join
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900/20 p-4 space-y-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Activity</h4>
        {group.posts.map((post, i) => (
          <div key={i} className="bg-gray-800/80 rounded-lg p-3 text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-pink-300">{post.author}</span>
              <span className="text-xs text-gray-500">{post.timeAgo}</span>
            </div>
            <p className="text-gray-300">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
