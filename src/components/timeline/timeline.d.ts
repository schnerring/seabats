export interface ITimeline {
  min: Date;
  max: Date;
  tracks: IEvent[];
}

export interface IEvent {
  key: string;
  label: string;
  start: Date;
  end: Date;
}
