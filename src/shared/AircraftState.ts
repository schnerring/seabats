export interface AircraftState {
  icao24: string;
  callsign?: string;
  country: string;
  lastContact: Date;
  longitude?: number;
  latitude?: number;
  altitude?: number;
  velocityX?: number;
  velocityY?: number;
  trueHeading?: number;
  onGround: boolean;
}
