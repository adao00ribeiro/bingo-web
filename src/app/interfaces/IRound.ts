import { ICard } from "./ICard";
import { IPrize } from "./IPrize";
import { IRoom } from "./IRoom";

export interface IRound {

  id: string;
  cardValue: number;
  cardRows: number;
  cardColumns: number;
  numbers: number[];
  cardSaleCount: number;
  cardsPurchased: number;
  startedDate: Date;
  finishedDate: Date;
  maxBalls: number;
  roomId: string;
  room: IRoom | null;
  cards: ICard[] | null;
  prizes: IPrize[];

}
