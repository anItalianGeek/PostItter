import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {NotificationData} from "../NotificationData";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {UserService} from "./user.service";
import {UserData} from "../UserData";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private url: string = "http://localhost:5265";

  constructor(private http: HttpClient, private userService: UserService) {
  }

  // GET the existing notifications
  getNotificationsFromUser(id: string): Observable<NotificationData[]> {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    return this.http.get<NotificationData[]>(this.url + '/api/notifications/get/' + id, {headers: headers});
  }

  // POST a new notification
  addNewNotification(notification: NotificationData, user: UserData): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/notifications/newTo/' + user.id, notification, {headers: headers});
  }

  addNewTagNotification(notification: NotificationData, possibleUser: string) {
    let params = new HttpParams().set('mention', possibleUser);
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.post(this.url + '/api/notifications/newTo', notification, {params: params, headers: headers});
  }

  // DELETE all notifications or specific one
  deleteAllNotifications(id: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/notifications/deleteAll/' + id, {headers: headers});
  }

  deleteSingleNotification(id: string): void {
    const jwt = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + jwt});
    this.http.delete(this.url + '/api/notifications/delete/' + id, {headers: headers});
  }

  private notificationsAreEqual(n1: NotificationData, n2: NotificationData): boolean {
    return n1.type === n2.type && n1.message === n2.message && n1.postId === n2.postId && n1.user.id === n2.user.id;
  }


}
