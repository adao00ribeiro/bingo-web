import { IOnlineHouseSettings } from "../../IOnlineHouseSettings";
import { IPunter } from "../../IPunter";
import { IRoom } from "../../IRoom";
import { IRoomSeller } from "../../IRoomSeller";
import { ISeller } from "../../ISeller";

export interface IOnlineHouseResponse
{
  id: string;
  name: string;
  hostname: string;
  sellerId: string; // Guid = string
  seller?: ISeller; // opcional se não carregado
  settings?: IOnlineHouseSettings;
  punters?: IPunter[];
  ownerRooms?: IRoom[];
  participantRooms?: IRoomSeller[];
}
