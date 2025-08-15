import { Injectable, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RoundService } from "../../services/round/round.service";
import { IRound } from "../../interfaces/IRound";
import { BaseHttpResourceService } from "../base-http-resource.service";
import { NetworkService } from "../../services/blockchain/network.service";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class NetworksResourceService extends BaseHttpResourceService {
  private readonly netwrokService = inject(NetworkService);

  resource = rxResource({
    request: () => ({}), // Pode ser um objeto vazio caso não precise de parâmetros
    loader: () => this.netwrokService.GetAll(),
  });

  // Método opcional para recarregar os rounds
  reload() {
    this.resource.reload();
  }
}
