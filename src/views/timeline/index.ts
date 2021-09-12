export interface ITimeline {
  min: Date;
  max: Date;
  tracks: IEventBase[];
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

export class TooltipContent {
  fields: { key: string; value: string }[];
  constructor(fields: { key: string; value: string }[]) {
    this.fields = fields;
  }
}
