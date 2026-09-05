import axios from 'axios';

export class EarthGetter {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  async getImagery(lon: number, lat: number, dim?: number, date?: string) {
    const response = await axios.get(`${this.baseURL}/api/earth/imagery`, {
      params: { lon, lat, dim, date },
    });
    return response.data;
  }

  async getAssets(lon: number, lat: number, dim?: number, begin?: string, end?: string) {
    const response = await axios.get(`${this.baseURL}/api/earth/assets`, {
      params: { lon, lat, dim, begin, end },
    });
    return response.data;
  }
}
