import { NextRequest, NextResponse } from 'next/server';
import { getLocationKey, getCurrentConditions, weatherIconToCondition } from '@/lib/accuweather';
import { getCurrentWeatherOpenWeather, openWeatherToCondition, getWindDirection } from '@/lib/openweather';
import { getWeatherGovData, weatherGovIconToCondition } from '@/lib/weather-gov';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    
    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }
    
    // Try Weather.gov first (US only, no API key needed)
    try {
      console.log('Trying Weather.gov API for coordinates:', lat, lon);
      const weatherGovData = await getWeatherGovData(parseFloat(lat), parseFloat(lon));
      const obs = weatherGovData.observation.properties;
      
      const tempC = obs.temperature.value;
      const tempF = tempC !== null ? Math.round(tempC * 9/5 + 32) : null;
      const humidity = obs.relativeHumidity.value;
      const windSpeedMS = obs.windSpeed.value;
      const windSpeedMPH = windSpeedMS !== null ? Math.round(windSpeedMS * 2.237) : null;
      const pressurePa = obs.barometricPressure.value;
      const pressureInHg = pressurePa !== null ? (pressurePa / 3386.39).toFixed(2) : null;
      
      return NextResponse.json({
        temperature: tempF || 0,
        temperatureF: tempF || 0,
        temperatureC: tempC || 0,
        condition: weatherGovIconToCondition(obs.icon),
        conditionText: obs.textDescription || 'Unknown',
        humidity: humidity !== null ? Math.round(humidity) : 0,
        windSpeed: windSpeedMPH || 0,
        windDirection: obs.windDirection.value !== null ? 
          getWindDirection(obs.windDirection.value) : 'N',
        pressure: pressureInHg || '30.00',
        realFeel: obs.heatIndex.value !== null ? 
          Math.round(obs.heatIndex.value * 9/5 + 32) : 
          (obs.windChill.value !== null ? 
            Math.round(obs.windChill.value * 9/5 + 32) : 
            tempF || 0),
        cloudCover: 0, // Not available from weather.gov
        location: `${weatherGovData.location.city}, ${weatherGovData.location.state}`,
        timestamp: obs.timestamp,
        isMockData: false,
        source: 'Weather.gov (NWS)',
        station: weatherGovData.stationId
      });
    } catch (weatherGovError) {
      console.error('Weather.gov API error:', weatherGovError);
      // Fall through to AccuWeather
    }
    
    // Check if API key is configured
    if (!process.env.ACCUWEATHER_API_KEY) {
      // Return mock data if no API key
      return NextResponse.json({
        temperature: 72,
        temperatureF: 72,
        temperatureC: 22,
        condition: 'partly_cloudy',
        conditionText: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8,
        windDirection: 'NW',
        pressure: 30.15,
        realFeel: 74,
        cloudCover: 40,
        location: 'Your Location',
        timestamp: new Date().toISOString(),
        isMockData: true
      });
    }
    
    try {
      // Get location key from coordinates
      console.log('Fetching weather for coordinates:', lat, lon);
      const locationKey = await getLocationKey(parseFloat(lat), parseFloat(lon));
      console.log('Location key:', locationKey);
      
      // Get current conditions
      const conditions = await getCurrentConditions(locationKey);
      console.log('Weather conditions:', conditions);
      
      return NextResponse.json({
        temperature: conditions.Temperature.Imperial.Value,
        temperatureF: conditions.Temperature.Imperial.Value,
        temperatureC: conditions.Temperature.Metric.Value,
        condition: weatherIconToCondition(conditions.WeatherIcon),
        conditionText: conditions.WeatherText,
        humidity: conditions.RelativeHumidity,
        windSpeed: conditions.Wind.Speed.Imperial.Value,
        windDirection: conditions.Wind.Direction.English,
        pressure: conditions.Pressure.Imperial.Value,
        realFeel: conditions.RealFeelTemperature.Imperial.Value,
        cloudCover: conditions.CloudCover,
        hasPrecipitation: conditions.HasPrecipitation,
        precipitationType: conditions.PrecipitationType,
        isDayTime: conditions.IsDayTime,
        timestamp: conditions.LocalObservationDateTime,
        isMockData: false
      });
    } catch (accuWeatherError) {
      console.error('AccuWeather API error:', accuWeatherError);
      
      // Try OpenWeatherMap as fallback
      try {
        console.log('Falling back to OpenWeatherMap...');
        const openWeatherData = await getCurrentWeatherOpenWeather(parseFloat(lat), parseFloat(lon));
        
        return NextResponse.json({
          temperature: Math.round(openWeatherData.main.temp),
          temperatureF: Math.round(openWeatherData.main.temp),
          temperatureC: Math.round((openWeatherData.main.temp - 32) * 5 / 9),
          condition: openWeatherToCondition(openWeatherData.weather[0].id),
          conditionText: openWeatherData.weather[0].description.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          humidity: openWeatherData.main.humidity,
          windSpeed: Math.round(openWeatherData.wind.speed),
          windDirection: getWindDirection(openWeatherData.wind.deg),
          pressure: (openWeatherData.main.pressure * 0.02953).toFixed(2),
          realFeel: Math.round(openWeatherData.main.feels_like),
          cloudCover: openWeatherData.clouds.all,
          location: openWeatherData.name,
          timestamp: new Date().toISOString(),
          isMockData: false,
          source: 'OpenWeatherMap'
        });
      } catch (openWeatherError) {
        console.error('OpenWeatherMap API error:', openWeatherError);
        
        // Return mock data as final fallback
        return NextResponse.json({
          temperature: 72,
          temperatureF: 72,
          temperatureC: 22,
          condition: 'partly_cloudy',
          conditionText: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 8,
          windDirection: 'NW',
          pressure: 30.15,
          realFeel: 74,
          cloudCover: 40,
          location: 'Your Location',
          timestamp: new Date().toISOString(),
          isMockData: true,
          apiError: true
        });
      }
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}