import { IRoom } from "./IRoom";
import { ISellerSettings } from "./ISellerSettings";

export interface ISeller {
  id: string,
  rooms: IRoom[]
  settings : ISellerSettings
}
