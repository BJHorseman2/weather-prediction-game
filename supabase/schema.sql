-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_active_date TIMESTAMP WITH TIME ZONE,
  reports_count INTEGER DEFAULT 0,
  predictions_count INTEGER DEFAULT 0,
  accuracy_rate FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather reports table
CREATE TABLE IF NOT EXISTS weather_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location_name TEXT,
  weather_code TEXT NOT NULL,
  temperature FLOAT,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  xp_awarded INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  target_time TIMESTAMP WITH TIME ZONE NOT NULL,
  window_minutes INTEGER NOT NULL CHECK (window_minutes IN (15, 30, 60)),
  condition TEXT NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  actual_condition TEXT,
  accurate BOOLEAN,
  xp_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  xp_reward INTEGER NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL
);

-- User achievements junction table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Friends table
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly')),
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  badge_icon TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_total_xp ON users(total_xp DESC);
CREATE INDEX idx_weather_reports_user_id ON weather_reports(user_id);
CREATE INDEX idx_weather_reports_created_at ON weather_reports(created_at DESC);
CREATE INDEX idx_weather_reports_location ON weather_reports USING GIST(location);
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_target_time ON predictions(target_time);
CREATE INDEX idx_predictions_location ON predictions USING GIST(location);
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_status ON friends(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Weather reports are public to read
CREATE POLICY "Weather reports are public" ON weather_reports
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reports" ON weather_reports
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Predictions are public to read
CREATE POLICY "Predictions are public" ON predictions
  FOR SELECT USING (true);

CREATE POLICY "Users can create own predictions" ON predictions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Function to get nearby weather reports
CREATE OR REPLACE FUNCTION get_nearby_reports(
  user_lat FLOAT,
  user_lon FLOAT,
  radius_miles FLOAT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  username TEXT,
  latitude FLOAT,
  longitude FLOAT,
  location_name TEXT,
  weather_code TEXT,
  temperature FLOAT,
  description TEXT,
  xp_awarded INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  distance_miles FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wr.id,
    wr.user_id,
    u.username,
    wr.latitude,
    wr.longitude,
    wr.location_name,
    wr.weather_code,
    wr.temperature,
    wr.description,
    wr.xp_awarded,
    wr.created_at,
    ST_Distance(
      wr.location::geography,
      ST_MakePoint(user_lon, user_lat)::geography
    ) * 0.000621371 AS distance_miles
  FROM weather_reports wr
  JOIN users u ON wr.user_id = u.id
  WHERE ST_DWithin(
    wr.location::geography,
    ST_MakePoint(user_lon, user_lat)::geography,
    radius_miles * 1609.34 -- Convert miles to meters
  )
  ORDER BY wr.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;