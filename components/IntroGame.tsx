import React, { useState } from 'react';

const QUESTIONS = [
  { id: 'outdoors', text: 'Do you enjoy spending time outdoors?', interest: 'Outdoors' },
  { id: 'music', text: 'Are you a fan of live music events?', interest: 'Live Music' },
  { id: 'tech', text: 'Are you passionate about new technology?', interest: 'Technology' },
  { id: 'gaming', text: 'Do you enjoy video games?', interest: 'Gaming' },
  { id: 'art', text: 'Do you appreciate art and museums?', interest: 'Art & Culture' },
  { id: 'food', text: 'Are you a foodie who loves trying new cuisines?', interest: 'Foodie' },
  { id: 'books', text: 'Is reading one of your favorite pastimes?', interest: 'Reading' },
];

interface IntroGameProps {
  onComplete: (interests: string[]) => void;
}

export const IntroGame: React.FC<IntroGameProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [collectedInterests, setCollectedInterests] = useState<string[]>([]);

  const handleAnswer = (answer: boolean) => {
    if (answer) {
      setCollectedInterests(prev => [...prev, QUESTIONS[currentQuestionIndex].interest]);
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      onComplete(answer ? [...collectedInterests, QUESTIONS[currentQuestionIndex].interest] : collectedInterests);
    }
  };

  const progressPercentage = (currentQuestionIndex / QUESTIONS.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 overflow-hidden">
      <div className="relative animate-card-enter">
        <div className="mb-4">
          <span className="text-sm font-medium text-purple-300">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <p className="text-2xl font-semibold text-center text-gray-100 min-h-[6rem] flex items-center justify-center">
          {QUESTIONS[currentQuestionIndex].text}
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => handleAnswer(true)}
            className="w-full px-6 py-4 border-2 border-green-500 text-green-300 font-bold rounded-lg bg-green-900/30 hover:bg-green-800/50 transition-all duration-200 transform hover:scale-105"
          >
            Yes
          </button>
          <button 
            onClick={() => handleAnswer(false)}
            className="w-full px-6 py-4 border-2 border-red-500 text-red-300 font-bold rounded-lg bg-red-900/30 hover:bg-red-800/50 transition-all duration-200 transform hover:scale-105"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};