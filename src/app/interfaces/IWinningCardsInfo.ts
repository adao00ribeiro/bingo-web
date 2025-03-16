import { ICard } from "./ICard";
import { IPunter } from "./IPunter";

export interface IWinningCardsInfo{
    punter : IPunter;
    card : ICard;
    valueOfEachWinner : number
}
