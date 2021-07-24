import { HttpServiceBase } from "@/shared/HttpServiceBase";
import { Flight } from "../Flight";
import { TraceFileResponse } from "./trace-file-response";
import { TraceFileFields } from "./TraceFileFields";
import { Trace } from "../Trace";
import dayjs from "dayjs";

export class SampleDataService extends HttpServiceBase {
  private flights: Flight[] = [];

  async init(): Promise<void> {
    const response = await this.instance.get<TraceFileResponse[]>(
      "adsb/sample-traces.json"
    );
    this.flights = response.data.map((tc) => {
      return <Flight>{
        icao: tc.icao ?? tc.hex,
        date: dayjs.unix(tc.timestamp).toDate(),
        traces: tc.trace.map((t) => {
          const flags = <number>t[TraceFileFields.Flags];
          return <Trace>{
            date: dayjs
              .unix(<number>t[TraceFileFields.SecondsAfterTimestamp])
              .toDate(),
            lat: t[TraceFileFields.Lat],
            lon: t[TraceFileFields.Lon],
            altitudeFt: t[TraceFileFields.AltitudeFt],
            groundSpeedKts: t[TraceFileFields.GroundSpeedKts],
            trackDeg: t[TraceFileFields.TrackDeg],
            isStale: (flags & 1) > 0,
            isLeg: (flags & 2) > 0,
            isVerticalRateGeometric: (flags & 4) > 0,
            isAltitudeGeometric: (flags & 8) > 0,
            verticalRateFpm: t[TraceFileFields.VerticalRateFpm],
            // TODO map the last field of aircraft info?
          };
        }),
      };
    });
  }
  async getFlights(icaos: string[]): Promise<Flight[]> {
    try {
      return this.flights.filter((f) => icaos.includes(f.icao));
    } catch {
      throw "ADSB sample data not initialized. Please run the initalization script and try again.";
    }
  }
}
