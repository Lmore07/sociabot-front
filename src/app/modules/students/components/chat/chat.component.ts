import { Component } from '@angular/core';
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
  chats: any[] = [];

  constructor(private service: ChatService, private route: ActivatedRoute){}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';

     (await this.service.getMessages(id)).subscribe((data: any) => {
      this.chats = data.data.interactions;
      console.log(this.chats);
    });
  }

}
