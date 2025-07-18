// Global mock user storage
// In production, use a real database

interface MockUser {
  id: string;
  email: string;
  username: string;
  password: string;
  displayName?: string;
  totalXP: number;
  level: number;
  streak: number;
  reportsCount: number;
  predictionsCount: number;
  accuracyRate: number;
  lastActiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Use a global variable to persist users across API calls
declare global {
  var mockUsersStorage: Map<string, MockUser> | undefined;
}

// Initialize or use existing storage
export const mockUsers = global.mockUsersStorage || new Map<string, MockUser>();

// Persist the storage globally
if (!global.mockUsersStorage) {
  global.mockUsersStorage = mockUsers;
}

// Pre-populate with some demo users
if (mockUsers.size === 0) {
  const demoUsers = [
    {
      id: 'demo_user_1',
      email: 'demo@weather.com',
      username: 'DemoUser',
      password: '$2a$10$K.0Lb8YH7e8Ejp2Qq2YLw.TJa4AxlGh2S8lNlqYFKzO8IdCVKq0Qa', // password: demo123
      displayName: 'Demo User',
      totalXP: 2500,
      level: 3,
      streak: 5,
      reportsCount: 45,
      predictionsCount: 28,
      accuracyRate: 85.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  demoUsers.forEach(user => {
    mockUsers.set(user.id, user);
  });
}