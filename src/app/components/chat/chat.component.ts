import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SocketService } from '../../services/socket/socket.service';
import { IPunter } from '../../interfaces/IPunter';
import { EMessageType } from '../../enums/EMessageType';
import { PunterMeResource } from '../../resource/punter/punter-me.resource';

export interface ChatMessage {
  id: string | undefined;
  text?: string;
  type: EMessageType;
  time: Date;
}

@Component({
  selector: 'app-chat',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements AfterViewChecked {
  roomId = input.required<string | undefined>();
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  private socketService: SocketService = inject(SocketService)
  protected readonly PunterMeResource = inject(PunterMeResource);
  user = signal<IPunter | undefined>(undefined);
  messages = signal<ChatMessage[]>([]);
  messageText: string = '';
  isTyping: boolean = false;

  private shouldScrollToBottom = false;
  constructor() {

    effect(() => {
      const message = this.socketService.ChatLastMessage();
      this.user.set(this.PunterMeResource.resource.value());
      if (message && message.id != this.user()?.id) {

        const received = { ...message, type: EMessageType.RECEIVED };
        this.messages.update(current => {
          const updated = [...current, received];
          return updated.length > 20 ? updated.slice(-20) : updated;
        });
      }

    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    if (!text) return;
    const userMessage: ChatMessage = { id: this.user()?.id, text: text, type: EMessageType.SENT, time: new Date() };
    this.messages.update(current => {
      const updated = [...current, userMessage];
      return updated.length > 20 ? updated.slice(-20) : updated;
    });
    this.messageText = '';
    this.socketService.sendMessage("message", `chat_room_${this.roomId()}`, JSON.stringify(userMessage));
    this.shouldScrollToBottom = true;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  formatTime(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) {
      console.warn("Data inválida:", date);
      return '';
    }

    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  IsJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }
}
