export interface IScratchBuyRequest{
  quantity: number;  // Quantidade de cartões comprados
  scratchSellerGameId?: string;   // ID do round (UUID em string)
  punterId?: string;  // ID do apostador (UUID em string)
}
