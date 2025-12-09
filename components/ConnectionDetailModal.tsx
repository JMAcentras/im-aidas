
import React from 'react';
import { Connection } from '../types';
import { HashtagIcon } from './icons/HashtagIcon';

interface ConnectionDetailModalProps {
  connection: Connection;
  onClose: () => void;
}

export const ConnectionDetailModal: React.FC<ConnectionDetailModalProps> = ({ connection, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-gray-800 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="h-32 bg-gradient-to-r from-purple-900 to-indigo-900"></div>
        <div className="px-8 pb-8">
            <div className="-mt-12 mb-4">
                 <div className="w-24 h-24 rounded-full bg-gray-900 border-4 border-gray-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-purple-500">{connection.name.charAt(0)}</span>
                 </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-1">{connection.name}</h2>
            <p className="text-purple-400 text-sm font-medium mb-6">Potential Match</p>

            <div className="space-y-6">
                <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">About</h3>
                    <p className="text-gray-300 leading-relaxed bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                        {connection.bio}
                        <br/><br/>
                        <span className="text-gray-500 text-sm italic">"I'm really excited to meet new people who share my passion for these topics. Feel free to reach out!"</span>
                    </p>
                </div>

                <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Shared Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {connection.sharedInterests.map((interest, i) => (
                            <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-purple-900/20 text-purple-300 rounded-lg text-sm border border-purple-500/20">
                                <HashtagIcon className="w-3.5 h-3.5" /> {interest}
                            </span>
                        ))}
                    </div>
                </div>

                <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Start Conversation
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
