
import React, { useState } from 'react';
import { Conversation, Message } from '../types';

interface InboxProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => void;
}

export const Inbox: React.FC<InboxProps> = ({ conversations, onSendMessage }) => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeConversationId && inputText.trim()) {
      onSendMessage(activeConversationId, inputText);
      setInputText("");
    }
  };

  if (activeConversation) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <button onClick={() => setActiveConversationId(null)} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center text-white font-bold">
            {activeConversation.avatarChar}
          </div>
          <div>
            <h3 className="text-white font-bold">{activeConversation.name}</h3>
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {activeConversation.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                msg.sender === 'me' 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-800 bg-gray-900">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button type="submit" className="p-2 bg-purple-600 rounded-full text-white hover:bg-purple-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Inbox</h2>
      </div>
      
      {conversations.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
          <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <p>No matches yet.</p>
          <p className="text-sm">Swipe right on people to match!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-800">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              onClick={() => setActiveConversationId(conv.id)}
              className="p-4 flex gap-4 hover:bg-gray-800/50 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-lg font-bold text-white">
                {conv.avatarChar}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-200 truncate">{conv.name}</h3>
                  <span className="text-xs text-gray-500">Now</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <div className="w-2 h-2 bg-purple-500 rounded-full self-center"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
