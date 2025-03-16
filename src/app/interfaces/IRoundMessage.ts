import { IAccumulated } from "./IAccumulated";
import { IPrize } from "./IPrize";
import { IPrizeResult } from "./IPrizeResult";
import { IRound } from "./IRound";

export interface IRoundMessage {
  id: string;
  finished: boolean;
  started: boolean;
  mainBall: number;
  secondBall: number;
  thirdBall: number;
  forthBall: number;
  maxNumbers: number;
  numbers: number[];
  accumulated: IAccumulated | null;
  isAccumulated: boolean;
  round: IRound ;
  prizes: IPrize[];
  results: IPrizeResult[];
  currentPrizeResult: IPrizeResult | null;
}
