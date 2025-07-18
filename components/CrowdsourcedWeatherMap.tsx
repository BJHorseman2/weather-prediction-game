'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WeatherReport {
  id: string;
  weather_code: string;
  temperature?: number;
  location_name: string;
  created_at: string;
  username: string;
}

interface CrowdsourcedWeatherMapProps {
  centerLat?: number;
  centerLon?: number;
  radius?: number;
}

// Mock data for demo
const MOCK_REPORTS: WeatherReport[] = [
  {
    id: '1',
    weather_code: 'partly_cloudy',
    temperature: 72,
    location_name: 'Downtown',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    username: 'WeatherWatcher42'
  },
  {
    id: '2',
    weather_code: 'rain_light',
    temperature: 68,
    location_name: 'Airport',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    username: 'SkyObserver'
  },
  {
    id: '3',
    weather_code: 'clear',
    temperature: 75,
    location_name: 'Beach',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    username: 'CloudSpotter'
  }
];

const WEATHER_ICONS: Record<string, string> = {
  clear: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rain_light: '🌦️',
  rain_moderate: '🌧️',
  rain_heavy: '⛈️',
  storm: '⛈️',
  fog: '🌫️',
};

export default function CrowdsourcedWeatherMap({ centerLat, centerLon, radius }: CrowdsourcedWeatherMapProps) {
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);

  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Live Weather Reports
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {MOCK_REPORTS.length} reports nearby
          </span>
        </div>
      </div>

      <div className="p-6">
        {MOCK_REPORTS.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No weather reports in this area yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Be the first to report current conditions!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_REPORTS.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">
                      {WEATHER_ICONS[report.weather_code] || '🌡️'}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {report.location_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {report.username} • {getTimeAgo(report.created_at)}
                      </p>
                    </div>
                  </div>
                  {report.temperature && (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(report.temperature)}°F
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Weather Report Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">
                  {WEATHER_ICONS[selectedReport.weather_code] || '🌡️'}
                </span>
                <div>
                  <p className="font-semibold">{selectedReport.location_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {selectedReport.username}
                  </p>
                </div>
              </div>
              {selectedReport.temperature && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                  <p className="text-2xl font-bold">{Math.round(selectedReport.temperature)}°F</p>
                </div>
              )}
              <button
                onClick={() => setSelectedReport(null)}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}