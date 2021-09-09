export interface IFlightInfo {
  meta: IFlightInfoMeta;
  html: string;
}

export interface IFlightInfoMeta {
  key: number;
  flightIds: string[];
}
