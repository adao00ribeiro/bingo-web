import { IRoundMessage } from "./IRoundMessage";

export interface ITimelineEvent {
  eventData: IRoundMessage;
  delay: number;
}
