import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock data for demo
const MOCK_LEADERBOARD = [
  {
    id: '1',
    username: 'WeatherMaster',
    displayName: 'Weather Master',
    totalXP: 15420,
    level: 15,
    reportsCount: 342,
    predictionsCount: 189,
    accuracyRate: 92.5
  },
  {
    id: '2',
    username: 'StormChaser23',
    displayName: 'Storm Chaser',
    totalXP: 13850,
    level: 14,
    reportsCount: 298,
    predictionsCount: 156,
    accuracyRate: 88.3
  },
  {
    id: '3',
    username: 'CloudReader',
    displayName: 'Cloud Reader',
    totalXP: 12100,
    level: 12,
    reportsCount: 256,
    predictionsCount: 143,
    accuracyRate: 85.7
  },
  {
    id: '4',
    username: 'RainPredictor',
    displayName: 'Rain Predictor',
    totalXP: 9875,
    level: 10,
    reportsCount: 198,
    predictionsCount: 112,
    accuracyRate: 81.2
  },
  {
    id: '5',
    username: 'SkyWatcher',
    displayName: 'Sky Watcher',
    totalXP: 8230,
    level: 8,
    reportsCount: 165,
    predictionsCount: 89,
    accuracyRate: 79.5
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || 'weekly';
    
    // For demo, return mock data
    // In production, you would query the database with date filters
    
    let entries = [...MOCK_LEADERBOARD];
    
    // Simulate different data for different timeframes
    if (timeframe === 'daily') {
      entries = entries.map(entry => ({
        ...entry,
        totalXP: Math.floor(entry.totalXP * 0.1),
        reportsCount: Math.floor(entry.reportsCount * 0.05),
        predictionsCount: Math.floor(entry.predictionsCount * 0.05)
      }));
    } else if (timeframe === 'weekly') {
      entries = entries.map(entry => ({
        ...entry,
        totalXP: Math.floor(entry.totalXP * 0.3),
        reportsCount: Math.floor(entry.reportsCount * 0.2),
        predictionsCount: Math.floor(entry.predictionsCount * 0.2)
      }));
    }
    
    // Sort by XP
    entries.sort((a, b) => b.totalXP - a.totalXP);
    
    return NextResponse.json({
      timeframe,
      entries,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}