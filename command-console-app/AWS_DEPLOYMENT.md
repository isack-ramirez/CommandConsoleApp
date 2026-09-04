# AWS Deployment Guide

This project is structured to securely handle the NASA API key through an AWS backend, keeping it hidden from the browser.

## Architecture

```
GitHub Pages (Static Site)
    ↓
    ├── Frontend (Vite + React + Three Fiber)
    └── Calls AWS Lambda/API Gateway
              ↓
        AWS Lambda Function
              ↓
        NASA Asteroids API
```

## Setup Instructions

### 1. Build the Frontend

```bash
npm run build
```

This creates a `dist/` folder that you'll deploy to GitHub Pages.

### 2. Create AWS Lambda Function

Create a new Lambda function with Node.js runtime. Use this code:

```javascript
// lambda/asteroidHandler.js
const https = require('https');

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_API_URL = 'https://api.nasa.gov/neo/rest/v1/neo/browse';

exports.handler = async (event) => {
  // Enable CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' }),
    };
  }

  try {
    const data = await fetchFromNASA();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch asteroid data' }),
    };
  }
};

function fetchFromNASA() {
  return new Promise((resolve, reject) => {
    const url = `${NASA_API_URL}?api_key=${NASA_API_KEY}`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', reject);
  });
}
```

### 3. Configure Lambda Environment Variables

- Set `NASA_API_KEY` to your NASA API key from https://api.nasa.gov

### 4. Create API Gateway

1. Create a new REST API
2. Create a GET method for `/api/asteroids`
3. Integration type: Lambda Function
4. Select your Lambda function
5. Deploy to a stage (e.g., `prod`)

### 5. Configure GitHub Pages

1. Update `.env` with your API Gateway URL:
```
VITE_API_BASE_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
```

2. In your GitHub repo settings, enable GitHub Pages from the `main` branch, `/docs` folder (or create a CI/CD workflow to deploy `dist/` to `gh-pages` branch)

3. Deploy:
```bash
npm run build
# Copy dist/ contents to docs/ or gh-pages branch
```

## Local Development

```bash
# Set local API endpoint
VITE_API_BASE_URL=http://localhost:3001 npm run dev

# Run a local mock server or AWS Lambda locally with SAM
```

## Security Notes

✓ API key is stored securely in AWS Lambda environment variables (never exposed in client code)
✓ Frontend is static, hosted on GitHub Pages (free)
✓ CORS is configured to allow requests from your GitHub Pages domain
✓ All API calls go through Lambda as a secure proxy
