import { ICard } from "./ICard"
import { IPrize } from "./IPrize"

export interface ICardWinner {
  id: string,
  value :number,
  card: ICard,
  cardId :string,
  prizeId : string
  prize : IPrize
}
