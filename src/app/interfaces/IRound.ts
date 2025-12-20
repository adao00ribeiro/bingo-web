import { ICard } from "./ICard";
import { IPrize } from "./IPrize";
import { IRoom } from "./IRoom";
import { ITimelineEvent } from "./ITimelineEvent";
export interface IRound {

  id: string;
  cardValue: number;
  cardRows: number;
  cardColumns: number;
  numbers: number[];
  cardsPurchased: number;
  started: Date;
  finished: Date;
  maxBalls: number;
  roomId: string;
  room: IRoom | null;
  cards: ICard[] | null;
  prizes: IPrize[];
  timeline: Record<string, ITimelineEvent>;
}
