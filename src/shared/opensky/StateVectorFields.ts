// Mapping of OpenSky state vector array indices to names.
// See also: https://opensky-network.org/apidoc/rest.html#response
export enum StateVectorField {
  // Unique ICAO 24-bit address of the transponder in hex string representation.
  icao24,
  // Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
  callsign,
  // Country name inferred from the ICAO 24-bit address.
  origin_country,
  // Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s.
  time_position,
  // Unix timestamp (seconds) for the last update in general. This field is updated for any new, valid message received from the transponder.
  last_contact,
  // WGS-84 longitude in decimal degrees. Can be null.
  longitude,
  // WGS-84 latitude in decimal degrees. Can be null.
  latitude,
  // Barometric altitude in meters. Can be null.
  baro_altitude,
  // Boolean value which indicates if the position was retrieved from a surface position report.
  on_ground,
  // Velocity over ground in m/s. Can be null.
  velocity,
  // True track in decimal degrees clockwise from north (north=0°). Can be null.
  true_track,
  // Vertical rate in m/s. A positive value indicates that the airplane is climbing, a negative value indicates that it descends. Can be null.
  vertical_rate,
  // IDs of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request.
  sensors,
  // Geometric altitude in meters. Can be null.
  geo_altitude,
  // The transponder code aka Squawk. Can be null.
  squawk,
  // Whether flight status indicates special purpose indicator.
  spi,
  // Origin of this state’s position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
  position_source,
}
