import { ISeller } from "../../ISeller";
import { IOnlineHouseResponse } from "../bingo/IOnlineHouseResponse";
import { IScratchGameResponse } from "./IScratchGameResponse";

export interface IScratchGameOverrideResponse{
    id:string;
    title:string;
    subtitle:string;
    cardValue:number;
    onlineHouseId:string;
    scratchGameId: string;
    createdAt?: string
    onlineHouse : IOnlineHouseResponse;
    scratchGame: IScratchGameResponse
}
