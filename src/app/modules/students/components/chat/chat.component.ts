import { Component, ElementRef, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CardModule, ButtonModule, FormsModule, ToastModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  constructor(private service: ChatService, private route: ActivatedRoute) { }
  
  chats: any[] = [];
  newMessage: string = '';
  id = '';

  @ViewChild('chatBox')
  private chatContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    (await this.service.getMessages(this.id)).subscribe((data: any) => {
      console.log(data);
      this.chats = data.data.interactions;
    });
  }

  async sendMessage() {
    (await this.service.sendMessage(this.id, this.newMessage)).subscribe((data: any) => {
      this.chats.push({ message: this.newMessage, user: 'user', date: new Date() });
      this.chats.push(data.data);
      this.newMessage = '';
    });
  }

  handleKeyPress($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.sendMessage();
    }
  }

}
