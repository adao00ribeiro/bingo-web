import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { ISocketMessage } from '../../interfaces/ISocketMessage';
import { IRoundMessage } from '../../interfaces/IRoundMessage';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../../components/chat/chat.component';
import { EMessageType } from '../../enums/EMessageType';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: WebSocket | null = null;

  private readonly SOCKET_URL = `${environment.API_WS}`;
  private isConnected = signal<boolean>(false);
  private lastMessage = signal<ISocketMessage | null>(null);
  private chatLastMessage = signal<ChatMessage | null>(null);
  public socketErrors = signal<string>('');

  public readonly IsConnected = this.isConnected.asReadonly();
  public readonly LastMessage = this.lastMessage.asReadonly();
  public readonly ChatLastMessage = this.chatLastMessage.asReadonly();

  private setupSocketListeners(): void {
    if (this.socket) {
      // Listener de conexão
      this.socket.onopen = () => {
        this.isConnected.set(true);
        this.socketErrors.set('');
        console.log("Conectado ao WebSocket");
        //  this.subscribeToChannel("room_98522b7d-81d9-4c71-9ef4-fe505aae92b6");
      };

      // Listener de mensagens
      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const message: ISocketMessage = JSON.parse(event.data);
          if (this.IsJson(message.message)) {
            const chatMessage: ChatMessage = JSON.parse(message.message)

            if (this.isChatMessage(chatMessage)) {
              this.chatLastMessage.set(chatMessage)

            } else {
              this.lastMessage.set(message);
            }
          }


        } catch (error) {
          console.error("Erro ao processar mensagem do WebSocket", error);
        }
      };

      // Listener de erros
      this.socket.onerror = (error: Event) => {
        this.socketErrors.set(`Erro de conexão`);
        console.error("Erro no WebSocket", error);
      };

      // Listener de desconexão com reconexão automática
      this.socket.onclose = () => {
        this.isConnected.set(false);
        console.log("WebSocket desconectado. Tentando reconectar...");
        setTimeout(() => this.connect(), 5000); // Tentar reconectar em 5 segundos
      };
    }
  }

  // Método para conectar ao WebSocket
  public connect(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(this.SOCKET_URL);
      this.setupSocketListeners();
    }
  }

  // Método para desconectar do WebSocket
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Método para enviar mensagens
  public sendMessage(command: string, channel: string, message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const socketMessage: ISocketMessage = {
        command: command,
        channel: channel,
        message: message
      }
      this.socket.send(JSON.stringify(socketMessage));
    } else {
      console.warn("WebSocket não está conectado");
    }
  }

  // Método para se inscrever em um canal
  public subscribeToChannel(channel: string): void {
    console.log(`Voce se increvel no canal ${channel}`)
    this.sendMessage("subscribe", channel, "mensagem");
  }

  // Método para obter o status atual da conexão
  public getConnectionStatus(): boolean {
    return this.isConnected();
  }
  IsJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }
  isChatMessage(obj: any): obj is ChatMessage {

    return (
      typeof obj === 'object' &&
      (typeof obj.id === 'string' || typeof obj.id === 'undefined') &&
      (typeof obj.text === 'string' || typeof obj.text === 'undefined') &&
      Object.values(EMessageType).includes(obj.type)
    );
  }
}
