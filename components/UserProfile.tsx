'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    displayName?: string;
    totalXP: number;
    level: number;
    streak: number;
    reportsCount: number;
    predictionsCount: number;
    accuracyRate: number;
  };
  onSignOut: () => void;
}

export default function UserProfile({ user, onSignOut }: UserProfileProps) {
  const xpForNextLevel = (user.level + 1) * 1000;
  const xpProgress = (user.totalXP % 1000) / 10;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user.displayName || user.username}</h3>
            <p className="text-purple-200">Level {user.level} Weather Prophet</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Level {user.level}</span>
          <span>{user.totalXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-yellow-400 to-green-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
          <p className="text-3xl font-bold">{user.streak}</p>
          <p className="text-sm text-purple-200">Day Streak 🔥</p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-3">
          <p className="text-3xl font-bold">{user.accuracyRate.toFixed(0)}%</p>
          <p className="text-sm text-purple-200">Accuracy</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-white/10 backdrop-blur rounded-lg p-2 text-center">
          <span className="font-bold">{user.reportsCount}</span> Reports
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-2 text-center">
          <span className="font-bold">{user.predictionsCount}</span> Predictions
        </div>
      </div>
    </div>
  );
}