
import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface InterestInputProps {
  currentValue: string;
  onUpdate: (newValue: string) => void;
  isLoading: boolean;
}

export const InterestInput: React.FC<InterestInputProps> = ({ currentValue, onUpdate, isLoading }) => {
  const [value, setValue] = useState(currentValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() !== currentValue) {
      onUpdate(value);
    }
    setIsEditing(false);
  };

  if (!isEditing && !isLoading) {
    return (
      <div 
        onClick={() => setIsEditing(true)}
        className="bg-gray-800/40 border border-purple-500/30 rounded-xl p-4 cursor-pointer hover:bg-gray-800/60 transition-colors group"
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">I am looking for...</span>
          <span className="text-xs text-gray-500 group-hover:text-purple-300 transition-colors">Click to edit</span>
        </div>
        <p className="text-gray-200 font-medium">{value || "Tell us what you are looking for..."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 border border-purple-500 rounded-xl p-4 shadow-lg shadow-purple-500/10">
      <label className="block text-xs uppercase tracking-wider text-purple-400 font-bold mb-2">
        Refine your Universe
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
        placeholder="I am looking for a hiking group and people who love sci-fi..."
        rows={3}
        disabled={isLoading}
      />
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={() => {
            setValue(currentValue);
            setIsEditing(false);
          }}
          className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold rounded-lg shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : <><SparklesIcon className="w-4 h-4" /> Update</>}
        </button>
      </div>
    </form>
  );
};
