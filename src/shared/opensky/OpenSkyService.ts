import { HttpServiceBase } from "@/shared/HttpServiceBase";
import dayjs from "dayjs";
import { AircraftState } from "@/shared/opensky/AircraftState";
import { StateVectorField } from "@/shared/opensky/StateVectorFields";

export class OpenSkyService extends HttpServiceBase {
  private lastStateVectorRequest?: Date;

  constructor() {
    super("https://opensky-network.org/api");
  }

  // Get the state vectors for a given time.
  // If time is omitted, the current time will be used.
  public async getStateVectors(
    icaos: string[],
    time?: Date
  ): Promise<AircraftState[]> {
    // const rateLimitAuthSeconds = 5;
    // const rateLimitNoAuthSeconds = 10;

    const params: string[][] = [];

    if (time) {
      params.push(["time", dayjs(time).unix().toString()]);
    }

    for (const icao of icaos) {
      params.push(["icao24", icao]);
    }

    this.lastStateVectorRequest = new Date();
    const response = await this.instance.get("/states/all", {
      params: new URLSearchParams(params),
    });

    if (!response.data.states) return [];

    return response.data.states.map(
      (s: unknown[]) =>
        <AircraftState>{
          icao: s[StateVectorField.icao24],
          callsign: s[StateVectorField.callsign],
          country: s[StateVectorField.origin_country],
          lastContact: s[StateVectorField.last_contact]
            ? dayjs.unix(<number>s[StateVectorField.last_contact]).toDate()
            : undefined,
          longitude: s[StateVectorField.longitude],
          latitude: s[StateVectorField.latitude],
          altitude: s[StateVectorField.baro_altitude]
            ? s[StateVectorField.baro_altitude]
            : s[StateVectorField.geo_altitude],
          velocityX: s[StateVectorField.velocity],
          velocityY: s[StateVectorField.vertical_rate],
          trueHeading: s[StateVectorField.true_track],
          onGround: s[StateVectorField.on_ground],
        }
    );
  }
}
