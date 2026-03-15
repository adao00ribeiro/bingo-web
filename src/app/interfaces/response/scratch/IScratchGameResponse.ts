import { EScratchLayoutType } from "../../../enums/EScratchLayoutType";
import { IScratchGameAttributesResponse } from "./jsonb/IScratchGameAttributesResponse";

export interface IScratchGameResponse{
  name?: string;
  thumbinail?: string;
  layoutType?: EScratchLayoutType;
  price?: number;
  maxPrize?: number;
  probability?: number;
  allowedMultipliers?: number[];
  attributes?: IScratchGameAttributesResponse;
}
