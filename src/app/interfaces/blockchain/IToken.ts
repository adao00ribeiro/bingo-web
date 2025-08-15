import { ITokenAddress } from "./ITokenAddress";

export interface IToken {
  id: string; // Guid no C# → string no TypeScript
  symbol: string;
  name: string;
  decimals: number;
  isNative: boolean;
  tokenAddresses: ITokenAddress;
  price: number
}
