import React from 'react';
import { Task } from '../types/types';
import { TaskCard } from './TaskCard';
import { getDayName } from '../utils/taskUtils';

interface DayCardProps {
  day: string;
  tasks: Task[];
  darkMode: boolean;
  pomodoroState: any;
  onTaskToggle: (dayId: string, taskId: string) => void;
  onSubtaskToggle: (dayId: string, taskId: string, subtaskIndex: number) => void;
  onVideoDataChange: (dayId: string, taskId: string, field: string, value: string) => void;
  onRadioDataChange: (dayId: string, taskId: string, field: string, value: string) => void;
  onProfKhalidDataChange: (dayId: string, taskId: string, field: string, value: string) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  tasks,
  darkMode,
  pomodoroState,
  onTaskToggle,
  onSubtaskToggle,
  onVideoDataChange,
  onRadioDataChange,
  onProfKhalidDataChange,
}) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{getDayName(day)}</h3>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            {completedTasks}/{totalTasks} tasks
          </div>
          <div className="text-sm font-semibold text-blue-600">
            {completionPercentage}%
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            darkMode={darkMode}
            pomodoroState={pomodoroState}
            onToggle={() => onTaskToggle(day, task.id)}
            onSubtaskToggle={(subtaskIndex) => onSubtaskToggle(day, task.id, subtaskIndex)}
            onVideoDataChange={(field, value) => onVideoDataChange(day, task.id, field, value)}
            onRadioDataChange={(field, value) => onRadioDataChange(day, task.id, field, value)}
            onProfKhalidDataChange={(field, value) => onProfKhalidDataChange(day, task.id, field, value)}
          />
        ))}
      </div>
    </div>
  );
};