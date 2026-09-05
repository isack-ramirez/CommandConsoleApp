export class ApodGetter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getLatest() {
    // TODO: Implement call to backend /api/apod/latest
    throw new Error('Not implemented');
  }

  async getByDate(date: string) {
    // TODO: Implement call to backend /api/apod/date?date={date}
    throw new Error('Not implemented');
  }

  async getDateRange(startDate: string, endDate: string) {
    // TODO: Implement call to backend /api/apod/range?start={startDate}&end={endDate}
    throw new Error('Not implemented');
  }
}
