import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Chat} from "../Chat";
import {Message} from "../Message";
import {NotificationsService} from "./notifications.service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly url: string = "http://localhost:5265/";

  constructor(private http: HttpClient, private notificationService: NotificationsService) {
  }

  getAllChats(id: string): Observable<Chat[]> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    const params = new HttpParams().set('user_id', (JSON.parse(jwt!)).sub);
    return this.http.get<Chat[]>(this.url + "api/messanger/retrieveChats", {params: params});
  }

  getSigleChatData(chatID: string): Observable<Chat> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    const params = new HttpParams().set('id_current_user', (JSON.parse(jwt!)).sub);
    return this.http.get<Chat>(this.url + "api/messanger/retrieveChat/" + chatID, {params: params});
  }

  getMessagesFromChat(chatId: string): Observable<Message[]> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    const params = new HttpParams().set('id_current_user', (JSON.parse(jwt!)).sub);
    return this.http.get<Message[]>(this.url + 'api/messanger/chat/' + chatId, {params: params});
  }

  createChat(id: string): Observable<Chat> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    const params = new HttpParams().set('user_id', id).append('id_current_user', (JSON.parse(jwt!)).sub);
    return this.http.post<Chat>(this.url + 'api/messanger/createChat', {}, {params: params});
  }

  sendMessage(chat: Chat, message: Message) {
    const jwt = JSON.parse(localStorage.getItem('auth-token')!);
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('auth-token')});
    const params = new HttpParams().set('id_current_user', (JSON.parse(jwt!)).sub);
    chat.members.forEach(e => this.notificationService.addNewNotification({
      id: "",
      type: "new-message",
      postId: chat.chatId,
      user: {id: jwt.sub, displayName: jwt.displayName, username: jwt.username, profilePicture: ""},
    }, e));
    return this.http.post(this.url + 'api/messanger/chat/' + chat.chatId, message, {params: params});
  }

  deleteChat(chatId: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    const params = new HttpParams().set('id_current_user', (JSON.parse(jwt!)).sub);
    this.http.delete(this.url + 'api/messanger/chat/' + chatId, {params: params});
  }

}
