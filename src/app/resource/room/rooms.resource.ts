import { inject, Injectable, signal} from "@angular/core";
import { BaseResource } from "../base.resource";
import { IPaged } from "../../interfaces/IPaged";
import { Observable } from "rxjs";
import { IRoom } from "../../interfaces/IRoom";
import { RoomService } from "../../services/room/room.service";


@Injectable({
  providedIn: 'root'
})
export class RoomsResource extends BaseResource<{ page: number; size: number }, IPaged<IRoom>> {
  private roomService = inject(RoomService)

  protected override loader(request: { page: number; size: number }): Observable<IPaged<IRoom>> {
       return this.roomService.GetAll(request.page, request.size);
  }
}
