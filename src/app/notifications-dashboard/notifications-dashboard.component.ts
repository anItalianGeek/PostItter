import {Component} from '@angular/core';
import {NotificationData} from "../../NotificationData";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notifications-dashboard',
  templateUrl: './notifications-dashboard.component.html',
  styleUrl: './notifications-dashboard.component.css'
})
export class NotificationsDashboardComponent {

  // myself variable from localstorage
  myself: { notifications: NotificationData[] } = {
    notifications: [
      {
        type: 'new-follow',
        user: {
          darkMode: true,
          displayName: 'cristian horner',
          email: 'example@example.com',
          everyoneCanText: false,
          id: 'efdvsvd',
          privateProfile: false,
          profilePicture: '',
          username: 'best tp fr'
        }
      },
      {
        type: 'new-like',
        user: {
          darkMode: true,
          displayName: 'cristian horner',
          email: 'example@example.com',
          everyoneCanText: false,
          id: 'efdvsvd',
          privateProfile: false,
          profilePicture: '',
          username: 'best tp fr'
        },
        postId: 'dummy'
      }
    ]
  };

  constructor(private router: Router) {
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

  clearNotifications() {
    if (confirm('Are you really sure you want to delete all notifications?'))
      this.myself.notifications = [];
  }

}
