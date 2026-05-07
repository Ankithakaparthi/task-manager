# Deployment Guide

## 🌐 Deploying to Production

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_url
   heroku config:set JWT_SECRET=your_strong_secret_key
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Check Logs**
   ```bash
   heroku logs --tail
   ```

### Backend Deployment (Render.com)

1. **Connect GitHub Repository**
   - Go to [Render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repo

2. **Configure Build Command**
   ```
   npm install
   ```

3. **Configure Start Command**
   ```
   node server.js
   ```

4. **Set Environment Variables in Render Dashboard**
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production

### Frontend Deployment (Vercel)

1. **Connect GitHub Repository**
   - Go to [Vercel.com](https://vercel.com)
   - Import your GitHub project
   - Select `/frontend` as root directory

2. **Set Environment Variables**
   ```
   REACT_APP_API_URL=your_backend_production_url
   ```

3. **Deploy**
   - Vercel will automatically deploy on push

### Frontend Deployment (Netlify)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Connect to Netlify**
   - Drag and drop `build` folder to [Netlify.com](https://netlify.com)
   - Or connect GitHub for automatic deployments

3. **Set Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`

4. **Set Environment Variables in Netlify**
   ```
   REACT_APP_API_URL=your_backend_production_url
   ```

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Create M0 (free tier) cluster
   - Choose region closest to your users

3. **Add Database User**
   - Create username and password
   - Note these for connection string

4. **Whitelist IP**
   - Add your deployment service IP to network access

5. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name
   ```

6. **Update Backend `.env`**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
   ```

## 🔒 Production Checklist

### Backend
- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Set `NODE_ENV=production`
- [ ] Enable MongoDB authentication
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure CORS for frontend domain
- [ ] Enable rate limiting
- [ ] Set up error logging (e.g., Sentry)
- [ ] Add input validation
- [ ] Remove console.logs for sensitive data
- [ ] Set up database backups

### Frontend
- [ ] Build optimized production bundle
- [ ] Update `REACT_APP_API_URL` to production backend
- [ ] Enable HTTPS
- [ ] Set up analytics (optional)
- [ ] Configure CSP headers
- [ ] Enable gzip compression
- [ ] Set cache headers appropriately
- [ ] Test on real devices/browsers

## 📊 Performance Optimization

### Backend
```javascript
// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// Add compression
const compression = require('compression');
app.use(compression());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### Frontend
- Lazy load components with React.lazy()
- Minimize bundle size
- Enable gzip compression
- Use CDN for static assets
- Optimize images
- Code splitting

## 🆘 Troubleshooting Deployment

### Issue: Heroku Build Fails
```bash
# Check build logs
heroku logs --tail

# Rebuild
git push heroku main --force
```

### Issue: MongoDB Connection Fails
- Verify connection string
- Check IP whitelist
- Ensure user has correct permissions
- Test connection locally first

### Issue: CORS Errors in Production
```javascript
// Update backend CORS
const corsOptions = {
  origin: 'https://your-frontend-domain.com',
  credentials: true
};
app.use(cors(corsOptions));
```

### Issue: 404 on Frontend Routes
Set up Netlify/Vercel redirect rules:
```json
{
  "redirects": [
    {
      "from": "/*",
      "to": "/index.html",
      "status": 200
    }
  ]
}
```

## 📈 Monitoring

### Backend Monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor API response times
- Track database performance
- Set up uptime monitoring

### Frontend Monitoring
- Set up analytics (Google Analytics, Mixpanel)
- Monitor error rates
- Track user engagement
- Monitor performance metrics

## 🔐 Security in Production

1. **Use HTTPS everywhere**
2. **Enable HSTS headers**
3. **Implement CSRF protection**
4. **Use secure cookies (httpOnly, Secure, SameSite)**
5. **Implement rate limiting**
6. **Enable CORS properly**
7. **Use environment variables for secrets**
8. **Keep dependencies updated**
9. **Enable MongoDB authentication**
10. **Use strong JWT_SECRET**

## 🚀 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

---

**Need help?** Contact support or check the documentation!
