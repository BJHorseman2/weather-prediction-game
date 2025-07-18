import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { mockUsers } from '@/lib/mockUsers';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists in mock storage
    const existingUserByEmail = Array.from(mockUsers.values()).find(u => u.email === email);
    const existingUserByUsername = Array.from(mockUsers.values()).find(u => u.username === username);

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 400 }
      );
    }

    if (existingUserByUsername) {
      return NextResponse.json(
        { message: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      displayName: username,
      totalXP: 0,
      level: 1,
      streak: 0,
      reportsCount: 0,
      predictionsCount: 0,
      accuracyRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store user in mock database
    mockUsers.set(userId, user);

    // Return success (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Account created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Failed to create account' },
      { status: 500 }
    );
  }
}