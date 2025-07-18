import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ACCUWEATHER_API_KEY;
  
  // Test with New York coordinates
  const lat = 40.7128;
  const lon = -74.0060;
  
  try {
    // Test location API
    const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${lon}`;
    console.log('Testing location API:', locationUrl.replace(apiKey!, 'API_KEY_HIDDEN'));
    
    const locationResponse = await fetch(locationUrl);
    const locationData = await locationResponse.json();
    
    if (!locationResponse.ok) {
      return NextResponse.json({
        error: 'Location API failed',
        status: locationResponse.status,
        data: locationData,
        apiKeyLength: apiKey?.length,
        apiKeyPrefix: apiKey?.substring(0, 4)
      });
    }
    
    // Test current conditions API
    const conditionsUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationData.Key}?apikey=${apiKey}&details=true`;
    const conditionsResponse = await fetch(conditionsUrl);
    const conditionsData = await conditionsResponse.json();
    
    if (!conditionsResponse.ok) {
      return NextResponse.json({
        error: 'Conditions API failed',
        status: conditionsResponse.status,
        data: conditionsData
      });
    }
    
    return NextResponse.json({
      success: true,
      location: {
        key: locationData.Key,
        name: locationData.LocalizedName,
        country: locationData.Country.LocalizedName,
        region: locationData.AdministrativeArea.LocalizedName
      },
      conditions: conditionsData[0],
      temperature: {
        fahrenheit: conditionsData[0].Temperature.Imperial.Value,
        celsius: conditionsData[0].Temperature.Metric.Value
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'API test failed',
      message: error.message,
      stack: error.stack
    });
  }
}