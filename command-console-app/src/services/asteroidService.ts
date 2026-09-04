// Service that calls our AWS backend to fetch asteroid data
// The AWS Lambda function handles the NASA API key securely on the server side

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface Asteroid {
  id: string;
  name: string;
  position: [number, number, number];
  velocity: [number, number, number];
  size: number;
}

// Fetch asteroid data from our AWS backend
// The backend proxies the NASA API call, keeping the API key secure
export async function fetchAsteroids(): Promise<Asteroid[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/asteroids`);
    if (!response.ok) {
      throw new Error(`Failed to fetch asteroids: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching asteroids:', error);
    // Return empty array on error - UI will show placeholder asteroids
    return [];
  }
}
