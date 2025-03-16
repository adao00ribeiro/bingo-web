import { Injectable,  signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { BaseHttpResourceService } from "../base-http-resource.service";
import { IRound } from "../../interfaces/IRound";


@Injectable({
  providedIn: 'root'
})
export class RoundsByRoomIdResourceService extends BaseHttpResourceService {

  // Signal para armazenar o ID do round buscado
  private roomIdSignal = signal<string | null>(null);

  // Recurso para buscar um round específico por ID
  resource = rxResource({
    request: () => ({
      id: this.roomIdSignal(), // Obtém o ID dinamicamente
    }),
    loader: ({ request }) => {
      if (!request.id) {
        throw new Error("ID do round não informado!");
      }
      return this.httpClient.get<IRound[]>(`${this.url}/round/filter/room/${request.id}`);;
    },
  });

  // Método para carregar um round por ID
  loadRoundsByRoomId(id: string) {
    this.roomIdSignal.set(id);
    this.resource.reload();
     }
}
