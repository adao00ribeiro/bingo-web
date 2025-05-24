import { EPrizeType } from "../enums/EPrizeType";

export interface IPrize {
  id: string,
  value:number,
  type : EPrizeType
}
