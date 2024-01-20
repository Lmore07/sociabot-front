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
}
