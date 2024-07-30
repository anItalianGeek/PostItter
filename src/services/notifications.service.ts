import {Injectable} from '@angular/core';
import {Observable, of, switchMap} from "rxjs";
import {NotificationData} from "../NotificationData";
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {UserData} from "../UserData";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private url: string = "http://192.168.31.200";

  constructor(private http: HttpClient, private userService: UserService) {
  }

  // GET the existing notifications
  getNotificationsFromUser(id: string): Observable<NotificationData[] | undefined> {
    return this.userService.getUserById(id).pipe(
      switchMap(user => {
        if (user.notifications) return of(user.notifications);
        else return of([]);
      })
    )
  }

  // PUT a new notification
  addNewNotification(notification: NotificationData, user: UserData): void {
    if (user.notifications) user.notifications.push(notification);
    else user.notifications = [notification];
    this.userService.updateUser(user);
  }

  // DELETE all notifications or specific one
  deleteAllNotifications(user: UserData): void {
    user.notifications = undefined;
    this.userService.updateUser(user);
  }

  deleteSingleNotification(user: UserData, notification: NotificationData): void {
    if (!user.notifications) return;
    user.notifications = user.notifications.filter(notification_ => !this.notificationsAreEqual(notification_, notification));
    this.userService.updateUser(user);
  }

  private notificationsAreEqual(n1: NotificationData, n2: NotificationData): boolean {
    return n1.type === n2.type && n1.message === n2.message && n1.postId === n2.postId && n1.user.id === n2.user.id;
  }


}
