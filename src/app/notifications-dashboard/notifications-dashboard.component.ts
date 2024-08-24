import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationData} from "../../NotificationData";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-notifications-dashboard',
  templateUrl: './notifications-dashboard.component.html',
  styleUrl: './notifications-dashboard.component.css'
})
export class NotificationsDashboardComponent implements OnInit {

  isLoaded: boolean = false;
  myNotifs: NotificationData[] = [];

  constructor(private router: Router, private notificationService: NotificationsService) {
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
    this.notificationService.getNotificationsFromUser((JSON.parse(localStorage.getItem('auth-token')!)).sub).subscribe(res => {
      this.myNotifs = res;
      this.isLoaded = true;
    });
  }

  clearNotifications() {
    if (confirm('Are you really sure you want to delete all notifications?')) {
      this.notificationService.deleteAllNotifications((JSON.parse(localStorage.getItem('auth-token')!)).sub);
      this.myNotifs = [];
    }
  }

  clearSingleNotification(id: string): void {
    if (confirm('Are you sure you want to delete the selected notification?')) {
      this.notificationService.deleteSingleNotification(id);
      this.myNotifs = this.myNotifs.filter(elem => elem.id != id);
    }
  }

}
