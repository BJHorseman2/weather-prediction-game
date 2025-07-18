// OpenWeatherMap API integration as fallback
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface OpenWeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
}

export async function getCurrentWeatherOpenWeather(lat: number, lon: number): Promise<OpenWeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching OpenWeather data:', error);
    throw error;
  }
}

export function openWeatherToCondition(weatherId: number): string {
  // Map OpenWeather condition codes to our weather codes
  if (weatherId >= 200 && weatherId < 300) return 'storm';
  if (weatherId >= 300 && weatherId < 400) return 'rain_light';
  if (weatherId >= 500 && weatherId < 505) return 'rain_moderate';
  if (weatherId >= 505 && weatherId < 600) return 'rain_heavy';
  if (weatherId >= 600 && weatherId < 700) return 'snow_moderate';
  if (weatherId >= 700 && weatherId < 800) return 'fog';
  if (weatherId === 800) return 'clear';
  if (weatherId === 801 || weatherId === 802) return 'partly_cloudy';
  if (weatherId === 803 || weatherId === 804) return 'cloudy';
  return 'cloudy';
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}