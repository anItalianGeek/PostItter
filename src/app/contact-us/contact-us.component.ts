import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  constructor(private router: Router) {
    let token = localStorage.getItem('authToken');
    if (token === null) {
      router.navigateByUrl('/login');
    } else {
      token = JSON.parse(token);
      // @ts-ignore
      if (Date.now() > token.expiryDate)
        router.navigateByUrl('/login');
    }
  }

  sendMessage(): void {

  }

}
