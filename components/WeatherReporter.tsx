'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WEATHER_CONDITIONS = [
  { code: 'clear', label: 'Clear', icon: '☀️' },
  { code: 'partly_cloudy', label: 'Partly Cloudy', icon: '⛅' },
  { code: 'cloudy', label: 'Cloudy', icon: '☁️' },
  { code: 'rain_light', label: 'Light Rain', icon: '🌦️' },
  { code: 'rain_moderate', label: 'Moderate Rain', icon: '🌧️' },
  { code: 'rain_heavy', label: 'Heavy Rain', icon: '⛈️' },
  { code: 'snow_light', label: 'Light Snow', icon: '🌨️' },
  { code: 'snow_moderate', label: 'Moderate Snow', icon: '❄️' },
  { code: 'storm', label: 'Storm', icon: '⛈️' },
  { code: 'fog', label: 'Fog', icon: '🌫️' },
];

interface WeatherReporterProps {
  onClose: () => void;
  onReportSubmitted?: (xpEarned: number) => void;
}

export default function WeatherReporter({ onClose, onReportSubmitted }: WeatherReporterProps) {
  const [weatherCode, setWeatherCode] = useState('');
  const [temperature, setTemperature] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weatherCode) return;
    
    // Simulate XP calculation
    const baseXP = 10;
    const tempBonus = temperature ? 5 : 0;
    const descBonus = description ? 5 : 0;
    const totalXP = baseXP + tempBonus + descBonus;
    
    setSuccess(true);
    
    setTimeout(() => {
      if (onReportSubmitted) {
        onReportSubmitted(totalXP);
      }
      onClose();
    }, 1500);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white text-center max-w-sm"
        >
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold mb-2">Report Submitted!</h3>
          <p className="text-green-100">Thank you for contributing!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Report Current Weather
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Conditions *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {WEATHER_CONDITIONS.map((condition) => (
                <button
                  key={condition.code}
                  type="button"
                  onClick={() => setWeatherCode(condition.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    weatherCode === condition.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{condition.icon}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{condition.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperature (°F)
            </label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="72"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional observations..."
            />
          </div>

          <button
            type="submit"
            disabled={!weatherCode}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Submit Weather Report
          </button>
        </form>
      </motion.div>
    </div>
  );
}