import { ICard } from "./ICard";
import { IPunter } from "./IPunter";

export interface ITopCardInfo {
  Card: ICard;
  Punter: IPunter;
  MissingNumbers: number[]
  Hits: number
}
