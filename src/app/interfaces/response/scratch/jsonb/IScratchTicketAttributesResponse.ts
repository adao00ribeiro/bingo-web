import { IScratchItemResponse } from "./IScratchItemResponse";

export interface IScratchTicketAttributesResponse {
  punterId: string; // Guid em C# → string em TS
  items: IScratchItemResponse[];
}
