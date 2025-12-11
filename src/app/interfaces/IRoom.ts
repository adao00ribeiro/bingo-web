import { IAccumulated } from "./IAccumulated"
import { IMediaAttachment } from "./IMediaAttachment";

export interface IRoom {
  id: string,
  name:string
  accumulated : IAccumulated;
  mediaAttachment: IMediaAttachment;
}
