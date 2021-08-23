export interface ITimeline {
  min: Date;
  max: Date;
  tracks: IEvent[];
}

export interface IEventBase {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

export interface IEvent<T> extends IEventBase {
  data: T;
}
