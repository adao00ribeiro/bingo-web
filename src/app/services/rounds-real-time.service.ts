import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { SocketService } from './socket/socket.service';
import { IRoundMessage } from '../interfaces/IRoundMessage';

@Injectable({
  providedIn: 'root',
})
export class RoundsRealTimeService {
  readonly socketService = inject(SocketService);
  private roundsDictionary = signal<Record<string, Record<string, IRoundMessage>>>({});

  // Método para obter um signal específico de uma sala
  getRoomRoundsSignal(roomId: string) {
    return computed(() => this.roundsDictionary()[roomId] || {});
  }

  // Método para obter um signal específico de um round
  getSpecificRoundSignal(roomId: string, roundId: string) {
    return computed(() => this.roundsDictionary()?.[roomId]?.[roundId] || null);
  }

  // Mantém o método original para compatibilidade
  readonly getRoundSignal = computed(() => {
    return (roomId: string, roundId: string) =>
      this.roundsDictionary()?.[roomId]?.[roundId] || null;
  });

  constructor() {
    effect(() => {
      const message = this.socketService.LastMessage();
      if (this.IsJson(message?.message) && message?.message) {
        const parsedMessage: IRoundMessage = JSON.parse(message.message);
        if (parsedMessage.round?.roomId && parsedMessage.id) {
          this.addToDictionary(parsedMessage.round.roomId, parsedMessage.id, parsedMessage);
        }
      }
    }, { allowSignalWrites: true });
  }

  // Verifica se a string é JSON válida
  IsJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }

  private addToDictionary(roomId: string, roundId: string, roundData: IRoundMessage): void {
    this.roundsDictionary.update((prev: Record<string, Record<string, IRoundMessage>>) => {
      const updatedDictionary = { ...prev };

      if (!updatedDictionary[roomId]) {
        updatedDictionary[roomId] = {};
      }

      updatedDictionary[roomId][roundId] = roundData;

      return updatedDictionary;
    });
  }
}
