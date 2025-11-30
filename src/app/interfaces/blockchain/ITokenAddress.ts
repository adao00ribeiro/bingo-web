import { INetwork } from "./INetwork";
import { IToken } from "./IToken";

export interface ITokenAddress{
  id: string; // Guid no C# → string no TypeScript
  tokenId: string;
  networkId: string;
  contractAddress: string;
  token: IToken;
  network: INetwork;
}
