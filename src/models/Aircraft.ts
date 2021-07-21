export interface Aircraft {
  icao24: string;
  registration: string;
  model: string;
  type: string;
  onGround?: boolean;
  lastActive?: Date;
}
