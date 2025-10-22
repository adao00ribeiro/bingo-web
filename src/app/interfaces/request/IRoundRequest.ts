import { IPrize } from "../IPrize";

export interface IRoundRequest {
  cardValue: number;
  cardRows: number;
  cardColumns: number;
  startedDate: string;
  maxBalls: number;
  timeBetweenBalls:number;
  roomId: string;
  prizes?: IPrize[]
}
