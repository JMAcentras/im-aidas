
import React, { useState } from 'react';
import { Profile } from '../types';
import { FlameIcon } from './icons/FlameIcon';
import { HashtagIcon } from './icons/HashtagIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ProfileCardProps {
  profile: Profile;
  onUpdate?: (updatedProfile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [newInterest, setNewInterest] = useState("");

  // Calculate completeness
  const calculateCompleteness = () => {
    let score = 0;
    if (profile.summary && profile.summary.length > 5) score += 10;
    if (profile.aboutMe && profile.aboutMe.length > 10) score += 20;
    if (profile.lookingFor && profile.lookingFor.length > 5) score += 15;
    if (profile.offering && profile.offering.length > 5) score += 15;
    if (profile.interests.length >= 5) score += 20;
    if (profile.badges && profile.badges.length > 0) score += 20;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData);
    }
    setIsEditing(false);
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Completeness Bar */}
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Profile Strength</h3>
          <span className={`text-xl font-extrabold ${completeness === 100 ? 'text-green-400' : 'text-purple-400'}`}>
            {completeness}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${completeness === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-600 to-pink-500'}`}
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {completeness < 100 ? "Take quizzes and add details to reach 100%!" : "Profile Complete! You're a star."}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 relative">
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
            isEditing 
              ? 'bg-green-600 border-green-500 text-white hover:bg-green-500' 
              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>

        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 mb-3 flex items-center justify-center ring-4 ring-gray-700/50 shadow-lg">
            <span className="text-3xl font-bold text-white select-none">{profile.name.charAt(0).toUpperCase()}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
          <div className="mt-2 flex items-center gap-1.5 bg-yellow-900/40 text-yellow-300 px-3 py-0.5 rounded-full text-sm font-medium border border-yellow-700/30">
            <FlameIcon className="w-3.5 h-3.5" />
            <span>{profile.karma} Karma</span>
          </div>

          {/* EDIT FORM START */}
          {isEditing ? (
            <div className="w-full space-y-4 mt-6">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">Tagline</label>
                <input 
                  type="text"
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-bold">About Me</label>
                <textarea 
                  value={formData.aboutMe || ""}
                  onChange={e => setFormData({...formData, aboutMe: e.target.value})}
                  placeholder="Share your story, your vibe, and what makes you tick..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none mt-1"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-purple-400 uppercase font-bold">Seeking</label>
                    <textarea 
                      value={formData.lookingFor}
                      onChange={e => setFormData({...formData, lookingFor: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none mt-1"
                      rows={2}
                    />
                 </div>
                 <div>
                    <label className="text-xs text-green-400 uppercase font-bold">Offering</label>
                    <textarea 
                      value={formData.offering}
                      onChange={e => setFormData({...formData, offering: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none mt-1"
                      rows={2}
                    />
                 </div>
              </div>

               {/* Interest Editor */}
               <div>
                 <label className="text-xs text-gray-500 uppercase font-bold">Interests</label>
                 <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {formData.interests.map((tag, i) => (
                      <span key={i} className="inline-flex items-center text-xs font-medium text-purple-300 bg-purple-900/30 border border-purple-800 rounded-md px-2 py-1">
                        {tag}
                        <button onClick={() => removeInterest(i)} className="ml-2 text-red-400 hover:text-red-300">×</button>
                      </span>
                    ))}
                 </div>
                 <form onSubmit={handleAddInterest} className="flex gap-2">
                    <input 
                      type="text" 
                      value={newInterest}
                      onChange={e => setNewInterest(e.target.value)}
                      placeholder="Add interest..."
                      className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white"
                    />
                    <button type="submit" className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-sm">+</button>
                 </form>
               </div>
            </div>
          ) : (
            /* VIEW MODE START */
            <>
              <div className="mt-6 w-full text-center">
                 <p className="text-gray-300 italic text-lg">"{profile.summary}"</p>
              </div>

              <div className="mt-6 w-full text-left">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About Me</h3>
                <p className="text-gray-300 text-sm leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 whitespace-pre-wrap">
                  {profile.aboutMe || "No description yet. Tap edit to add one!"}
                </p>
              </div>

              <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="text-left">
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Seeking</h3>
                    <p className="text-gray-300 text-sm bg-purple-900/20 p-3 rounded-lg border border-purple-500/20 h-full">
                       {profile.lookingFor}
                    </p>
                 </div>
                 <div className="text-left">
                    <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Offering</h3>
                    <p className="text-gray-300 text-sm bg-green-900/20 p-3 rounded-lg border border-green-500/20 h-full">
                       {profile.offering || "Friendship and good vibes."}
                    </p>
                 </div>
              </div>

              {/* Badges / Traits */}
              {profile.badges && profile.badges.length > 0 && (
                <div className="mt-4 w-full text-left">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge, i) => (
                      <span key={i} className="inline-flex items-center text-xs font-bold text-orange-300 bg-orange-900/20 border border-orange-700/50 rounded px-2 py-1">
                        ★ {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests Tags */}
              <div className="mt-4 w-full text-left">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.map((tag, i) => (
                    <span key={i} className="inline-flex items-center text-xs font-medium text-purple-300 bg-purple-900/30 border border-purple-800 rounded-md px-2 py-1">
                      <HashtagIcon className="w-3 h-3 mr-1 opacity-70" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Contributions */}
              {profile.contributions && profile.contributions.length > 0 && (
                 <div className="mt-6 w-full text-left pt-4 border-t border-gray-700">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">My Contributions</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {profile.contributions.map((card, i) => (
                             <div key={i} className="p-2 bg-gray-800 rounded border border-gray-600 text-xs">
                                <span className="block text-purple-400 font-bold mb-1">{card.theme}</span>
                                <p className="text-gray-300 line-clamp-2">{card.content}</p>
                             </div>
                        ))}
                    </div>
                 </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
