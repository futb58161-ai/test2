import React, { useState, useEffect } from 'react';
import { X, RotateCcw, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { LearningData } from './GermanLearningTracker';

interface ReviewModeProps {
  learningData: LearningData;
  onClose: () => void;
  isDark: boolean;
}

interface FlashCard {
  sentence: string;
  date: string;
  remembered: boolean | null;
}

export const ReviewMode: React.FC<ReviewModeProps> = ({
  learningData,
  onClose,
  isDark
}) => {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [reviewStats, setReviewStats] = useState({ remembered: 0, forgot: 0 });

  useEffect(() => {
    // Collect all sentences from learning data
    const cards: FlashCard[] = [];
    Object.entries(learningData).forEach(([date, dayData]) => {
      dayData.sentences.forEach(sentence => {
        cards.push({
          sentence,
          date,
          remembered: null
        });
      });
    });
    
    // Shuffle cards
    const shuffled = cards.sort(() => Math.random() - 0.5);
    setFlashCards(shuffled);
  }, [learningData]);

  const handleResponse = (remembered: boolean) => {
    const updatedCards = [...flashCards];
    updatedCards[currentIndex].remembered = remembered;
    setFlashCards(updatedCards);

    setReviewStats(prev => ({
      remembered: prev.remembered + (remembered ? 1 : 0),
      forgot: prev.forgot + (remembered ? 0 : 1)
    }));

    // Move to next card
    if (currentIndex < flashCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false);
    }
  };

  const goToNext = () => {
    if (currentIndex < flashCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    }
  };

  const resetReview = () => {
    const shuffled = flashCards.sort(() => Math.random() - 0.5);
    setFlashCards(shuffled.map(card => ({ ...card, remembered: null })));
    setCurrentIndex(0);
    setShowTranslation(false);
    setReviewStats({ remembered: 0, forgot: 0 });
  };

  if (flashCards.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`w-full max-w-md p-8 rounded-2xl text-center ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold mb-2">No Sentences to Review</h2>
          <p className="text-sm opacity-75 mb-6">
            Start learning and adding German sentences to use the review mode!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashCards[currentIndex];
  const progress = ((currentIndex + 1) / flashCards.length) * 100;
  const isComplete = currentIndex === flashCards.length - 1 && currentCard.remembered !== null;

  if (isComplete) {
    const accuracy = Math.round((reviewStats.remembered / (reviewStats.remembered + reviewStats.forgot)) * 100);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`w-full max-w-md p-8 rounded-2xl text-center ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold mb-4">Review Complete!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-green-50'}`}>
              <div className="text-2xl font-bold text-green-500">{reviewStats.remembered}</div>
              <div className="text-sm opacity-75">Remembered</div>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-red-50'}`}>
              <div className="text-2xl font-bold text-red-500">{reviewStats.forgot}</div>
              <div className="text-sm opacity-75">Need Practice</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">Accuracy: {accuracy}%</div>
            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetReview}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Review Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-2xl rounded-2xl ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">🧠 Review Mode</h2>
              <p className="text-sm opacity-75">
                Card {currentIndex + 1} of {flashCards.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Flash Card */}
          <div className={`min-h-[200px] p-8 rounded-2xl border-2 border-dashed mb-6 flex items-center justify-center text-center ${
            isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-50'
          }`}>
            <div>
              <div className="text-lg font-medium mb-4">{currentCard.sentence}</div>
              <div className="text-sm opacity-75 mb-4">
                Learned on: {new Date(currentCard.date).toLocaleDateString()}
              </div>
              
              {!showTranslation ? (
                <button
                  onClick={() => setShowTranslation(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Show Translation
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-600' : 'bg-white'}`}>
                    <div className="text-sm opacity-75 mb-1">Translation:</div>
                    <div className="font-medium">
                      {/* This would ideally connect to a translation service */}
                      Click "Remembered" if you knew the meaning!
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => handleResponse(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Forgot
                    </button>
                    <button
                      onClick={() => handleResponse(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Remembered
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                currentIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : isDark
                  ? 'hover:bg-slate-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm opacity-75">
              Remembered: {reviewStats.remembered} | Forgot: {reviewStats.forgot}
            </div>

            <button
              onClick={goToNext}
              disabled={currentIndex === flashCards.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                currentIndex === flashCards.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : isDark
                  ? 'hover:bg-slate-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};