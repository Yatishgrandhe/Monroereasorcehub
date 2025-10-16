# Deployment Guide - Monroe Resource Hub

## 🚀 Vercel Deployment

### Prerequisites
- GitHub repository: `https://github.com/Yatishgrandhe/Monroereasorcehub.git`
- Vercel account
- Supabase project
- Google AI API key (for Gemini)

### Step 1: Deploy to Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import the repository: `Yatishgrandhe/Monroereasorcehub`

2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 2: Environment Variables

Add these environment variables in Vercel dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google AI (Gemini) Configuration
GOOGLE_AI_API_KEY=your_gemini_api_key

# Optional: Custom Domain
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 3: Supabase Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down your project URL and API keys

2. **Database Schema**:
   - Run the SQL migrations from the database setup
   - Enable Row Level Security (RLS)
   - Configure authentication providers

3. **Storage Setup**:
   - Create storage buckets for file uploads
   - Configure CORS settings

### Step 4: Google AI Setup

1. **Get API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new API key
   - Add to Vercel environment variables

### Step 5: Domain Configuration

1. **Custom Domain** (Optional):
   - Add your domain in Vercel dashboard
   - Configure DNS settings
   - Enable SSL certificate

2. **Environment Variables**:
   - Update `NEXT_PUBLIC_APP_URL` with your domain

## 🔧 Configuration Files

### vercel.json
The project includes a `vercel.json` configuration file with:
- Build and deployment settings
- Security headers
- API route configuration
- Redirects

### next.config.js
Next.js configuration includes:
- Image domain configuration
- CORS headers
- Turbopack settings

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user interactions

### Error Monitoring
- Consider adding Sentry for error tracking
- Monitor API route performance
- Set up alerts for critical issues

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive keys to repository
- Use Vercel's environment variable system
- Rotate API keys regularly

### Headers & CORS
- Security headers configured in `vercel.json`
- CORS properly configured for API routes
- Content Security Policy (CSP) headers

### Database Security
- Row Level Security (RLS) enabled
- Proper authentication flows
- API rate limiting

## 🚀 Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables configured
- [ ] Supabase project set up
- [ ] Database schema deployed
- [ ] Google AI API key configured
- [ ] Build successful on Vercel
- [ ] Domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Error monitoring set up

## 🔄 Continuous Deployment

The project is configured for automatic deployments:
- Push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on build failures

## 📞 Support

For deployment issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with production build
4. Contact development team

## 🎯 Performance Optimization

### Build Optimization
- Static generation for static pages
- Dynamic imports for large components
- Image optimization with Next.js Image component

### Runtime Optimization
- API route caching
- Database query optimization
- CDN for static assets

---

**Deployment Status**: ✅ Ready for Production
**Last Updated**: October 2024
