import { ICard } from "./ICard";
import { IPunter } from "./IPunter";

export interface ITopCardInfo {
  card: ICard;
  missingNumbers: number[]
  hits: number
}
