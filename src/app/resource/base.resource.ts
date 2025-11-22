import { inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";


export abstract class BaseResource<TRequest = any, TResponse = any> {
  protected abstract loader(request: TRequest): Observable<TResponse>;

  private requestSignal = signal<TRequest>({} as TRequest);

  resource = rxResource({
    request: this.requestSignal,
    loader: ({ request }) => this.loader(request),
  });

  /** Atualiza o request e recarrega os dados */
  reload(request?: TRequest) {
    if (request) this.requestSignal.set(request);
    this.resource.reload();
  }

  /** Atualiza o request sem recarregar (reativo automático) */
  setRequest(request: TRequest) {
    this.requestSignal.set(request);
  }
}
