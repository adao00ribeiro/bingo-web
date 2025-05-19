import { EPrizeType } from "../enums/EPrizeType";
import { ITopCardInfo } from "./ITopCardInfo";
import { IWinningCardsInfo } from "./IWinningCardsInfo";

export interface IPrizeResult{
  prizeId :string;
  roundId: string;
  value:number;
  prizeType : EPrizeType ,
  winningCards :IWinningCardsInfo[],
  listTopCards :ITopCardInfo[],

}
