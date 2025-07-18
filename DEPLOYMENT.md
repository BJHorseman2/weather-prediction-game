# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BJHorseman2/weather-prediction-game)

## Manual Deployment Steps

### 1. Prerequisites
- Vercel account (free tier works)
- GitHub repository connected
- Domain name (optional)

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import from GitHub: `BJHorseman2/weather-prediction-game`
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### 3. Environment Variables

Add these in Vercel Dashboard > Settings > Environment Variables:

```bash
# Required for authentication
JWT_SECRET=your-secure-random-string-here

# Optional - for AccuWeather API
ACCUWEATHER_API_KEY=your-accuweather-key
NEXT_PUBLIC_ACCUWEATHER_API_KEY=your-accuweather-key

# App URL (will be set automatically by Vercel)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. Deploy

Click "Deploy" and wait for the build to complete (usually 1-2 minutes).

### 5. Custom Domain (Optional)

1. Go to Settings > Domains
2. Add your domain
3. Follow Vercel's DNS configuration instructions
4. SSL certificate is automatic

## Important Notes

### Data Storage
- The app uses in-memory storage for demo purposes
- Data will reset when the serverless functions restart
- For production, connect a real database (PostgreSQL recommended)

### Weather APIs
- US locations work without API keys (uses weather.gov)
- For global coverage, add AccuWeather API key
- OpenWeatherMap can be used as fallback

### Performance
- Enable Vercel Analytics for monitoring
- Consider upgrading to Pro for better performance
- Edge functions available for lower latency

## Post-Deployment

1. Test authentication flow
2. Verify weather data is loading
3. Check that reports can be submitted
4. Test on mobile devices
5. Monitor error logs in Vercel dashboard

## Troubleshooting

### "Module not found" errors
- Clear cache and redeploy
- Check all dependencies are in package.json

### API routes returning 500
- Check environment variables are set
- View function logs in Vercel dashboard

### Weather data not loading
- Verify API keys if using AccuWeather
- Check browser location permissions

## Support

- GitHub Issues: https://github.com/BJHorseman2/weather-prediction-game/issues
- Vercel Docs: https://vercel.com/docs