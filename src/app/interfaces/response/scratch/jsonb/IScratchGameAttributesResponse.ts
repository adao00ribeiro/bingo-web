import { IScratchSymbolDto } from "./IScratchSymbolResponse";

export interface IScratchGameAttributesResponse {
  payoutTable: { multiplier: number; prize: number }[];
  symbols: IScratchSymbolDto[];
}
