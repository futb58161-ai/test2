import React, { useState, useEffect } from 'react';
import { X, User, Target, Calendar, Clock, Settings, Save } from 'lucide-react';
import { UserProfile } from '../types/types';
import { getUserProfile, saveUserProfile } from '../utils/storage';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  darkMode
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    id: Date.now().toString(),
    name: '',
    email: '',
    level: 'A1',
    targetLevel: 'B2',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    dailyGoalMinutes: 240,
    preferences: {
      darkMode: true,
      notifications: true,
      language: 'en'
    }
  });

  useEffect(() => {
    if (isOpen) {
      const existingProfile = getUserProfile();
      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Set target date to 6 months from now by default
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + 6);
        setProfile(prev => ({
          ...prev,
          targetDate: targetDate.toISOString().split('T')[0]
        }));
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    saveUserProfile(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-blue-500" />
              User Profile
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Your name"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Learning Levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Current Level
                </label>
                <select
                  value={profile.level}
                  onChange={(e) => setProfile({...profile, level: e.target.value as any})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Target Level
                </label>
                <select
                  value={profile.targetLevel}
                  onChange={(e) => setProfile({...profile, targetLevel: e.target.value as any})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={profile.startDate}
                  onChange={(e) => setProfile({...profile, startDate: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Target Date
                </label>
                <input
                  type="date"
                  value={profile.targetDate}
                  onChange={(e) => setProfile({...profile, targetDate: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Daily Goal */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Daily Goal (minutes)
              </label>
              <input
                type="number"
                value={profile.dailyGoalMinutes}
                onChange={(e) => setProfile({...profile, dailyGoalMinutes: parseInt(e.target.value) || 0})}
                min="15"
                max="480"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              />
              <p className="text-sm text-gray-500 mt-1">
                Recommended: 240 minutes (4 hours) for intensive learning
              </p>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <input
                    type="checkbox"
                    checked={profile.preferences.darkMode}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {...profile.preferences, darkMode: e.target.checked}
                    })}
                    className="rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Notifications</span>
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {...profile.preferences, notifications: e.target.checked}
                    })}
                    className="rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Interface Language</span>
                  <select
                    value={profile.preferences.language}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {...profile.preferences, language: e.target.value as any}
                    })}
                    className={`px-3 py-1 rounded border ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            {profile.name && (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Learning Journey</h4>
                <div className="text-sm space-y-1">
                  <p><strong>{profile.name}</strong> is learning German</p>
                  <p>From <strong>{profile.level}</strong> to <strong>{profile.targetLevel}</strong></p>
                  <p>Daily goal: <strong>{Math.floor(profile.dailyGoalMinutes / 60)}h {profile.dailyGoalMinutes % 60}min</strong></p>
                  {profile.targetDate && (
                    <p>Target: <strong>{new Date(profile.targetDate).toLocaleDateString()}</strong></p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};