import { Injectable,  signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { BaseHttpResourceService } from "../base-http-resource.service";
import { IRound } from "../../interfaces/IRound";




@Injectable({
  providedIn: 'root'
})
export class RoundByIdResourceService extends BaseHttpResourceService {

  // Signal para armazenar o ID do round buscado
  private roundIdSignal = signal<string | null>(null);

  // Recurso para buscar um round específico por ID
  roundByIdResource = rxResource({
    request: () => ({
      id: this.roundIdSignal(), // Obtém o ID dinamicamente
    }),
    loader: ({ request }) => {
      if (!request.id) {
        throw new Error("ID do round não informado!");
      }
      return this.httpClient.get<IRound>(`${this.url}/id/${request.id}`);;
    },
  });

  // Método para carregar um round por ID
  loadRoundById(id: string) {
    this.roundIdSignal.set(id);
    this.roundByIdResource.reload(); // Recarrega os dados
  }
}
