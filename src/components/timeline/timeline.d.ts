export interface ITimeline {
  min: Date;
  max: Date;
  tracks: ITrack[];
}

export interface ITrack {
  label: string;
  events: IEvent[];
}

export interface IEvent {
  start: Date;
  end: Date;
}
