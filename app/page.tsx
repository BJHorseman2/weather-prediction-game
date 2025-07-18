'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherReporter from '@/components/WeatherReporter';
import NowcastPredictor from '@/components/NowcastPredictor';
import CrowdsourcedWeatherMap from '@/components/CrowdsourcedWeatherMap';
import { fireConfetti } from '@/lib/confetti';

export default function Home() {
  const [showWeatherReporter, setShowWeatherReporter] = useState(false);
  const [showNowcastPredictor, setShowNowcastPredictor] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lon: -74.0060 });
  const [xpEarnedToday, setXpEarnedToday] = useState(0);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get user location and weather on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setUserLocation(newLocation);
          
          // Fetch current weather
          try {
            const response = await fetch(`/api/weather/current?lat=${newLocation.lat}&lon=${newLocation.lon}`);
            const data = await response.json();
            setCurrentWeather(data);
          } catch (error) {
            console.error('Error fetching weather:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const handleReportSubmitted = (xpEarned: number) => {
    setXpEarnedToday(prev => prev + xpEarned);
    fireConfetti();
  };

  const handlePredictionSubmitted = (xpEarned: number) => {
    setXpEarnedToday(prev => prev + xpEarned);
    fireConfetti();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
              🌦️ Weather Nowcast
            </h1>
            {xpEarnedToday > 0 && (
              <div className="bg-green-500/20 px-4 py-2 rounded-lg">
                <span className="text-green-400 font-bold">+{xpEarnedToday} XP today</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Crowdsourced Weather Intelligence
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Report current conditions. Predict what's next. Earn XP for accuracy.
          </p>

          {/* Current Weather Display */}
          {currentWeather && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20"
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-300">Current Conditions at Your Location</h3>
              <div className="flex items-center justify-center space-x-6">
                <div className="text-6xl">
                  {currentWeather.condition === 'clear' && '☀️'}
                  {currentWeather.condition === 'partly_cloudy' && '⛅'}
                  {currentWeather.condition === 'cloudy' && '☁️'}
                  {currentWeather.condition === 'rain_light' && '🌦️'}
                  {currentWeather.condition === 'rain_moderate' && '🌧️'}
                  {currentWeather.condition === 'rain_heavy' && '⛈️'}
                  {currentWeather.condition === 'storm' && '⛈️'}
                  {currentWeather.condition === 'fog' && '🌫️'}
                  {currentWeather.condition === 'snow_light' && '🌨️'}
                  {currentWeather.condition === 'snow_moderate' && '❄️'}
                </div>
                <div className="text-left">
                  <div className="text-4xl font-bold">{Math.round(currentWeather.temperature)}°F</div>
                  <div className="text-gray-300">{currentWeather.conditionText}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Feels like {Math.round(currentWeather.realFeel || currentWeather.temperature)}°F
                  </div>
                </div>
                <div className="text-left text-sm text-gray-400 space-y-1">
                  <div>Humidity: {currentWeather.humidity}%</div>
                  <div>Wind: {currentWeather.windSpeed} mph {currentWeather.windDirection}</div>
                  <div>Pressure: {currentWeather.pressure} in</div>
                </div>
              </div>
              {currentWeather.isMockData && (
                <div className="mt-3 text-xs text-yellow-400">
                  Demo Mode: Add your AccuWeather API key to see real data
                </div>
              )}
            </motion.div>
          )}

          {loading && (
            <div className="inline-block bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/20">
              <div className="animate-pulse">
                <div className="h-8 bg-white/20 rounded w-48 mx-auto mb-4"></div>
                <div className="h-12 bg-white/20 rounded w-32 mx-auto"></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => setShowWeatherReporter(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">📍</span>
              Report Current Weather
            </button>
            
            <button
              onClick={() => setShowNowcastPredictor(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">🔮</span>
              Make a Nowcast
            </button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Reports Map */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CrowdsourcedWeatherMap 
                centerLat={userLocation.lat} 
                centerLon={userLocation.lon} 
                radius={0.2}
              />
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* How it Works */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold mb-4">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">Report Current Conditions</p>
                    <p className="text-sm text-gray-400">Earn 10-50 XP per report</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔮</span>
                  <div>
                    <p className="font-semibold">Predict Near-Future Weather</p>
                    <p className="text-sm text-gray-400">Up to 100 XP for accurate nowcasts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-semibold">Climb the Leaderboard</p>
                    <p className="text-sm text-gray-400">Compete with other forecasters</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* XP Rewards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
            >
              <h3 className="text-xl font-bold mb-4">XP Rewards</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic Weather Report</span>
                  <span className="text-green-400">+10 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>High Accuracy Report</span>
                  <span className="text-green-400">+25 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Photo Evidence</span>
                  <span className="text-green-400">+25 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Severe Weather Report</span>
                  <span className="text-green-400">+20 XP</span>
                </div>
                <hr className="border-white/20 my-2" />
                <div className="flex justify-between font-bold">
                  <span>15-min Accurate Nowcast</span>
                  <span className="text-yellow-400">+50 XP</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>30-min Accurate Nowcast</span>
                  <span className="text-yellow-400">+75 XP</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>1-hour Accurate Nowcast</span>
                  <span className="text-yellow-400">+100 XP</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showWeatherReporter && (
          <WeatherReporter 
            onClose={() => setShowWeatherReporter(false)}
            onReportSubmitted={handleReportSubmitted}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNowcastPredictor && (
          <NowcastPredictor 
            onClose={() => setShowNowcastPredictor(false)}
            onPredictionSubmitted={handlePredictionSubmitted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
