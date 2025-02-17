import { EPrizeType } from "../enums/EPrizeType";
import { ITopCardInfo } from "./ITopCardInfo";
import { IWinningCardsInfo } from "./IWinningCardsInfo";

export interface IPrizeResult{
   EPrizeType : EPrizeType ,
    WinningCards :IWinningCardsInfo[],
   ListTopCards :ITopCardInfo[],
}
