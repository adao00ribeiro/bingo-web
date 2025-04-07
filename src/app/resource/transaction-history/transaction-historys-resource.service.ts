import { Injectable, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { BaseHttpResourceService } from "../base-http-resource.service";
import { IPaged } from "../../interfaces/IPaged";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class TransactionHistorysResourceService extends BaseHttpResourceService {

  private page = signal<number | null>(null);
  private size = signal<number | null>(null);

  resource = rxResource({
    request: () => ({
      page: this.page(), // Obtém o ID dinamicamente
      size: this.size(), // Obtém o ID dinamicamente
    }), // Pode ser um objeto vazio caso não precise de parâmetros
    loader: ({request}) =>
      this.httpClient.get<IPaged>(`${this.url}/recharge?page=${request.page}&size=${request.size}`)
  });

  // Método opcional para recarregar os rounds
  reload(page:number , size:number) {
    this.page.set(page);
    this.size.set(size);
    this.resource.reload();
  }
}
