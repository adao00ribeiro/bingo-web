import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IRecharge } from '../../interfaces/IRecharge';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  private url = `${environment.api}/api/v1/recharge`;
  private httpClient: HttpClient = inject(HttpClient);
  private rechargesSignal = signal<IRecharge[]>([]);

  public readonly recharges = this.rechargesSignal.asReadonly();

  loadRecharges(): void {
    this.GetAll().subscribe({
      next: (recharges) => this.rechargesSignal.set(recharges),
      error: (error) => console.error('Erro ao carregar rounds:', error),
    });
  }
  GetAll(): Observable<IRecharge[]> {
    return this.httpClient.get<IRecharge[]>(this.url);
  }

  Create(recharge: IRecharge): Observable<IRecharge> {
    return this.httpClient.post<IRecharge>(this.url, recharge);
  }

  GetById(id: string): Observable<IRecharge> {
    return this.httpClient.get<IRecharge>(`${this.url}/id/${id}`);
  }

  UpdateById(id: number, recharge: IRecharge): Observable<IRecharge> {
    return this.httpClient.put<IRecharge>(`${this.url}/${id}`, recharge);
  }

  DeleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

}
