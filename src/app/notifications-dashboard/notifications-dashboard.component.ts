import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationData} from "../../NotificationData";
import {NotificationsService} from "../../services/notifications.service";
import {map, Observable} from "rxjs";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-notifications-dashboard',
  templateUrl: './notifications-dashboard.component.html',
  styleUrl: './notifications-dashboard.component.css'
})
export class NotificationsDashboardComponent implements OnInit {

  isLoaded: boolean = false;
  myNotifsObservable!: Observable<NotificationData[]>;
  noNotifs: boolean = true;

  constructor(private router: Router, private notificationService: NotificationsService, private userService: UserService) {
    let token = localStorage.getItem('auth-token');
    if (token === null) {
      router.navigateByUrl('/login');
    } else {
      token = JSON.parse(token);
      // @ts-ignore
      if (Math.floor(Date.now() / 1000) > token.exp)
        router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.myNotifsObservable = this.notificationService.getNotificationsFromUser((JSON.parse(localStorage.getItem('auth-token')!)).sub);
    this.myNotifsObservable.subscribe(response => {
      this.isLoaded = true;
      if (response.length != 0)
        this.noNotifs = false;
    });
  }

  clearNotifications() {
    if (confirm('Are you really sure you want to delete all notifications?')) {
      this.notificationService.deleteAllNotifications((JSON.parse(localStorage.getItem('auth-token')!)).sub);
      this.myNotifsObservable = this.myNotifsObservable.pipe(
        map(notifs => {
          return [];
        })
      );
    }
  }

  clearSingleNotification(id: string): void {
    if (confirm('Are you sure you want to delete the selected notification?')) {
      this.notificationService.deleteSingleNotification(id);
      this.myNotifsObservable = this.myNotifsObservable.pipe(
        map(notifs => notifs.filter(notif => notif.id !== id))
      );
    }
  }


  protected readonly localStorage = localStorage;
}
