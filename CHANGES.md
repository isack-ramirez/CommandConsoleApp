# Recent Changes

## Project Structure for AWS Deployment

### New Files
- `src/services/asteroidService.ts` - Handles API calls to AWS backend
- `.env.example` - Template for environment variables
- `AWS_DEPLOYMENT.md` - Complete AWS deployment guide

### Updated Scene Visual Features

#### 1. **Locked Top-Down View**
- Camera is now fixed looking straight down from above
- Removed rotation capability (enableRotate: false)
- Kept pan for exploring the scene
- Removed zoom to maintain consistent viewing distance

#### 2. **Starfield Background**
- Added 500 randomly placed white stars
- Stars render behind all other objects
- Stars are small glowing spheres distributed throughout 3D space
- Uses `useMemo` to prevent stars from repositioning on re-renders

#### 3. **Color Scheme Changes**
- **Background**: Dark grey (#1a1a1a) instead of navy
- **Earth**: Red (#dc2626) with dark red glow
- **Rings**: All red with varying shades and 60% transparency
- **Stars**: Pure white with emissive glow
- **Lighting**: Neutral white light from above

#### 4. **Interactive Orbit Rings**
- Rings are now semi-transparent (opacity: 0.6)
- Hover over rings to see distance markers showing "X AU" (Astronomical Units)
- Distance markers appear as white text above the ring

#### 5. **Ring Variations**
- Alternating between two red shades for visual hierarchy
- Radius 3 & 7: #ef4444 (bright red)
- Radius 5 & 9: #f87171 (lighter red)

## AWS Integration

### How It Works
1. Frontend makes requests to AWS Lambda/API Gateway endpoint
2. Lambda function securely stores NASA API key (not exposed in frontend)
3. Lambda proxies the request to NASA API
4. Response returned to frontend for rendering

### API Service
- `fetchAsteroids()` - Gets asteroid data from AWS backend
- Gracefully handles errors with fallback to empty array
- Configurable via environment variables

### Deployment
- Frontend: Static files deployable to GitHub Pages
- Backend: AWS Lambda + API Gateway (serverless, pay-as-you-go)
- No API key exposed in client code or version control

## Next Steps
1. Set up AWS Lambda function with NASA API key
2. Create API Gateway endpoint
3. Configure environment variables
4. Deploy frontend to GitHub Pages
5. Connect frontend to AWS backend
6. Replace sample asteroids with real NASA data
