import { Injectable, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RoundService } from "../../services/round/round.service";
import { IRound } from "../../interfaces/IRound";
import { BaseHttpResourceService } from "../base-http-resource.service";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class RoundsResourceService extends BaseHttpResourceService {

  roundsResource = rxResource({
    request: () => ({}), // Pode ser um objeto vazio caso não precise de parâmetros
    loader: () => this.httpClient.get<IRound[]>(this.url),
  });

  // Método opcional para recarregar os rounds
  reloadRounds() {
    this.roundsResource.reload();
  }
}
