import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-messages-dashboard',
  templateUrl: './messages-dashboard.component.html',
  styleUrl: './messages-dashboard.component.css'
})
export class MessagesDashboardComponent {

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

}
