# AgroChain Ethiopia Deployment Guide for Render.com

This guide provides step-by-step instructions for deploying the AgroChain project to [Render](https://render.com).

## 1. Backend (Server) Deployment

1. **Create a New Web Service**:
   - Log in to [Render Dashboard](https://dashboard.render.com).
   - Click **New +** > **Web Service**.
   - Connect your GitHub account and select the `Agrochain-deployment-` repository.
2. **Service Configuration**:
   - **Name**: `agrochain-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Internal Port**: `5000` (or whatever your `.env` specifies)
4. **Environment Variables**:
   Click **Advanced** > **Add Environment Variable**:
   - `MONGODB_URI`: *Your MongoDB connection string*
   - `JWT_SECRET`: *A secure random string*
   - `CLOUDINARY_CLOUD_NAME`: *From Cloudinary dashboard*
   - `CLOUDINARY_API_KEY`: *From Cloudinary dashboard*
   - `CLOUDINARY_API_SECRET`: *From Cloudinary dashboard*
   - `NODEMAILER_EMAIL`: *Your service email*
   - `NODEMAILER_PASS`: *Your app-specific password*
   - `PORT`: `10000` (Render's default)

## 2. Client (Frontend) Deployment

1. **Create a New Static Site**:
   - Click **New +** > **Static Site**.
   - Select the `Agrochain-deployment-` repository.
2. **Service Configuration**:
   - **Name**: `agrochain-client`
   - **Root Directory**: `Client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. **Environment Variables**:
   - `VITE_API_URL`: *The URL of your deployed backend service (e.g., https://agrochain-backend.onrender.com/api)*

## 3. Admin (Dashboard) Deployment

1. **Create a New Static Site**:
   - Click **New +** > **Static Site**.
   - Select the `Agrochain-deployment-` repository.
2. **Service Configuration**:
   - **Name**: `agrochain-admin`
   - **Root Directory**: `Admin`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: *The URL of your deployed backend service*

## Important Notes
- **CORS**: Ensure the backend allows requests from the Client and Admin URLs. Update your backend `cors` configuration with the live URLs if they are restricted.
- **Database Access**: Make sure your MongoDB Atlas cluster allows connections from Render's IP addresses (set "Allow Access from Anywhere" `0.0.0.0/0` in Atlas for testing).
