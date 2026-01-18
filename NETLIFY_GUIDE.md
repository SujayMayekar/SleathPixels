# Hosting on Netlify - Guide

This guide explains how to host the SteganoSafe (Image Steganography) website on Netlify.

## Prerequisites
- A Netlify account (free tier is sufficient).
- The project files from the `client/` directory.

## Option 1: Drag and Drop (Easiest)
1. Build the project locally using `npm run build`. This will create a `dist` folder.
2. Log in to your [Netlify Dashboard](https://app.netlify.com/).
3. Navigate to the **Sites** tab.
4. Drag and drop the `dist` folder into the deployment area at the bottom of the page.
5. Your site is now live!

## Option 2: Continuous Deployment (GitHub/GitLab/Bitbucket)
1. Push your project to a git repository.
2. In Netlify, click **Add new site** > **Import an existing project**.
3. Select your repository provider and the project repository.
4. Configure the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**. Netlify will automatically rebuild and deploy whenever you push changes.

## Running through Browser (Local Development)
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open `http://localhost:5000` in your browser.

## Important Note
This application is entirely client-side. No backend or database is required. The browser handles all steganography logic using the HTML5 Canvas API.
