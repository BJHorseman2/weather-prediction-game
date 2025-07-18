const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY || '';
const BASE_URL = 'https://dataservice.accuweather.com';

export interface CurrentConditions {
  LocalObservationDateTime: string;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number;
  HasPrecipitation: boolean;
  PrecipitationType?: string;
  IsDayTime: boolean;
  Temperature: {
    Metric: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
    Imperial: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
  };
  RealFeelTemperature: {
    Metric: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
    Imperial: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
  };
  RelativeHumidity: number;
  Wind: {
    Direction: {
      Degrees: number;
      Localized: string;
      English: string;
    };
    Speed: {
      Metric: {
        Value: number;
        Unit: string;
        UnitType: number;
      };
      Imperial: {
        Value: number;
        Unit: string;
        UnitType: number;
      };
    };
  };
  CloudCover: number;
  Pressure: {
    Metric: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
    Imperial: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
  };
}

export async function getLocationKey(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `${BASE_URL}/locations/v1/cities/geoposition/search?apikey=${ACCUWEATHER_API_KEY}&q=${lat},${lon}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`AccuWeather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.Key;
  } catch (error) {
    console.error('Error getting location key:', error);
    throw error;
  }
}

export async function getCurrentConditions(locationKey: string): Promise<CurrentConditions> {
  try {
    const response = await fetch(
      `${BASE_URL}/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&details=true`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    
    if (!response.ok) {
      throw new Error(`AccuWeather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error getting current conditions:', error);
    throw error;
  }
}

export function weatherIconToCondition(iconNumber: number): string {
  // Map AccuWeather icon numbers to our weather codes
  const iconMap: Record<number, string> = {
    1: 'clear', 2: 'clear', 3: 'partly_cloudy', 4: 'partly_cloudy',
    5: 'partly_cloudy', 6: 'cloudy', 7: 'cloudy', 8: 'cloudy',
    11: 'fog', 12: 'rain_light', 13: 'rain_light', 14: 'rain_moderate',
    15: 'storm', 16: 'storm', 17: 'storm', 18: 'rain_moderate',
    19: 'snow_light', 20: 'snow_light', 21: 'snow_light', 22: 'snow_moderate',
    23: 'snow_moderate', 24: 'snow_moderate', 25: 'snow_moderate', 26: 'rain_heavy',
    29: 'rain_moderate', 31: 'snow_moderate', 32: 'clear', 33: 'clear',
    34: 'partly_cloudy', 35: 'partly_cloudy', 36: 'partly_cloudy', 37: 'fog',
    38: 'cloudy', 39: 'rain_light', 40: 'rain_moderate', 41: 'storm',
    42: 'storm', 43: 'snow_light', 44: 'snow_moderate'
  };
  
  return iconMap[iconNumber] || 'cloudy';
}