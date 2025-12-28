# Deployment Guide for Skincare POS System

## Deploying to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**
   ```bash
   cd "D:\Document\CODES DEV\SV2-Y3\SV2.6-Y3SM1Final-SkincareStoreSystem"
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (first time)
   - What's your project's name? `skincare-pos-system`
   - In which directory is your code located? **./frontend**
   - Want to override the settings? **N**

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. **Connect Git Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your Git repository

2. **Configure Build Settings**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

3. **Environment Variables** (if needed)
   - Add any environment variables in the Vercel dashboard
   - Example: `REACT_APP_API_URL=your-backend-url`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

## Configuration Files

The project includes `vercel.json` at the root which configures:
- Build command to run from the frontend directory
- Output directory pointing to frontend/build
- Rewrites for client-side routing

## Important Notes

✅ **The `vercel.json` file is already configured** to handle the frontend folder structure.

✅ **All routes will work** because the rewrite rule sends all requests to index.html (SPA routing).

✅ **The build will run automatically** using the scripts in frontend/package.json.

## Testing Locally Before Deployment

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Test the build locally (optional)
npx serve -s build
```

## After Deployment

Your app will be available at:
- Preview URL: `your-project-name-random-hash.vercel.app`
- Production URL: `your-project-name.vercel.app` (or your custom domain)

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Go to Settings → Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

**Build Fails:**
- Check that all dependencies are in frontend/package.json
- Ensure there are no ESLint errors
- Check the build logs in Vercel dashboard

**Routes Don't Work:**
- The vercel.json rewrite rules should handle this
- Make sure you're using React Router's BrowserRouter (not HashRouter)

**Blank Page:**
- Check browser console for errors
- Ensure all imports are correct
- Check that the build was successful

## Environment Variables for Future Backend Integration

When you add a backend, create a `.env.local` file in the frontend directory:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

Then in Vercel, add these environment variables in the project settings.
