import { Trace } from "./Trace";
import { AdsbExchangeResponse } from "@/shared/adsb/AdsbExchangeResponse";
import { TraceFileFields } from "@/shared/adsb/TraceFileFields";
import dayjs from "dayjs";

export class Flight {
  _id: string;
  date: Date;
  icao: string;
  traces: Trace[];

  // ADSB Exchange
  constructor(tc: AdsbExchangeResponse) {
    this.icao = tc.icao ?? tc.hex;
    this._id = `${this.icao}-${tc.timestamp}`;
    this.date = dayjs.unix(tc.timestamp).toDate();
    this.traces = tc.trace.map((t) => {
      const flags = t[TraceFileFields.Flags] as number;
      return {
        date: dayjs
          .unix(t[TraceFileFields.SecondsAfterTimestamp] as number)
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
      } as Trace;
    });
  }
}
