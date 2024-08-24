import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {NotificationData} from "../NotificationData";
import {HttpClient} from "@angular/common/http";
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
    return this.http.get<NotificationData[]>(this.url + '/api/notifications/get/' + id);
  }

  // PUT a new notification
  addNewNotification(notification: NotificationData, user: UserData): void {
    if (user.notifications) user.notifications.push(notification);
    else user.notifications = [notification];
    this.userService.updateUser(user);
  }

  // DELETE all notifications or specific one
  deleteAllNotifications(id: string): void {
    this.http.delete(this.url + '/api/notifications/deleteAll/' + id);
  }

  deleteSingleNotification(id: string): void {
    this.http.delete(this.url + '/api/notifications/delete/' + id);
  }

  private notificationsAreEqual(n1: NotificationData, n2: NotificationData): boolean {
    return n1.type === n2.type && n1.message === n2.message && n1.postId === n2.postId && n1.user.id === n2.user.id;
  }


}
