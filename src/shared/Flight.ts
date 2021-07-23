import { Trace } from "./Trace";

export interface Flight {
  icao: string;
  date: Date;
  traces: Trace[];
}
