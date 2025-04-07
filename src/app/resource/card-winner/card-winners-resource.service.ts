import { Injectable, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { BaseHttpResourceService } from "../base-http-resource.service";
import { IRecharge } from "../../interfaces/IRecharge";
import { IPaged } from "../../interfaces/IPaged";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class CardWinnersResourceService extends BaseHttpResourceService {

  private page = signal<number | null>(null);
  private size = signal<number | null>(null);

  resource = rxResource({
    request: () => ({
      page: this.page(), // Obtém o ID dinamicamente
      size: this.size(), // Obtém o ID dinamicamente
    }), // Pode ser um objeto vazio caso não precise de parâmetros
    loader: ({request}) =>{
      let page = request.page
      let size = request.size
      if(page ==null ){
        page = 1;
      }
      if(size ==null ){
        size = 10;
      }
      return this.httpClient.get<IPaged>(`${this.url}/cardwinner?page=${page}&size=${size}`)
    }

  });

  // Método opcional para recarregar os rounds
  reload(page:number , size:number) {
    this.page.set(page);
    this.size.set(size);
    this.resource.reload();
  }
}
