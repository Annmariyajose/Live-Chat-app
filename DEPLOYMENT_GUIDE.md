# Deployment Guide

Complete guide for deploying ChatFlow to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Build succeeds without errors
- [ ] Environment variables configured
- [ ] Backend API deployed (if using)
- [ ] Database set up (if using)
- [ ] Domain name ready (optional)

## 🚀 Deployment Options

### 1. Vercel (Recommended - Easiest)

Vercel is perfect for React applications with zero configuration.

#### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

3. **Configure Environment Variables** (if needed)
   - Go to Project Settings → Environment Variables
   - Add your variables:
     ```
     VITE_API_URL=https://your-api.com
     VITE_SOCKET_URL=wss://your-api.com
     ```

4. **Custom Domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

**Vercel CLI Alternative:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

### 2. Netlify

Great alternative to Vercel with similar ease of use.

#### Steps:

1. **Push to GitHub** (if not already done)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect to GitHub
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Configure Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add variables:
     ```
     VITE_API_URL=https://your-api.com
     ```

**Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**netlify.toml Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### 3. GitHub Pages

Free hosting directly from your GitHub repository.

#### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update vite.config.ts**
   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // Important!
   });
   ```

3. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: gh-pages branch
   - Save

Your site will be at: `https://username.github.io/repo-name/`

---

### 4. AWS Amplify

Enterprise-grade hosting with AWS infrastructure.

#### Steps:

1. **Push to GitHub**

2. **Deploy with Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect to GitHub
   - Select repository and branch
   - Configure build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```
   - Click "Save and deploy"

3. **Add Environment Variables**
   - Go to App Settings → Environment variables
   - Add your variables

---

### 5. Railway

Modern platform for full-stack applications.

#### Steps:

1. **Push to GitHub**

2. **Deploy with Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects build settings
   - Click "Deploy"

3. **Configure**
   - Add environment variables in Settings
   - Configure custom domain if desired

---

### 6. Render

Free tier available with automatic deploys.

#### Steps:

1. **Push to GitHub**

2. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect GitHub repository
   - Configure:
     - Build Command: `npm run build`
     - Publish Directory: `dist`
   - Click "Create Static Site"

**render.yaml:**
```yaml
services:
  - type: web
    name: chatflow
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

### 7. Docker + Any Platform

Deploy as a Docker container to any platform.

#### Dockerfile:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-backend-url;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Build and Run:

```bash
# Build image
docker build -t chatflow .

# Run container
docker run -p 80:80 chatflow

# Push to Docker Hub
docker tag chatflow username/chatflow
docker push username/chatflow
```

---

## 🔧 Backend Deployment

### Node.js + PostgreSQL Stack

#### Heroku:

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create chatflow-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

#### Railway (Backend):

1. Create new project
2. Add PostgreSQL database
3. Deploy from GitHub
4. Railway automatically sets DATABASE_URL

#### Docker Compose (Full Stack):

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:3000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/chatflow
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=chatflow
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

---

## 🔐 Environment Variables

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=wss://api.yourdomain.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_FILE_UPLOAD=true

# External Services
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
```

### Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Security
JWT_SECRET=your-super-secret-key-min-32-characters
SESSION_SECRET=another-secret-key

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/uploads
AWS_S3_BUCKET=your-bucket

# External Services
REDIS_URL=redis://host:6379
SENDGRID_API_KEY=your-api-key
```

---

## 📊 Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### Enable Gzip Compression

Most platforms enable this automatically, but for nginx:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### CDN Setup

Use Cloudflare for free CDN:
1. Add your site to Cloudflare
2. Update DNS records
3. Enable caching rules
4. Enable minification

---

## 🧪 Post-Deployment Testing

### Checklist:

- [ ] All pages load correctly
- [ ] API calls work
- [ ] WebSocket connections establish
- [ ] Images load
- [ ] Responsive design works
- [ ] No console errors
- [ ] SSL certificate valid
- [ ] Performance metrics acceptable

### Tools:

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [GTmetrix](https://gtmetrix.com)
- [WebPageTest](https://www.webpagetest.org)

---

## 🔄 Continuous Deployment

### GitHub Actions

**.github/workflows/deploy.yml:**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📱 Mobile App Deployment

If you want to create mobile apps:

### React Native Version

See separate guide for converting to React Native.

### PWA (Progressive Web App)

Add PWA support to make it installable:

```javascript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ChatFlow',
        short_name: 'ChatFlow',
        description: 'Real-time chat application',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

---

## 🆘 Troubleshooting

### Issue: Environment variables not working
- Ensure they're prefixed with `VITE_`
- Restart dev server after adding variables
- Check they're set in deployment platform

### Issue: Routes not working (404)
- Add rewrite rules to serve index.html
- Check base path in vite.config.ts

### Issue: Build fails
- Check Node version matches
- Clear cache: `rm -rf node_modules dist`
- Reinstall: `npm install`

---

## 📞 Support

For deployment issues:
- Check platform-specific documentation
- Review deployment logs
- Open an issue on GitHub

---

Happy deploying! 🚀
