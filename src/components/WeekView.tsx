import React from 'react';
import { DayCard } from './DayCard';
import { WeekData, PomodoroState } from '../types/types';
import { calculateDayProgress, calculateTotalTime } from '../utils/taskUtils';

interface WeekViewProps {
  weekData: WeekData;
  darkMode: boolean;
  pomodoroState: PomodoroState | null;
  onTaskComplete: (day: string, taskId: string, completed: boolean) => void;
  onTaskDurationChange: (day: string, taskId: string, duration: number) => void;
  onTaskNotesChange: (day: string, taskId: string, notes: string) => void;
  onVideoDataChange: (day: string, taskId: string, field: string, value: string) => void;
  onStartPomodoro: (day: string, taskId: string) => void;
  onStopPomodoro: () => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  weekData,
  darkMode,
  pomodoroState,
  onTaskComplete,
  onTaskDurationChange,
  onTaskNotesChange,
  onVideoDataChange,
  onStartPomodoro,
  onStopPomodoro
}) => {
  const days = [
    { key: 'monday', label: 'Mo' },
    { key: 'tuesday', label: 'Di' },
    { key: 'wednesday', label: 'Mi' },
    { key: 'thursday', label: 'Do' },
    { key: 'friday', label: 'Fr' },
    { key: 'saturday', label: 'Sa' },
    { key: 'sunday', label: 'So' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {days.map(({ key, label }) => {
        const dayData = weekData[key as keyof WeekData];
        const progress = calculateDayProgress(dayData.tasks);
        const totalTime = calculateTotalTime(dayData.tasks);
        
        return (
          <DayCard
            key={key}
            day={key}
            label={label}
            tasks={dayData.tasks}
            progress={progress}
            totalTime={totalTime}
            darkMode={darkMode}
            pomodoroState={pomodoroState}
            onTaskComplete={onTaskComplete}
            onTaskDurationChange={onTaskDurationChange}
            onTaskNotesChange={onTaskNotesChange}
            onVideoDataChange={onVideoDataChange}
            onStartPomodoro={onStartPomodoro}
            onStopPomodoro={onStopPomodoro}
          />
        );
      })}
    </div>
  );
};