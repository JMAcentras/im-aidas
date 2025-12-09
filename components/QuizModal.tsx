
import React, { useState } from 'react';
import { FlameIcon } from './icons/FlameIcon';

export type QuizType = 'hobbies' | 'character' | 'social';

interface QuizConfig {
  title: string;
  questions: string[];
  reward: string; // The badge/trait to award
  karma: number;
}

const QUIZZES: Record<QuizType, QuizConfig> = {
  hobbies: {
    title: "The Adventurer",
    karma: 30,
    reward: "Explorer",
    questions: [
      "When you travel, do you plan every detail or just go with the flow?",
      "Would you rather spend a day hiking a mountain or exploring a city museum?",
      "Do you prefer creating things (art, code, food) or consuming them (movies, games, dining)?",
      "Is your ideal weekend active and high-energy or quiet and restorative?",
      "Do you have a hobby you've stuck with for more than 5 years?"
    ]
  },
  character: {
    title: "The Philosopher",
    karma: 40,
    reward: "Deep Soul",
    questions: [
      "Do you make decisions based on logic and facts or gut feeling and emotion?",
      "Do you believe people can truly change who they are?",
      "Is it more important to be honest or to be kind?",
      "Do you tend to lead conversations or listen and observe?",
      "Would you rather be respected for your intelligence or loved for your personality?",
      "Do you focus more on the future possibilities or the present moment?"
    ]
  },
  social: {
    title: "The Socialite",
    karma: 35,
    reward: "Connector",
    questions: [
      "In a group of strangers, do you introduce yourself first?",
      "Do you prefer a deep conversation with one person or a fun chat with many?",
      "When a friend is sad, do you offer solutions or just a shoulder to cry on?",
      "Do you recharge by being alone or by being around people?",
      "Is your social circle small and tight-knit or large and expanding?"
    ]
  }
};

interface QuizModalProps {
  type: QuizType;
  onComplete: (points: number, badge: string) => void;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ type, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const quiz = QUIZZES[type];

  const handleChoice = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(quiz.karma, quiz.reward);
    }
  };

  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FlameIcon className="w-6 h-6 animate-pulse" />
            <span>{quiz.title}</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl">&times;</button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
              <span className="text-orange-400">+{quiz.karma} Karma</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-center text-white mb-8 min-h-[5rem] flex items-center justify-center leading-relaxed">
            {quiz.questions[currentIndex]}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleChoice}
              className="py-4 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95 border-b-4 border-gray-900 active:border-b-0 active:translate-y-1"
            >
              Option A
            </button>
            <button 
              onClick={handleChoice}
              className="py-4 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95 border-b-4 border-gray-900 active:border-b-0 active:translate-y-1"
            >
              Option B
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
