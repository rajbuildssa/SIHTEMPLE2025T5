# Vercel Deployment Guide for SIHTEMPLE2025

## 🚀 Deployment Steps

### 1. Frontend Deployment (Client)
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod
```

### 2. Backend Deployment (Server)
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Deploy to Vercel
npx vercel --prod
```

### 3. Environment Variables Setup

#### Frontend Environment Variables (Vercel Dashboard):
- `VITE_API_URL`: Your backend API URL
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

#### Backend Environment Variables (Vercel Dashboard):
- `MONGO_URI`: MongoDB connection string
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `CLERK_SECRET_KEY`: Clerk secret key
- `FRONTEND_URL`: Your frontend URL
- `EMAIL_USER`: Email service username
- `EMAIL_PASS`: Email service password

## 🔧 Configuration Files

### Root vercel.json
- Handles both frontend and backend routing
- API routes go to server
- All other routes go to frontend

### Client vercel.json
- Static build configuration
- SPA routing support

### Server vercel.json
- Node.js serverless function
- API endpoint configuration

## 🛠️ Build Commands

### Frontend Build:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

### Backend Build:
```json
{
  "scripts": {
    "build": "echo 'No build step required'"
  }
}
```

## 📁 Project Structure
```
SIHTEMPLE2025/
├── client/          # React frontend
├── server/          # Node.js backend
├── vercel.json      # Root deployment config
└── README.md
```

## 🌐 Deployment URLs
- Frontend: `https://sihtemple2025t5.vercel.app`
- Backend: `https://sihtemple2025t5-backend.vercel.app`

## ✅ Route Configuration
- All API routes (`/api/*`) → Backend
- All other routes → Frontend (SPA)
- Static assets served from frontend build
