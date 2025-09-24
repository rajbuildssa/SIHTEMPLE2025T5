# 🚀 Render Deployment Setup

Your project is now ready for Render deployment! Here's what I've configured:

## ✅ Files Created/Updated:
- `render.yaml` - Render configuration
- `server/package.json` - Already properly configured
- `server/index.js` - Already configured for production

## 🚀 Deploy to Render:

### Step 1: Go to Render.com
1. Visit [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Connect Repository
1. Connect your GitHub repository: `SIHTEMPLE2025`
2. Select the repository

### Step 3: Configure Service
Use these exact settings:
- **Name**: `sihtemple-backend`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: `18`

### Step 4: Environment Variables
Add these in Render dashboard:
- `NODE_ENV` = `production`
- `MONGO_URI` = `your-mongodb-atlas-connection-string`
- `PORT` = `10000` (optional, Render sets this automatically)

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Copy your service URL (e.g., `https://sihtemple-backend-xxxx.onrender.com`)

## 🔄 After Deployment:

### Update Frontend API URL
Once you get your Render URL, update your frontend:

1. **Go to your frontend Vercel project**
2. **Go to Settings → Environment Variables**
3. **Update `VITE_API_URL`** to your new Render URL
4. **Redeploy frontend**

### Test the API
Visit: `https://your-render-url.onrender.com/api/temples`

## 🎯 Benefits of Render:
- ✅ No 401 authentication issues
- ✅ Better for Node.js APIs
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Better CORS handling

## 📝 Next Steps:
1. Deploy to Render using the steps above
2. Get your Render URL
3. Update frontend environment variables
4. Test temples loading

Your project is now fully configured for Render deployment! 🚀
