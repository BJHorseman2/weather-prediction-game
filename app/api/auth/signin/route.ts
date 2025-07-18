import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockUsers } from '@/lib/mockUsers';

const JWT_SECRET = process.env.JWT_SECRET || 'weather-game-secret-2024';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in mock storage
    const user = Array.from(mockUsers.values()).find(u => u.email === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last active date and check streak
    const lastActive = user.lastActiveDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let newStreak = user.streak || 0;
    
    if (lastActive) {
      const lastActiveDate = new Date(lastActive);
      lastActiveDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increase streak
        newStreak = (user.streak || 0) + 1;
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1;
      }
      // If daysDiff === 0, user already logged in today, keep streak
    } else {
      // First login
      newStreak = 1;
    }

    // Update user in mock storage
    user.lastActiveDate = new Date().toISOString();
    user.streak = newStreak;
    user.updatedAt = new Date().toISOString();
    mockUsers.set(user.id, user);

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Sign in successful',
      token,
      user: {
        ...userWithoutPassword,
        streak: newStreak
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { message: 'Failed to sign in' },
      { status: 500 }
    );
  }
}