import { Injectable, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { BaseHttpResourceService } from "../base-http-resource.service";
import { IPaged } from "../../interfaces/IPaged";
import { ScratchGameService } from "../../services/scratch/scratch-game.service";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class ScratchGameResourceService extends BaseHttpResourceService {
  private scratch = inject(ScratchGameService)

  resource = rxResource({
    request: () => ({

    }), // Pode ser um objeto vazio caso não precise de parâmetros
    loader: ({request}) =>
        this.scratch.GetAllGame()
  });

  // Método opcional para recarregar os rounds
  reload() {
    this.resource.reload();
  }
}
