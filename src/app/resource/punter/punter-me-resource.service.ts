import { Injectable, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { BaseHttpResourceService } from "../base-http-resource.service";
import { IPunter } from "../../interfaces/IPunter";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class PunterMeResourceService extends BaseHttpResourceService {

  resource = rxResource({
    request: () => ({}), // Pode ser um objeto vazio caso não precise de parâmetros
    loader: () => this.httpClient.get<IPunter>(this.url + "/punter/me"),
  });

  // Método opcional para recarregar os rounds
  reload() {
    this.resource.reload();
  }
}
