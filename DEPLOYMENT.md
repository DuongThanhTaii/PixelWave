# Pixelwave Deployment Guide

Congratulations on finishing the Pixelwave build! This document provides step-by-step instructions for deploying both the Frontend and Backend to production.

## 1. Backend Deployment (Render or Railway)

The backend is built with Node.js, Express, Socket.io, and Prisma.

### Prerequisites
- Ensure your Neon PostgreSQL database is active (you already have the connection string).
- Create an account on [Render](https://render.com/) or [Railway](https://railway.app/).

### Steps (Render)
1. In Render, create a new **Web Service**.
2. Connect your GitHub repository and select the `pixelwave-backend` root directory.
3. Configure the environment:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the following Environment Variables:
   - `PORT`: (Leave empty, Render assigns this automatically)
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_sw0zhyD6trUa@ep-long-rice-aztivjfa-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `JWT_SECRET`: `(generate a long random string)`
   - `CLOUDINARY_CLOUD_NAME`: `dz5oyhmq2`
   - `CLOUDINARY_API_KEY`: `579173665955542`
   - `CLOUDINARY_API_SECRET`: `FiFVI3q5ZeskHK1o3eoGhk-VkSM`
   - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app` (Add this after you deploy the frontend!)
5. Click **Deploy**. Note the URL (e.g., `https://pixelwave-api.onrender.com`).

## 2. Frontend Deployment (Vercel)

The frontend is built with Next.js 14 and Tailwind CSS.

### Steps
1. Push the `pixelwave` frontend code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Add the following Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://pixelwave-api.onrender.com/api/v1` (Replace with your backend URL)
   - `NEXT_PUBLIC_SOCKET_URL`: `https://pixelwave-api.onrender.com` (Note: `wss://` is automatically negotiated, use `https://`)
5. Click **Deploy**. Vercel will build the Next.js app.

## 3. Post-Deployment Checks
- Update the `FRONTEND_URL` environment variable in your Backend to match the Vercel URL. This ensures CORS blocks unauthorized clients from hitting your APIs.
- Open your Vercel URL, sign up for a new account, upload a profile picture (which hits Cloudinary!), and place a pixel on the canvas!
