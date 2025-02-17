import { inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPunter } from '../../interfaces/IPunter';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = `${environment.api}/api/v1/punter/me`
  private httpClient: HttpClient = inject(HttpClient);
  public userSignal = signal<IPunter | null>(null);

   loadUser(){
    this.Get().subscribe({
      next: (user) => this.userSignal.set(user),
      error: (error) => console.error('Erro ao carregar rounds:', error),
    });
  }

  Get(): Observable<IPunter> {
    return this.httpClient.get<IPunter>(this.url);
  }
  clearUser(): void {
    this.userSignal.set(null); // Redefine o Signal para null
  }
}
