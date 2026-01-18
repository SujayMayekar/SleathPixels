# SteganoSafe - Advanced Client-Side Steganography

This application is 100% client-side and optimized for easy hosting on Netlify.

## Key Features
- **AES-256 Encryption**: Secure your messages with a password before hiding them.
- **LSB Pixel Manipulation**: Industry-standard steganography.
- **Capacity Meter**: Real-time feedback on image data limits.
- **Local History**: Track your session activity via browser `localStorage`.
- **Zero Backend**: Privacy guaranteed.

## Hosting on Netlify

### Quick Deploy (Drag and Drop)
1. Run `npm run build` locally to generate the `dist` folder.
2. Drag the `dist` folder into the Netlify "Sites" upload area.

### Continuous Deployment (GitHub)
1. Push this project to GitHub.
2. Link the repository to Netlify.
3. Settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

## Running Locally
1. `npm install`
2. `npm run dev`
