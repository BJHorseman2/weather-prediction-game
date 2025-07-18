// US National Weather Service API (weather.gov)
// Free, no API key required, US only

export interface WeatherGovObservation {
  properties: {
    timestamp: string;
    textDescription: string;
    icon: string;
    temperature: {
      value: number | null;
      unitCode: string;
    };
    dewpoint: {
      value: number | null;
      unitCode: string;
    };
    windDirection: {
      value: number | null;
      unitCode: string;
    };
    windSpeed: {
      value: number | null;
      unitCode: string;
    };
    windGust: {
      value: number | null;
      unitCode: string;
    };
    barometricPressure: {
      value: number | null;
      unitCode: string;
    };
    relativeHumidity: {
      value: number | null;
      unitCode: string;
    };
    heatIndex: {
      value: number | null;
      unitCode: string;
    };
    windChill: {
      value: number | null;
      unitCode: string;
    };
    visibility: {
      value: number | null;
      unitCode: string;
    };
    precipitationLastHour: {
      value: number | null;
      unitCode: string;
    };
  };
}

export async function getWeatherGovData(lat: number, lon: number) {
  try {
    // Get grid point
    const pointResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    if (!pointResponse.ok) throw new Error('Failed to get grid point');
    const pointData = await pointResponse.json();
    
    // Get observation stations
    const stationsResponse = await fetch(pointData.properties.observationStations);
    if (!stationsResponse.ok) throw new Error('Failed to get stations');
    const stationsData = await stationsResponse.json();
    
    if (!stationsData.features || stationsData.features.length === 0) {
      throw new Error('No observation stations found');
    }
    
    // Get latest observation from nearest station
    const stationId = stationsData.features[0].properties.stationIdentifier;
    const obsResponse = await fetch(`https://api.weather.gov/stations/${stationId}/observations/latest`);
    if (!obsResponse.ok) throw new Error('Failed to get observations');
    const obsData: WeatherGovObservation = await obsResponse.json();
    
    return {
      observation: obsData,
      location: {
        city: pointData.properties.relativeLocation.properties.city,
        state: pointData.properties.relativeLocation.properties.state,
      },
      stationId
    };
  } catch (error) {
    console.error('Weather.gov API error:', error);
    throw error;
  }
}

export function weatherGovIconToCondition(iconUrl: string | null): string {
  if (!iconUrl) return 'cloudy';
  
  // Parse weather.gov icon URLs
  if (iconUrl.includes('skc')) return 'clear';
  if (iconUrl.includes('few') || iconUrl.includes('sct')) return 'partly_cloudy';
  if (iconUrl.includes('bkn') || iconUrl.includes('ovc')) return 'cloudy';
  if (iconUrl.includes('rain') || iconUrl.includes('shra')) return 'rain_moderate';
  if (iconUrl.includes('tsra')) return 'storm';
  if (iconUrl.includes('snow')) return 'snow_moderate';
  if (iconUrl.includes('fog')) return 'fog';
  
  return 'cloudy';
}