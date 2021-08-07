export interface AdsbExchangeResponse {
  icao: string;
  hex: string;
  timestamp: number;
  trace: unknown[][];
}
