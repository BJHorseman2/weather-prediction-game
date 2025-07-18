'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  totalXP: number;
  level: number;
  reportsCount: number;
  predictionsCount: number;
  accuracyRate: number;
  rank?: number;
}

interface LeaderboardProps {
  currentUserId?: string;
}

export default function Leaderboard({ currentUserId }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'alltime'>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-500';
      case 2: return 'from-gray-300 to-gray-400';
      case 3: return 'from-orange-400 to-orange-500';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🏆 Leaderboard
        </h3>
        
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'alltime'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeframe === tf
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tf === 'alltime' ? 'All Time' : tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No entries yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.id === currentUserId;
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative overflow-hidden rounded-lg p-4 ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500' 
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  {rank <= 3 && (
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getRankColor(rank)}`} />
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 font-bold text-lg">
                        {getRankEmoji(rank) || `#${rank}`}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {entry.username.charAt(0).toUpperCase()}
                        </div>
                        
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <span>{entry.displayName || entry.username}</span>
                            {isCurrentUser && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">YOU</span>}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Level {entry.level} • {entry.accuracyRate.toFixed(0)}% accuracy
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {entry.totalXP.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">XP</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{entry.reportsCount} reports</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🔮</span>
                      <span>{entry.predictionsCount} predictions</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}