import { ISeller } from "../../ISeller";
import { IScratchGameResponse } from "./IScratchGameResponse";

export interface IScratchSellerGameResponse{
    id:string;
    sellerId:string;
    scratchGameId: string;
    seller : ISeller;
    scratchGame: IScratchGameResponse
}
