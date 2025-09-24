# Deploy Backend to Render

## Steps to Deploy:

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 2. Connect Your Repository
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select your repository: `SIHTEMPLE2025`

### 3. Configure the Service
- **Name**: `sihtemple-backend`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: `18` (or latest)

### 4. Environment Variables
Add these environment variables in Render:
- `NODE_ENV` = `production`
- `MONGO_URI` = `your-mongodb-atlas-connection-string`

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Copy the service URL (e.g., `https://sihtemple-backend.onrender.com`)

### 6. Update Frontend
Update your frontend's `VITE_API_URL` to point to your new Render URL:
```
VITE_API_URL=https://sihtemple-backend.onrender.com
```

## Benefits of Render:
- ✅ No authentication issues
- ✅ Better for Node.js APIs
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Better CORS handling

## After Deployment:
1. Test the API: `https://your-render-url.onrender.com/api/temples`
2. Update frontend environment variables
3. Redeploy frontend
4. Test temples loading
