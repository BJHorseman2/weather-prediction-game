'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PREDICTION_WINDOWS = [
  { value: 15, label: '15 minutes', xp: 50 },
  { value: 30, label: '30 minutes', xp: 75 },
  { value: 60, label: '1 hour', xp: 100 },
];

const WEATHER_PREDICTIONS = [
  { code: 'clear', label: 'Clear/Sunny', icon: '☀️' },
  { code: 'partly_cloudy', label: 'Partly Cloudy', icon: '⛅' },
  { code: 'cloudy', label: 'Cloudy', icon: '☁️' },
  { code: 'rain_starting', label: 'Rain Starting', icon: '🌦️' },
  { code: 'rain_stopping', label: 'Rain Stopping', icon: '🌤️' },
  { code: 'storm_approaching', label: 'Storm Approaching', icon: '⛈️' },
];

interface NowcastPredictorProps {
  onClose: () => void;
  onPredictionSubmitted?: (xpEarned: number) => void;
}

export default function NowcastPredictor({ onClose, onPredictionSubmitted }: NowcastPredictorProps) {
  const [predictionWindow, setPredictionWindow] = useState(15);
  const [weatherPrediction, setWeatherPrediction] = useState('');
  const [confidence, setConfidence] = useState(50);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weatherPrediction) return;
    
    const xpEarned = PREDICTION_WINDOWS.find(w => w.value === predictionWindow)?.xp || 50;
    
    setSuccess(true);
    
    setTimeout(() => {
      if (onPredictionSubmitted) {
        onPredictionSubmitted(xpEarned);
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
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white text-center max-w-sm"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Nowcast Submitted!</h3>
          <p className="text-purple-100">We'll verify your prediction soon.</p>
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
              Weather Nowcast
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
              Prediction Window
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PREDICTION_WINDOWS.map((window) => (
                <button
                  key={window.value}
                  type="button"
                  onClick={() => setPredictionWindow(window.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    predictionWindow === window.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{window.label}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    +{window.xp} XP
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weather Prediction *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WEATHER_PREDICTIONS.map((prediction) => (
                <button
                  key={prediction.code}
                  type="button"
                  onClick={() => setWeatherPrediction(prediction.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    weatherPrediction === prediction.code
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{prediction.icon}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{prediction.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confidence Level: {confidence}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={!weatherPrediction}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Submit Nowcast
          </button>
        </form>
      </motion.div>
    </div>
  );
}