import { Component, ElementRef, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CardModule, ButtonModule, FormsModule, ToastModule, DialogModule, MarkdownModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: [MessageService, provideMarkdown()],
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
  visible: any;
  status!: boolean;

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
    this.id = this.route.snapshot.paramMap.get('chatId') || '';
    (await this.service.getMessages(this.id)).subscribe((data: any) => {
      this.chats = data.data.interactions;
      this.status = data.data.status;

      if (this.chats.length == 0) this.showDialog();
    });
  }

  async sendMessage() {
    if (this.newMessage != '' && !this.isLoading) {
      this.visible = false;
      let messageToSend = this.newMessage;
      this.chats.push({
        message: this.newMessage,
        user: 'user',
        date: new Date(),
      });
      this.isLoading = true;
      this.chats.push({ message: 'typing', user: 'model' });
      (await this.service.sendMessage(this.id, messageToSend)).subscribe(
        (data: any) => {
          this.chats.pop();
          this.chats.push(data.data);
          this.newMessage = '';
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
          this.isLoading = false;
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
      if (!$event.shiftKey && !$event.getModifierState('Shift')) {
        this.sendMessage();
      }
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

  showDialog() {
    this.visible = true;
  }
  adjustHeight(event: any): void {
    if (event.key === 'Enter') {
      if (event.shiftKey && event.getModifierState('Shift')) {
        const maxHeight = 200; // Establece la altura máxima que deseas aquí
        event.target.style.height = 'auto';
        if (event.target.scrollHeight > maxHeight) {
          event.target.style.height = maxHeight + 'px';
        } else {
          event.target.style.height = (event.target.scrollHeight) + 'px';
        }
      }
    }
  }
}
