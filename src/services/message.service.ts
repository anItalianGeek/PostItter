import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Chat} from "../Chat";
import {Message} from "../Message";
import {NotificationsService} from "./notifications.service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly url: string = "http://localhost:5265";

  constructor(private http: HttpClient, private notificationService: NotificationsService) {
  }

  getAllChats(id: string): Observable<Chat[]> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<Chat[]>(this.url + "api/messanger/" + id, {headers: headers});
  }

  getSigleChatData(id: string): Observable<Chat> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<Chat>(this.url + "api/messanger/" + id, {headers: headers});
  }

  getMessagesFromChat(chatId: string): Observable<Message[]> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<Message[]>(this.url + 'api/messanger/chat/' + chatId, {headers: headers});
  }

  createChat(id: string): Observable<Chat> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.post<Chat>(this.url + 'api/messanger/createChat' + id, {headers: headers});
  }

  sendMessage(chat: Chat, message: Message) {
    const jwt = JSON.parse(localStorage.getItem('auth-token')!);
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('auth-token')});
    chat.members.forEach(e => this.notificationService.addNewNotification({
      id: "",
      type: "new-message",
      user: {id: jwt.sub, displayName: jwt.displayName, username: jwt.username, profilePicture: ""},
    }, e));
    return this.http.post(this.url + '/api/messanger/chat/' + chat.chatId, message, {headers: headers});
  }

  deleteChat(chatId: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/messanger/chat/' + chatId, {headers: headers});
  }

}
