import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  async getMessages(id: string) {
    return this.http.get(
      environment.apiUrl + '/chats/get-chat/' + id,
    );
  }

  async sendMessage(id: string, message: string) {
    return this.http.post(
      environment.apiUrl + '/chats/new-message',
      { message, chatId: id }
    );
  }
}
