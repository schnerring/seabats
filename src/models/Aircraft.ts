export interface Aircraft {
  icao: string;
  registration: string;
  model: string;
  type: string;
  onGround?: boolean;
  lastActive?: Date;
}
