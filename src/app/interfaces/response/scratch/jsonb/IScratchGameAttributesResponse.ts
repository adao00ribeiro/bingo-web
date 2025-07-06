import { IScratchSymbolDto } from "./IScratchSymbolResponse";

export interface IScratchGameAttributesResponse {
  payoutTable: { [key: string]: number };
  symbols: IScratchSymbolDto[];
}
