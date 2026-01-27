# PeerLink Deployment Guide

## 🚀 Deployment Options

Your PeerLink application is ready to deploy! Here are the best options:

---

## ⭐ **Recommended: Railway** (Easiest & Free)

### Why Railway?
- ✅ **Free tier**: 500 hours/month + $5 free credit
- ✅ **Automatic deployments** from GitHub
- ✅ **Supports Docker** (both Java & Node.js)
- ✅ **Simple setup** (5 minutes)

### Steps:

1. **Push to GitHub** (if not done):
   ```bash
   git push -u origin main
   ```

2. **Go to Railway**:
   - Visit: https://railway.app
   - Sign up with GitHub

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `Prince200804/peerlink`

4. **Configure**:
   - Railway will auto-detect the Dockerfile
   - Add environment variables (if needed):
     - `PORT=8080` (backend)
   
5. **Deploy**:
   - Click "Deploy"
   - Wait 5-10 minutes for build
   - Railway will give you a URL like: `https://peerlink-production.up.railway.app`

6. **Update Frontend API URL**:
   - In Railway dashboard, note your backend URL
   - Update `ui/next.config.js` to point to Railway URL
   - Push changes and redeploy

---

## 🔵 **Option 2: Render** (Also Free)

### Why Render?
- ✅ **Free tier** for both services
- ✅ **Good for separate backend/frontend**
- ✅ **Automatic SSL**

### Steps:

1. **Go to Render**: https://render.com

2. **Deploy Backend**:
   - New → Web Service
   - Connect GitHub: `Prince200804/peerlink`
   - Settings:
     - **Name**: peerlink-backend
     - **Build Command**: `mvn clean package -DskipTests`
     - **Start Command**: `java -jar target/p2p-1.0-SNAPSHOT.jar`
     - **Environment**: Java
   - Create Web Service

3. **Deploy Frontend**:
   - New → Web Service
   - Same repo
   - Settings:
     - **Name**: peerlink-frontend
     - **Root Directory**: `ui`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node
   - Environment Variable:
     - `NEXT_PUBLIC_API_URL=https://peerlink-backend.onrender.com`
   - Create Web Service

4. **Access**: Use the frontend URL to access your app

---

## 🟢 **Option 3: DigitalOcean App Platform**

### Why DigitalOcean?
- ✅ **$5/month** basic plan
- ✅ **Reliable & fast**
- ✅ **Good documentation**

### Steps:

1. **Go to DigitalOcean**: https://www.digitalocean.com

2. **Create App**:
   - Apps → Create App
   - Connect GitHub: `Prince200804/peerlink`
   - Select branch: `main`

3. **Configure Components**:
   - DigitalOcean will detect both Node.js and Java
   - Backend: Port 8080
   - Frontend: Port 3000

4. **Deploy**: Click "Create Resources"

---

## 🔴 **Option 4: AWS (Advanced)**

### Why AWS?
- ✅ **Professional grade**
- ✅ **Scalable**
- ⚠️ More complex setup
- ⚠️ May require payment

### Services Needed:
- **AWS Elastic Beanstalk** (for Java backend)
- **AWS Amplify** (for Next.js frontend)

### Quick Steps:
1. Backend on Elastic Beanstalk:
   - Upload `target/p2p-1.0-SNAPSHOT.jar`
   - Select Java 17 environment
   
2. Frontend on Amplify:
   - Connect GitHub repo
   - Build settings: Auto-detected for Next.js

---

## 🟡 **Option 5: Heroku (Simple but Paid)**

⚠️ **Note**: Heroku removed free tier in 2022

### Steps:

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login**:
   ```bash
   heroku login
   ```

3. **Create Apps**:
   ```bash
   heroku create peerlink-backend
   heroku create peerlink-frontend
   ```

4. **Deploy Backend**:
   ```bash
   git subtree push --prefix=. heroku main
   ```

5. **Deploy Frontend**:
   ```bash
   cd ui
   git subtree push --prefix=ui heroku main
   ```

---

## 📊 **Comparison Table**

| Platform | Cost | Setup Time | Difficulty | Best For |
|----------|------|------------|------------|----------|
| **Railway** | Free ($5 credit) | 5 min | ⭐ Easy | Quick demos, testing |
| **Render** | Free | 10 min | ⭐⭐ Easy | Production apps |
| **DigitalOcean** | $5/mo | 15 min | ⭐⭐ Medium | Professional use |
| **AWS** | Pay-as-go | 30+ min | ⭐⭐⭐ Hard | Enterprise scale |
| **Heroku** | $7/mo | 10 min | ⭐⭐ Easy | Legacy preference |

---

## 🎯 **My Recommendation for You**

### **Start with Railway** because:
1. ✅ **Completely free** to start
2. ✅ **Single command deployment**
3. ✅ **Auto-detects Dockerfile**
4. ✅ **Perfect for learning**
5. ✅ **Easy to upgrade later**

### Then move to:
- **Render** when you need more control
- **DigitalOcean** when you need reliability
- **AWS** when you need to scale

---

## 🔧 **Important Configuration Changes**

### Before deploying, update these files:

1. **`ui/next.config.js`** - Update API URL:
   ```javascript
   const nextConfig = {
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/:path*',
         },
       ]
     },
   }
   ```

2. **Create `ui/.env.production`**:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

---

## 📝 **Post-Deployment Checklist**

- [ ] Backend is accessible at `/api/upload`
- [ ] Frontend loads correctly
- [ ] File upload works
- [ ] File download works
- [ ] 6-digit PIN system works
- [ ] CORS is configured correctly
- [ ] Test with different file types

---

## 🐛 **Common Issues**

### Issue: "Cannot connect to backend"
**Solution**: Update `NEXT_PUBLIC_API_URL` in frontend environment variables

### Issue: "Port already in use"
**Solution**: Change port in deployment settings (Railway/Render auto-assigns ports)

### Issue: "File upload fails"
**Solution**: Check backend logs, ensure CORS is enabled

---

## 🎉 **Quick Start Command (Railway)**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize and deploy
railway init
railway up
```

---

## 📞 **Need Help?**

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- DigitalOcean Docs: https://docs.digitalocean.com

---

**Good luck with your deployment! 🚀**
