'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WeatherReport {
  id: string;
  weatherCode: string;
  temperature?: number;
  locationName: string;
  createdAt: string;
  username: string;
  description?: string;
  latitude: number;
  longitude: number;
  xpAwarded: number;
}

interface CrowdsourcedWeatherMapProps {
  centerLat?: number;
  centerLon?: number;
  radius?: number;
}

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

export default function CrowdsourcedWeatherMap({ centerLat = 40.7128, centerLon = -74.0060, radius = 10 }: CrowdsourcedWeatherMapProps) {
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNearbyReports();
  }, [centerLat, centerLon, radius]);

  const fetchNearbyReports = async () => {
    try {
      const response = await fetch(
        `/api/weather/reports?lat=${centerLat}&lon=${centerLon}&radius=${radius}`
      );
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const getDistance = (lat: number, lon: number) => {
    const R = 3959; // Radius of Earth in miles
    const dLat = (lat - centerLat) * Math.PI / 180;
    const dLon = (lon - centerLon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(centerLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
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
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No weather reports within {radius} miles
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Be the first to report current conditions!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">
                      {WEATHER_ICONS[report.weatherCode] || '🌡️'}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {report.locationName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {report.username} • {getTimeAgo(report.createdAt)} • {getDistance(report.latitude, report.longitude)} mi
                      </p>
                    </div>
                  </div>
                  {report.temperature !== undefined && (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(report.temperature)}°F
                    </div>
                  )}
                </div>
                {report.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                    "{report.description}"
                  </p>
                )}
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
                  {WEATHER_ICONS[selectedReport.weatherCode] || '🌡️'}
                </span>
                <div>
                  <p className="font-semibold">{selectedReport.locationName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {selectedReport.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {getDistance(selectedReport.latitude, selectedReport.longitude)} miles away
                  </p>
                </div>
              </div>
              {selectedReport.temperature !== undefined && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                  <p className="text-2xl font-bold">{Math.round(selectedReport.temperature)}°F</p>
                </div>
              )}
              {selectedReport.description && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="font-medium">"{selectedReport.description}"</p>
                </div>
              )}
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                <p className="text-sm text-purple-600 dark:text-purple-400">XP Awarded</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">+{selectedReport.xpAwarded} XP</p>
              </div>
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