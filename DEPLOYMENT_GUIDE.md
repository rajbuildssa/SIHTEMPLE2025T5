# 🚀 E-Darshan Deployment Guide - Vercel

This guide will help you deploy your E-Darshan Temple Booking System on Vercel with separate backend and frontend deployments.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account** - Your code should be in a GitHub repository
3. **MongoDB Atlas** - For production database
4. **Stripe Account** - For payment processing
5. **Gmail App Password** - For email functionality

## 🏗️ Project Structure

```
SIHTEMPLE2025/
├── client/          # Frontend (React + Vite)
│   ├── vercel.json
│   ├── package.json
│   └── ...
├── server/          # Backend (Node.js + Express)
│   ├── vercel.json
│   ├── package.json
│   └── ...
└── images/          # Shared assets
```

## 🎯 Deployment Steps

### Step 1: Prepare Your GitHub Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Ensure your repository structure is correct:**
   - `client/` folder contains frontend code
   - `server/` folder contains backend code
   - Both have their own `vercel.json` and `package.json`

### Step 2: Deploy Backend (Server) to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "New Project"**

3. **Import your GitHub repository**

4. **Configure Backend Project:**
   - **Project Name**: `sihtemple-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build` (or leave empty)
   - **Output Directory**: `.` (current directory)
   - **Install Command**: `npm install`

5. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

6. **Deploy the backend**

7. **Note the backend URL** (e.g., `https://sihtemple-backend.vercel.app`)

### Step 3: Deploy Frontend (Client) to Vercel

1. **Create another new project in Vercel**

2. **Import the same GitHub repository**

3. **Configure Frontend Project:**
   - **Project Name**: `sihtemple-frontend` (or your preferred name)
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables:**
   ```
   VITE_API_URL=https://sihtemple-backend.vercel.app
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   ```

5. **Deploy the frontend**

6. **Note the frontend URL** (e.g., `https://sihtemple-frontend.vercel.app`)

### Step 4: Update Backend CORS Settings

1. **Go to your backend Vercel project**

2. **Update the CORS configuration in `server/index.js`:**
   ```javascript
   app.use(cors({
     origin: [
       'https://sihtemple-frontend.vercel.app',
       'http://localhost:3000', // for local development
       'http://localhost:5173'  // for local development
     ],
     credentials: true
   }));
   ```

3. **Redeploy the backend**

## 🔧 Environment Variables Setup

### Backend Environment Variables (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection | `mongodb+srv://user:pass@cluster.mongodb.net/sihtemple` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `EMAIL_USER` | Gmail address | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `your-16-char-password` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |

### Frontend Environment Variables (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://sihtemple-backend.vercel.app` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` |

## 🎯 Setting Up Real Stripe Webhook

### Step 1: Create Stripe Webhook Endpoint

1. **Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)**

2. **Click "Add endpoint"**

3. **Configure the webhook:**
   - **Endpoint URL**: `https://sihtemple-backend.vercel.app/api/payments/webhook`
   - **Description**: `E-Darshan Booking Confirmation`

4. **Select Events to Listen For:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. **Click "Add endpoint"**

6. **Copy the Webhook Signing Secret** (starts with `whsec_`)

### Step 2: Update Environment Variables

1. **In your backend Vercel project, add:**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

2. **Redeploy the backend**

### Step 3: Test the Webhook

1. **Create a test booking with real payment**

2. **Check Stripe Dashboard → Webhooks → Your endpoint**

3. **Verify the webhook is receiving events**

4. **Check your email for confirmation**

## 📧 Email Configuration for Production

### Gmail Setup (Already Done)

Your email is already configured and working. For production:

1. **Use the same Gmail App Password**
2. **Consider using a dedicated email service** (SendGrid, Mailgun) for better deliverability
3. **Set up SPF, DKIM records** for your domain

## 🗄️ Database Setup

### MongoDB Atlas

1. **Create a MongoDB Atlas cluster**

2. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/sihtemple?retryWrites=true&w=majority
   ```

3. **Add to backend environment variables**

4. **Update connection in `server/index.js` if needed**

## 🔍 Testing Your Deployment

### Backend Testing

1. **Health Check:**
   ```bash
   curl https://sihtemple-backend.vercel.app/api/health
   ```

2. **Test Email:**
   ```bash
   curl -X POST https://sihtemple-backend.vercel.app/api/bookings/test-email \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

### Frontend Testing

1. **Visit your frontend URL**
2. **Test booking flow**
3. **Verify API calls to backend**
4. **Test payment integration**

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Update CORS settings in backend to include your frontend URL

### Issue 2: Environment Variables Not Working
**Solution**: 
- Check variable names (case-sensitive)
- Redeploy after adding variables
- Verify in Vercel dashboard

### Issue 3: Webhook Not Receiving Events
**Solution**:
- Check webhook URL is correct
- Verify webhook secret is set
- Check Stripe dashboard for failed events

### Issue 4: Email Not Sending
**Solution**:
- Verify Gmail App Password
- Check email environment variables
- Test with the test endpoint

## 📊 Monitoring & Maintenance

### Vercel Analytics
- Enable Vercel Analytics for both projects
- Monitor performance and errors

### Stripe Dashboard
- Monitor webhook events
- Check payment success rates
- Review failed payments

### Email Monitoring
- Check email delivery rates
- Monitor spam folder issues
- Consider email service provider

## 🎉 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected
- [ ] Stripe webhook configured
- [ ] Email functionality working
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test booking flow end-to-end
- [ ] Verify PDF generation
- [ ] Check email delivery

## 🔄 Updates & Redeployment

### Backend Updates
1. Push changes to GitHub
2. Vercel auto-deploys
3. Test API endpoints

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys
3. Test frontend functionality

## 📞 Support

If you encounter issues:

1. **Check Vercel deployment logs**
2. **Verify environment variables**
3. **Test individual components**
4. **Check Stripe webhook logs**
5. **Review email configuration**

## 🎯 Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
2. **Configure SSL certificates** (automatic with Vercel)
3. **Set up monitoring and alerts**
4. **Implement backup strategies**
5. **Plan for scaling**

---

**🎉 Congratulations!** Your E-Darshan Temple Booking System is now live on Vercel with separate backend and frontend deployments, ready to handle real bookings with email confirmations and PDF tickets!
