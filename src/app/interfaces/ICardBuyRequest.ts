export interface ICardBuyRequest{
  quantity: number;  // Quantidade de cartões comprados
  roundId?: string;   // ID do round (UUID em string)
  punterId?: string;  // ID do apostador (UUID em string)
}
