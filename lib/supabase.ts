import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DBUser {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  total_xp: number;
  level: number;
  streak: number;
  last_active_date?: string;
  reports_count: number;
  predictions_count: number;
  accuracy_rate: number;
  created_at: string;
  updated_at: string;
}

export interface DBWeatherReport {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  weather_code: string;
  temperature?: number;
  description?: string;
  verified: boolean;
  xp_awarded: number;
  created_at: string;
  user?: {
    username: string;
  };
}

export interface DBPrediction {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  target_time: string;
  window_minutes: number;
  condition: string;
  confidence: number;
  actual_condition?: string;
  accurate?: boolean;
  xp_awarded: number;
  created_at: string;
  resolved_at?: string;
}