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
export class TimerService {
  private readonly socketService = inject(SocketService);

  // Última hora do servidor
  private serverTime = signal<ServerTime | null>(null);
  public readonly ServerTime = this.serverTime.asReadonly();

  // Hora ajustada localmente (avança a cada segundo)
  private adjustedTimestamp = signal<number | null>(null);
  public readonly AdjustedTime = computed(() => {
    const timestamp = this.adjustedTimestamp();
    return timestamp ? new Date(timestamp) : null;
  });

  // Latência calculada
  private latency = signal<number | null>(null);
  public readonly Latency = this.latency.asReadonly();

  private timer: any;

  constructor() {
     this.startClock(Date.now());
    effect(() => {
      const message = this.socketService.LastMessage();
      if (this.isJson(message?.message)) {
        const parsed = JSON.parse(message?.message);

        if (parsed?.Timestamp && parsed?.Time && parsed?.Date) {
          const serverTimestamp = parsed.Timestamp;
          const receivedAt = Date.now();
          const latency = receivedAt - serverTimestamp;

          this.serverTime.set(parsed as ServerTime);
          this.latency.set(latency);

          // Inicializa o relógio local ajustado com base no timestamp do servidor + latência
          this.startClock(serverTimestamp + latency);
        }
      }
    }, { allowSignalWrites: true });
  }

  private isJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }

  private startClock(startTimestamp: number) {
    this.adjustedTimestamp.set(startTimestamp);

    // Limpa relógios anteriores
    if (this.timer) clearInterval(this.timer);

    // Inicia um relógio que incrementa a cada segundo
    this.timer = setInterval(() => {
      const current = this.adjustedTimestamp();
      if (current !== null) {
        this.adjustedTimestamp.set(current + 1000); // avança 1 segundo
      }
    }, 1000);
  }
}
