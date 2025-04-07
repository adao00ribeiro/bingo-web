import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICardWinner } from '../interfaces/ICardWinner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardWinnersService {
  private url = `${environment.api}/api/v1/cardwinner`;
  private httpClient: HttpClient = inject(HttpClient);
  private cardwinnerSignal = signal<ICardWinner[]>([]);

  public readonly cardwinners = this.cardwinnerSignal.asReadonly();

  loadCardWinners(): void {
    this.GetAll().subscribe({
      next: (cardwinner) => {
        this.cardwinnerSignal.set(cardwinner)
      },
      error: (error) => console.error('Erro ao carregar cardsWinners:', error),
    });
  }

  GetAll(): Observable<ICardWinner[]> {
    return this.httpClient.get<ICardWinner[]>(this.url);
  }

  Create(cardwinner: ICardWinner): Observable<ICardWinner> {
    return this.httpClient.post<ICardWinner>(this.url, cardwinner);
  }

  GetById(id: string): Observable<ICardWinner> {
    return this.httpClient.get<ICardWinner>(`${this.url}/id/${id}`);
  }

  UpdateById(id: number, cardwinner: ICardWinner): Observable<ICardWinner> {
    return this.httpClient.put<ICardWinner>(`${this.url}/${id}`, cardwinner);
  }

  DeleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

}
