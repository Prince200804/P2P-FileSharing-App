# Render Deployment - Two Services

## Step 1: Deploy Backend

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo: `P2P-FileSharing-App`
4. Settings:
   - **Name**: `peerlink-backend`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile.backend`
   - **Region**: Choose closest to you
5. Click **"Create Web Service"**
6. Wait for deployment to complete
7. **COPY THE BACKEND URL** (e.g., `https://peerlink-backend.onrender.com`)

## Step 2: Deploy Frontend

1. Click **"New +"** → **"Web Service"**
2. Connect same repo: `P2P-FileSharing-App`
3. Settings:
   - **Name**: `peerlink-frontend`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile.frontend`
   - **Region**: Same as backend
   
4. **IMPORTANT: Add Docker Build Arguments**:
   - Scroll down to **"Docker Build Arguments"** section
   - Add:
     - Key: `BACKEND_URL`
     - Value: `https://peerlink-backend.onrender.com` (your backend URL from Step 1)

5. **Add Environment Variable** (same value):
   - Key: `BACKEND_URL`
   - Value: `https://peerlink-backend.onrender.com`

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for build

## Step 3: Access Your App

- Use the **frontend URL**: `https://peerlink-frontend.onrender.com`
- Backend runs on: `https://peerlink-backend.onrender.com`

## Important Notes:

- ⚠️ The **BACKEND_URL must be set as a Docker Build Argument** (not just env var)
- ⚠️ Make sure backend is fully deployed before deploying frontend
- ⚠️ Free tier spins down after 15 min of inactivity - first request takes 30-60 seconds

## Done! ✅

Your app is now deployed with backend and frontend as separate services.
