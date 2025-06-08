import { EMessageType } from "../enums/EMessageType";

export interface ISocketMessage {
  command?:string;
  channel?: string;
  message?: any;
}
