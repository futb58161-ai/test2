import { useState, useEffect } from 'react';
import { LearningData, LearningDay } from '../components/GermanLearningTracker';

export const useLearningData = () => {
  const [learningData, setLearningData] = useState<LearningData>({});
  const [streak, setStreak] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('germanLearningData');
    if (savedData) {
      try {
        setLearningData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading learning data:', error);
      }
    }
  }, []);

  // Calculate streak whenever data changes
  useEffect(() => {
    calculateStreak();
  }, [learningData]);

  const updateDayData = (date: string, dayData: LearningDay) => {
    const newData = {
      ...learningData,
      [date]: dayData
    };
    setLearningData(newData);
    localStorage.setItem('germanLearningData', JSON.stringify(newData));
  };

  const calculateStreak = () => {
    const dates = Object.keys(learningData).sort().reverse();
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Check if today has progress
    const todayData = learningData[today];
    let startFromToday = todayData && (
      todayData.sentences.length > 0 || 
      todayData.tasks.some(task => task.completed) || 
      todayData.notes.trim()
    );

    if (startFromToday) {
      currentStreak = 1;
    }

    // Count consecutive days backwards
    const startDate = new Date(today);
    if (!startFromToday) {
      startDate.setDate(startDate.getDate() - 1);
    }

    for (let i = startFromToday ? 1 : 0; i < 365; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayData = learningData[dateStr];
      const hasProgress = dayData && (
        dayData.sentences.length > 0 || 
        dayData.tasks.some(task => task.completed) || 
        dayData.notes.trim()
      );

      if (hasProgress) {
        if (!startFromToday || i > 0) {
          currentStreak++;
        }
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  return {
    learningData,
    updateDayData,
    streak
  };
};