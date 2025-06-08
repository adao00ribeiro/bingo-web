import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SocketService } from '../../services/socket/socket.service';
import { PunterMeResourceService } from '../../resource/punter/punter-me-resource.service';
import { IPunter } from '../../interfaces/IPunter';

interface Message {
  id : string | undefined;
  text?: string;
  type: MessageType;
}

enum MessageType {
  Bot = 'bot',
  User = 'user',
  Loading = 'loading'
}

@Component({
  selector: 'app-chat',
  imports: [
    MatIcon,
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
export class ChatComponent implements OnInit, AfterViewChecked {
  roomId = input.required<string | undefined>();
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  private socketService: SocketService = inject(SocketService)
   protected readonly PunterMeResourceService = inject(PunterMeResourceService);
  public form: FormGroup;
  messages = signal<Message[]>([]);
  user = signal<IPunter | undefined>(undefined);
  private canSendMessage = true;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      message: ['']
    });


    effect(() => {
      const message = this.socketService.LastMessage();
      this.user.set(this.PunterMeResourceService.resource.value());
      if (this.IsJson(message?.message) && message?.message) {
        const parsedMessage: Message = JSON.parse(message.message);
        if (parsedMessage && parsedMessage.id != this.user()?.id) {
          console.log('fdp',parsedMessage)
          this.messages.update(current => current.slice(0, -1));
          this.messages.update(current => [...current, parsedMessage]);
        }
      }
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  get message() { return this.form.get('message'); }
  public onClickSendMessage(): void {
      const messageValue = this.message?.value?.trim();

  if (!messageValue) {
    return; // não envia se estiver vazia ou só com espaços
  }
    if (this.message && this.message && this.canSendMessage) {
      const userMessage: Message = { id:this.user()?.id,  text: this.message.value, type: MessageType.User };
     this.messages.update(current => [...current, userMessage]);
      this.socketService.sendMessage("message",`chat_room_${this.roomId()}`,JSON.stringify(userMessage));
      //this.socketService.sendMessage("message", `chat_room_11e96bc2-6a2f-48b2-9199-05b89bd249a4`, JSON.stringify(userMessage));
      this.message.setValue('');
      this.form.updateValueAndValidity();
    }
  }

  public onClickEnter(): void {
    this.onClickSendMessage();
  }

  private scrollToBottom(): void {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
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
