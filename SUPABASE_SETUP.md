# Supabase Database Setup Guide

## Quick Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create new project:
   - Name: `weather-prediction-game`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
   - Plan: Free tier is fine

### 2. Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run"

### 3. Get Your API Keys

1. Go to **Settings** > **API**
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Update Environment Variables

Add to `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For Vercel deployment, add these in the Environment Variables section.

### 5. Enable Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

## Database Features

### Tables Created:
- `users` - User accounts with stats
- `weather_reports` - Crowdsourced weather data
- `predictions` - Weather predictions
- `achievements` - Unlockable achievements
- `user_achievements` - User's unlocked achievements
- `friends` - Social connections
- `challenges` - Daily/weekly challenges

### Special Features:
- **PostGIS** for location-based queries
- **Row Level Security** for data protection
- **Automatic timestamps** with triggers
- **Optimized indexes** for performance

### Built-in Functions:
- `get_nearby_reports()` - Efficiently find reports within X miles

## Testing the Connection

1. Start your dev server: `npm run dev`
2. Try creating an account
3. Submit a weather report
4. Check Supabase Dashboard > **Table Editor** to see data

## Production Considerations

### Security:
- ✅ Row Level Security (RLS) is enabled
- ✅ API keys are public (safe for frontend)
- ⚠️ Add rate limiting for production
- ⚠️ Consider adding Captcha for signup

### Performance:
- Free tier: 500MB database, 2GB bandwidth
- Indexes are optimized for common queries
- PostGIS enables efficient location searches

### Backup:
- Daily backups on paid plans
- Export data regularly on free tier

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the schema.sql file
- Check SQL Editor for any errors

### "permission denied" error
- RLS policies might be too restrictive
- Check Authentication > Policies

### Location queries not working
- Ensure PostGIS extension is enabled
- Check that location data is being stored

### Data not persisting
- Verify environment variables are correct
- Check Supabase Dashboard logs

## Next Steps

1. Test all features with real database
2. Set up email templates for auth
3. Configure backup strategy
4. Add monitoring/analytics
5. Consider upgrading for production traffic