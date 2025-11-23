import { IScratchGameResponse } from "./IScratchGameResponse";
import { IScratchTicketAttributesResponse } from "./jsonb/IScratchTicketAttributesResponse";

export interface IScratchTicketResponse {
  id: string;
  multiplier: number;
  prizeWon: number;
  revealed: boolean;
  attributes?: IScratchTicketAttributesResponse;
  scratchGameId: string;
  scratchGame?: IScratchGameResponse;
}
