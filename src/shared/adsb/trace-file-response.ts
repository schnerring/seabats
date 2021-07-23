export interface TraceFileResponse {
  icao: string;
  hex: string;
  timestamp: number;
  trace: unknown[][];
}
