import { EPrizeType } from "../enums/EPrizeType";
import { ITopCardInfo } from "./ITopCardInfo";
import { IWinningCardsInfo } from "./IWinningCardsInfo";

export interface IPrizeResult{
  prizeType : EPrizeType ,
  winningCards :IWinningCardsInfo[],
  listTopCards :ITopCardInfo[],
}
