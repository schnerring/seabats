export interface ITimeline {
  min: Date;
  max: Date;
  tracks: ITrack[];
}

export interface ITrack {
  events: IEvent[];
}

export interface IEvent {
  date: Date;
}
