# Step-by-Step Deployment Guide (New Blueprint Method)

Follow these steps to deploy the entire AgroChain project to a new Render account.

### 1. Prepare your GitHub
Ensure all code is pushed to your GitHub repository:
- **Repository**: `https://github.com/Tilahun-Sitotaw/Agrochain-deployment-`
- **Branch**: `new`

### 2. Set up Render account
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Connect your GitHub account.

### 3. Deploy using Blueprint
1. Click the **"New +"** button in the Render dashboard.
2. Select **"Blueprint"** (usually near the bottom).
3. Connect your repository (`Agrochain-deployment-`).
4. Set the **Service Group Name** (e.g., `agrochain-project`).
5. Set the **Branch** to `new`.
6. Render will automatically detect the `render.yaml` file.

### 4. Provide Environment Variables
Render will ask you to fill in the missing variables for the **agrochain-server**:
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A random secure string.
- `CLOUDINARY_*`: Your Cloudinary credentials.
- `NODEMAILER_*`: Your email service credentials.

### 5. Apply and Wait
1. Click **"Apply"**.
2. Render will start building the Server, Client, and Admin services simultaneously.
3. The Client and Admin will automatically link to the Server's URL thanks to the `render.yaml` configuration.

### 6. Verify Deployment
Once all services show "Deployed" (Green):
1. Open the **agrochain-client** URL to view the marketplace.
2. Open the **agrochain-admin** URL to access the dashboard.
