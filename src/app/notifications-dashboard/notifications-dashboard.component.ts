import {Component} from '@angular/core';
import {NotificationData} from "../../NotificationData";

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

  /* constructor(private router: Router) {
    let token = localStorage.getItem('authToken');
    if (token === null) {
      router.navigateByUrl('/login');
    } else {
      token = JSON.parse(token);
      // @ts-ignore
      if (Date.now() > token.expiryDate)
        router.navigateByUrl('/login');
    }
  } */

  clearNotifications() {
    this.myself.notifications = [];
  }

}
