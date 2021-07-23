export interface Trace {
  date: Date;
  lat: number;
  lon: number;
  altitudeFt: number | string | null;
  groundSpeedKts: number | null;
  trackDeg: number | null;
  isStale: boolean;
  isLeg: boolean;
  isVerticalRateGeometric: boolean;
  isAltitudeGeometric: boolean;
  verticalRateFpm: number | null;
}
