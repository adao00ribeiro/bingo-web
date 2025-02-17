import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { SocketService } from './socket/socket.service';
import { IRoundMessage } from '../interfaces/IRoundMessage';

@Injectable({
  providedIn: 'root',
})
export class RoundsRealTimeService {
  readonly socketService = inject(SocketService);
  private roundsDictionary = signal<Record<string, Record<string, IRoundMessage>>>({});
  readonly getRoundSignal = computed(() => {

    return (roomId: string, roundId: string) =>
      this.roundsDictionary()?.[roomId]?.[roundId] || null;
  });

  constructor() {
    effect(() => {

      const message = this.socketService.LastMessage();
      if (this.IsJson(message?.message) && message?.message) {
        const parsedMessage :IRoundMessage = JSON.parse(message.message);
        if (parsedMessage.round?.roomId && parsedMessage.id) {
          this.addToDictionary(parsedMessage.round.roomId, parsedMessage.id, parsedMessage);
        }
      }
    },{allowSignalWrites:true});
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
      const updatedDictionary = { ...prev }; // Cria uma cópia do dicionário atual

      // Se não existe a chave roomId, cria um novo objeto vazio
      if (!updatedDictionary[roomId]) {
        updatedDictionary[roomId] = {};
      }

      // Atualiza ou adiciona o roundId com os dados fornecidos
      updatedDictionary[roomId][roundId] = roundData;

      return updatedDictionary; // Retorna o dicionário atualizado
    });
  }
}
