import { ITokenAddress } from "./ITokenAddress";

export interface INetwork{
  id: string; // Guid no C# → string no TypeScript
  name: string;
  rpcUrl: string;
  chainId: number;
  tokenAddresses: ITokenAddress[];
}
