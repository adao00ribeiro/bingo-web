import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { SocketService } from './socket/socket.service';

interface ServerTime {
  Time: string;
  Date: string;
  Timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = 'bingo-light';
  private IconState = 'dark_mode';


  constructor() {
    this.onChangeChatState();

  }
  get iconState(): string {
    return this.IconState;
  }
  public onChangeChatState(): void {
    // Remove o tema atual
    document.body.classList.remove(this.theme);

    // Alterna o tema
    this.theme = this.theme === 'bingo-dark' ? 'bingo-light' : 'bingo-dark';
    this.IconState = this.IconState === 'dark_mode' ? 'light_mode' : 'dark_mode';

    // Adiciona o novo tema
    document.body.classList.add(this.theme);
  }
}
