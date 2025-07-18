import { NextResponse } from 'next/server';

export async function GET() {
  // Test with weather.gov API (US National Weather Service - no key required)
  const lat = 40.7128;
  const lon = -74.0060;
  
  try {
    // First get the grid point
    const pointResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    const pointData = await pointResponse.json();
    
    if (!pointResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to get grid point',
        status: pointResponse.status,
        data: pointData 
      });
    }
    
    // Get the forecast
    const forecastResponse = await fetch(pointData.properties.forecast);
    const forecastData = await forecastResponse.json();
    
    // Get observations from nearest station
    const stationsResponse = await fetch(pointData.properties.observationStations);
    const stationsData = await stationsResponse.json();
    
    if (stationsData.features && stationsData.features.length > 0) {
      const stationId = stationsData.features[0].properties.stationIdentifier;
      const obsResponse = await fetch(`https://api.weather.gov/stations/${stationId}/observations/latest`);
      const obsData = await obsResponse.json();
      
      const tempC = obsData.properties.temperature.value;
      const tempF = tempC ? Math.round(tempC * 9/5 + 32) : null;
      
      return NextResponse.json({
        success: true,
        location: {
          city: pointData.properties.relativeLocation.properties.city,
          state: pointData.properties.relativeLocation.properties.state,
        },
        current: {
          temperature: tempF,
          temperatureC: tempC,
          description: obsData.properties.textDescription,
          humidity: obsData.properties.relativeHumidity.value,
          windSpeed: obsData.properties.windSpeed.value ? Math.round(obsData.properties.windSpeed.value * 2.237) : null,
          windDirection: obsData.properties.windDirection.value,
          pressure: obsData.properties.barometricPressure.value,
          timestamp: obsData.properties.timestamp,
          station: stationId
        },
        forecast: forecastData.properties.periods[0]
      });
    }
    
    return NextResponse.json({ 
      error: 'No observation stations found',
      pointData: pointData.properties.relativeLocation
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    });
  }
}