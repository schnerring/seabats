export interface AircraftState {
  icao: string;
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
