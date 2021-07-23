// Mapping of ADS-B Exchange Version 2 API Trace File Fields
// See also: https://www.adsbexchange.com/version-2-api-wip/
export enum TraceFileFields {
  SecondsAfterTimestamp,
  Lat,
  Lon,
  // Nullable
  AltitudeFt,
  // Nullable
  GroundSpeedKts,
  // Nullable
  TrackDeg,
  // Bit field:
  //   (flags & 1 > 0): position is stale (no position received for 20 seconds before this one)
  //   (flags & 2 > 0): start of a new leg (tries to detect a separation point between landing and takeoff that separates fligths)
  //   (flags & 4 > 0): vertical rate is geometric and not barometric
  //   (flags & 8 > 0): altitude is geometric and not barometric
  Flags,
  // Nullable
  VerticalRateFpm,
  // Nullable
  Aircraft,
}
