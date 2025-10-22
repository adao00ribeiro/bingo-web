import { IPunter } from "../IPunter";
import { IRoom } from "../IRoom";
import { ISellerSettings } from "../ISellerSettings";

export interface ISellerRequest{
  id: string,
  balance: number;
  email: string;
  cpf: string;
  dateBirth: Date;
  commission: number;
  settings : ISellerSettings
  punters?: IPunter[];
  ownerRooms?: IRoom[];
}
