import { Component, ElementRef, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CardModule, ButtonModule, FormsModule, ToastModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: [MessageService],
})
export class ChatComponent {
  constructor(
    private service: ChatService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  chats: any[] = [];
  newMessage: string = '';
  id = '';
  isLoading: boolean = false;

  @ViewChild('chatBox')
  private chatContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    (await this.service.getMessages(this.id)).subscribe((data: any) => {
      console.log(data);
      this.chats = data.data.interactions;
    });
  }

  async sendMessage() {
    if (this.newMessage != '') {
      let messageToSend = this.newMessage;
      this.chats.push({
        message: this.newMessage,
        user: 'user',
        date: new Date(),
      });
      this.isLoading = true;
      this.chats.push({ message: 'typing', user: 'assistant' });
      this.newMessage = '';
      (await this.service.sendMessage(this.id, messageToSend)).subscribe(
        (data: any) => {
          this.chats.pop();
          this.chats.push(data.data);
          this.isLoading = false;
        },
        (error) => {
          this.showToast(
            'info',
            'Ocurrió un error',
            'Lo sentimos no se pudo procesar tu mensaje 🙁'
          );
          this.chats.pop();
          this.chats.pop();
        }
      );
    } else {
      this.showToast(
        'error',
        'Ocurrió un error',
        'No puedes enviar mensajes vacíos 🙁'
      );
    }
  }

  handleKeyPress($event: KeyboardEvent) {
    if ($event.key === 'Enter' && this.newMessage !== '') {
      this.sendMessage();
    }
  }

  showToast(type: string, title: string, message: string) {
    this.messageService.clear();
    this.messageService.add({
      key: 'informationToast',
      severity: type,
      summary: title,
      detail: message,
    });
  }
}
