// Mock weather reports storage
// In production, use a real database with geospatial queries

export interface WeatherReport {
  id: string;
  userId: string;
  username: string;
  latitude: number;
  longitude: number;
  locationName: string;
  weatherCode: string;
  temperature?: number;
  description?: string;
  createdAt: string;
  xpAwarded: number;
}

// Global storage for weather reports
declare global {
  var mockWeatherReportsStorage: WeatherReport[] | undefined;
}

// Initialize or use existing storage
export const mockWeatherReports = global.mockWeatherReportsStorage || [];

// Persist the storage globally
if (!global.mockWeatherReportsStorage) {
  global.mockWeatherReportsStorage = mockWeatherReports;
}

// Calculate distance between two coordinates (in miles)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get reports within a certain radius (in miles)
export function getNearbyReports(centerLat: number, centerLon: number, radiusMiles: number = 10): WeatherReport[] {
  return mockWeatherReports.filter(report => {
    const distance = calculateDistance(centerLat, centerLon, report.latitude, report.longitude);
    return distance <= radiusMiles;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Add a new weather report
export function addWeatherReport(report: Omit<WeatherReport, 'id' | 'createdAt'>): WeatherReport {
  const newReport: WeatherReport = {
    ...report,
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  
  mockWeatherReports.push(newReport);
  return newReport;
}

// Pre-populate with some demo reports around common US cities
if (mockWeatherReports.length === 0) {
  const demoReports: Omit<WeatherReport, 'id' | 'createdAt'>[] = [
    // New York Area
    {
      userId: 'demo_user_1',
      username: 'NYWeatherFan',
      latitude: 40.7580,
      longitude: -73.9855,
      locationName: 'Times Square, Manhattan',
      weatherCode: 'partly_cloudy',
      temperature: 88,
      description: 'Hot and humid',
      xpAwarded: 15
    },
    {
      userId: 'demo_user_2',
      username: 'BrooklynSky',
      latitude: 40.6782,
      longitude: -73.9442,
      locationName: 'Brooklyn Heights',
      weatherCode: 'clear',
      temperature: 91,
      description: 'Sunny and hot',
      xpAwarded: 10
    },
    {
      userId: 'demo_user_3',
      username: 'QueensObserver',
      latitude: 40.7282,
      longitude: -73.7949,
      locationName: 'Flushing, Queens',
      weatherCode: 'cloudy',
      temperature: 86,
      description: 'Overcast but warm',
      xpAwarded: 20
    },
    // Los Angeles Area
    {
      userId: 'demo_user_4',
      username: 'LAWeatherWatch',
      latitude: 34.0522,
      longitude: -118.2437,
      locationName: 'Downtown LA',
      weatherCode: 'clear',
      temperature: 78,
      description: 'Perfect weather',
      xpAwarded: 10
    },
    {
      userId: 'demo_user_5',
      username: 'BeachWatcher',
      latitude: 33.9850,
      longitude: -118.4695,
      locationName: 'Venice Beach',
      weatherCode: 'fog',
      temperature: 68,
      description: 'Marine layer',
      xpAwarded: 25
    },
    // Chicago Area
    {
      userId: 'demo_user_6',
      username: 'WindyCityWeather',
      latitude: 41.8781,
      longitude: -87.6298,
      locationName: 'The Loop, Chicago',
      weatherCode: 'rain_light',
      temperature: 72,
      description: 'Light drizzle',
      xpAwarded: 20
    },
    // Miami Area
    {
      userId: 'demo_user_7',
      username: 'MiamiStorms',
      latitude: 25.7617,
      longitude: -80.1918,
      locationName: 'Downtown Miami',
      weatherCode: 'storm',
      temperature: 84,
      description: 'Afternoon thunderstorm',
      xpAwarded: 30
    },
    // Seattle Area
    {
      userId: 'demo_user_8',
      username: 'RainyDaySeattle',
      latitude: 47.6062,
      longitude: -122.3321,
      locationName: 'Capitol Hill, Seattle',
      weatherCode: 'rain_moderate',
      temperature: 62,
      description: 'Typical Seattle rain',
      xpAwarded: 15
    }
  ];

  // Add reports with timestamps spread over the last 2 hours
  demoReports.forEach((report, index) => {
    const minutesAgo = Math.floor(Math.random() * 120); // Random time in last 2 hours
    const timestamp = new Date(Date.now() - minutesAgo * 60000).toISOString();
    mockWeatherReports.push({
      ...report,
      id: `demo_report_${index + 1}`,
      createdAt: timestamp
    });
  });
}