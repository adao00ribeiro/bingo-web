import { IRound } from "./IRound";

export interface ICard {
  id: string;
  code : number;
  name: string;
  numbers: number[];
  roundId: string;
  round :  IRound;
  punterId: string;
  // Punter? Punter;
  //IEnumerable<CardWinner>? CardWinners;
}
