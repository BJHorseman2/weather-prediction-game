import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: existingUser.email === email ? 'Email already in use' : 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        displayName: username
      }
    });

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
  } finally {
    await prisma.$disconnect();
  }
}