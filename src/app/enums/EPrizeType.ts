export enum EPrizeType {
  FourInLine = "FourInLine",           // Prêmio para quem acertar quatro números em uma única linha
  FourCorners = "FourCorners",        // Prêmio para quem acertar os quatro cantos do cartão
  SingleLine = "SingleLine",          // Prêmio para quem acertar uma linha
  SingleColumn = "SingleColumn",      // Prêmio para quem acertar uma coluna
  Diagonal = "Diagonal",              // Prêmio para quem acertar uma diagonal
  InvertedDiagonal = "InvertedDiagonal", // Prêmio para quem acertar uma diagonal invertida
  DoubleLine = "DoubleLine",          // Prêmio para quem acertar duas linhas
  DoubleColumn = "DoubleColumn",      // Prêmio para quem acertar duas colunas
  FullCard = "FullCard",              // Prêmio para quem acertar o cartão cheio
  TShape = "TShape",                  // Prêmio para quem acertar o formato da letra T no cartão
  XShape = "XShape",                  // Prêmio para quem acertar o formato da letra X no cartão
  PlusShape = "PlusShape",            // Prêmio para quem acertar o formato de um sinal de mais (+) no cartão
  OuterEdge = "OuterEdge"             // Prêmio para quem acertar toda a borda do cartão
}
