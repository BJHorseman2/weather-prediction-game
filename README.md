# Weather Prediction Game

A crowdsourced weather nowcasting app where users can report current conditions and make short-term weather predictions to earn XP points.

## Features

- **Real-time Weather Data**: Displays current weather conditions using multiple weather APIs
- **Weather Reporting**: Users can report current weather conditions
- **Nowcast Predictions**: Make 15/30/60 minute weather predictions
- **XP System**: Earn points for accurate reports and predictions
- **Location-based**: Uses geolocation to show weather for user's current location
- **Multiple Data Sources**: 
  - US National Weather Service (weather.gov) - no API key required
  - AccuWeather API (with API key)
  - OpenWeatherMap (fallback)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BJHorseman2/weather-prediction-game.git
cd weather-prediction-game
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. (Optional) Add your API keys to `.env.local`:
   - AccuWeather API key from https://developer.accuweather.com
   - OpenWeatherMap API key from https://openweathermap.org/api

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3026](http://localhost:3026) in your browser

## How It Works

1. **Current Weather Display**: Shows real-time weather data for your location
2. **Report Weather**: Click "Report Current Weather" to submit conditions you observe
3. **Make Predictions**: Click "Make a Nowcast" to predict weather 15-60 minutes ahead
4. **Earn XP**: Get points for reports and accurate predictions

## Tech Stack

- **Framework**: Next.js 15.4 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Weather APIs**: 
  - weather.gov (US National Weather Service)
  - AccuWeather
  - OpenWeatherMap

## API Configuration

The app works out of the box using the US National Weather Service API (US locations only, no key required).

For global coverage, add your AccuWeather API key to `.env.local`:
```
ACCUWEATHER_API_KEY=your_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
