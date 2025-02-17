import { IPrize } from "./IPrize";
import { IPrizeResult } from "./IPrizeResult";
import { IRound } from "./IRound";

export interface IRoundMessage {
  id: string; // Usamos `string` para representar GUIDs
  finished: boolean;
  started: boolean;
  mainBall: number;
  secondBall: number;
  thirdBall: number;
  forthBall: number;
  maxNumbers: number;
  numbers: number[];
 // accumulated: Accumulated | null;
  isAccumulated: boolean;
  round: IRound ;
  prizes: IPrize[];
  //results: IPrizeResult[];
  currentPrizeResult: IPrizeResult | null; // Tipo pode ser ajustado conforme a estrutura
}
