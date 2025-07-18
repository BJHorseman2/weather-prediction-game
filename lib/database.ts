import { supabase } from './supabase';
import { mockUsers } from './mockUsers';
import { mockWeatherReports, getNearbyReports as getMockNearbyReports } from './mockWeatherReports';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// User operations
export const database = {
  users: {
    async create(userData: any) {
      if (!isSupabaseConfigured()) {
        // Use mock storage
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const user = {
          id: userId,
          ...userData,
          total_xp: 0,
          level: 1,
          streak: 0,
          reports_count: 0,
          predictions_count: 0,
          accuracy_rate: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockUsers.set(userId, user);
        return { data: user, error: null };
      }

      // Use Supabase
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
      
      return { data, error };
    },

    async findByEmail(email: string) {
      if (!isSupabaseConfigured()) {
        const user = Array.from(mockUsers.values()).find(u => u.email === email.toLowerCase());
        return { data: user || null, error: null };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();
      
      return { data, error };
    },

    async findByUsername(username: string) {
      if (!isSupabaseConfigured()) {
        const user = Array.from(mockUsers.values()).find(u => u.username === username);
        return { data: user || null, error: null };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      return { data, error };
    },

    async update(userId: string, updates: any) {
      if (!isSupabaseConfigured()) {
        const user = mockUsers.get(userId);
        if (user) {
          Object.assign(user, updates, { updated_at: new Date().toISOString() });
          mockUsers.set(userId, user);
        }
        return { data: user, error: null };
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      return { data, error };
    },

    async getLeaderboard(timeframe: 'daily' | 'weekly' | 'alltime') {
      if (!isSupabaseConfigured()) {
        // Return mock leaderboard
        let users = Array.from(mockUsers.values());
        
        // Simulate different timeframes
        if (timeframe === 'daily') {
          users = users.map(u => ({ ...u, total_xp: Math.floor(u.totalXP * 0.1) }));
        } else if (timeframe === 'weekly') {
          users = users.map(u => ({ ...u, total_xp: Math.floor(u.totalXP * 0.3) }));
        }
        
        users.sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
        return { data: users.slice(0, 10), error: null };
      }

      // For Supabase, we'd need to implement time-based filtering
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(10);
      
      return { data, error };
    }
  },

  weatherReports: {
    async create(reportData: any) {
      if (!isSupabaseConfigured()) {
        // Use mock storage
        const report = {
          id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...reportData,
          created_at: new Date().toISOString()
        };
        mockWeatherReports.push(report);
        return { data: report, error: null };
      }

      // Use Supabase with PostGIS
      const { data, error } = await supabase
        .from('weather_reports')
        .insert({
          ...reportData,
          location: `POINT(${reportData.longitude} ${reportData.latitude})`
        })
        .select()
        .single();
      
      return { data, error };
    },

    async getNearby(lat: number, lon: number, radiusMiles: number = 10) {
      if (!isSupabaseConfigured()) {
        // Use mock function
        const reports = getMockNearbyReports(lat, lon, radiusMiles);
        return { data: reports, error: null };
      }

      // Use Supabase function
      const { data, error } = await supabase
        .rpc('get_nearby_reports', {
          user_lat: lat,
          user_lon: lon,
          radius_miles: radiusMiles
        });
      
      return { data, error };
    }
  },

  predictions: {
    async create(predictionData: any) {
      if (!isSupabaseConfigured()) {
        // For mock, just return success
        return { 
          data: { 
            id: `pred_${Date.now()}`, 
            ...predictionData,
            created_at: new Date().toISOString()
          }, 
          error: null 
        };
      }

      const { data, error } = await supabase
        .from('predictions')
        .insert({
          ...predictionData,
          location: `POINT(${predictionData.longitude} ${predictionData.latitude})`
        })
        .select()
        .single();
      
      return { data, error };
    }
  }
};