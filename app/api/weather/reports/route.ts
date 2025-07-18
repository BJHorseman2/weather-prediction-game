import { NextRequest, NextResponse } from 'next/server';
import { getNearbyReports, addWeatherReport } from '@/lib/mockWeatherReports';
import { mockUsers } from '@/lib/mockUsers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'weather-game-secret-2024';

// GET nearby weather reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const radius = searchParams.get('radius') || '10';
    
    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }
    
    const nearbyReports = getNearbyReports(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(radius)
    );
    
    // Limit to most recent 20 reports
    const recentReports = nearbyReports.slice(0, 20);
    
    return NextResponse.json({
      reports: recentReports,
      count: recentReports.length,
      radius: parseFloat(radius)
    });
    
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather reports' },
      { status: 500 }
    );
  }
}

// POST new weather report
export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    let userId: string;
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get user
    const user = mockUsers.get(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get report data
    const { latitude, longitude, locationName, weatherCode, temperature, description } = await request.json();
    
    // Validate required fields
    if (!latitude || !longitude || !weatherCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Calculate XP based on report completeness
    let xpAwarded = 10; // Base XP
    if (temperature !== undefined) xpAwarded += 5;
    if (description) xpAwarded += 5;
    
    // Create report
    const report = addWeatherReport({
      userId,
      username: user.username,
      latitude,
      longitude,
      locationName: locationName || 'Unknown Location',
      weatherCode,
      temperature,
      description,
      xpAwarded
    });
    
    // Update user stats
    user.totalXP += xpAwarded;
    user.reportsCount += 1;
    user.level = Math.floor(user.totalXP / 1000) + 1;
    user.updatedAt = new Date().toISOString();
    mockUsers.set(userId, user);
    
    return NextResponse.json({
      report,
      user: {
        totalXP: user.totalXP,
        level: user.level,
        reportsCount: user.reportsCount
      }
    });
    
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create weather report' },
      { status: 500 }
    );
  }
}