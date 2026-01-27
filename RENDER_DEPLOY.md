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
6. **COPY THE URL** (e.g., `https://peerlink-backend.onrender.com`)

## Step 2: Deploy Frontend

1. Click **"New +"** → **"Web Service"**
2. Connect same repo: `P2P-FileSharing-App`
3. Settings:
   - **Name**: `peerlink-frontend`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile.frontend`
   - **Region**: Same as backend
4. **Add Environment Variable**:
   - Key: `BACKEND_URL`
   - Value: `https://peerlink-backend.onrender.com` (from Step 1)
5. Click **"Create Web Service"**

## Step 3: Access Your App

- Use the **frontend URL**: `https://peerlink-frontend.onrender.com`
- Backend runs on: `https://peerlink-backend.onrender.com`

## Done! ✅

Your app is now deployed with backend and frontend as separate services.

**Note:** Free tier on Render spins down after 15 min of inactivity. First request may take 30-60 seconds.
