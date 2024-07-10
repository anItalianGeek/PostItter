import {Component} from '@angular/core';
import {UserData} from "../../UserData";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

  // TODO well.... the user will be retrieved using it's id
  // user!: UserData;
  userBlockOption: boolean = false;

  user: UserData = {
    bio: 'ti voglio sofia',
    darkMode: false,
    displayName: 'adolf hitler',
    email: 'example@example.com',
    everyoneCanText: true,
    followers: 10469,
    following: 69,
    id: 'adolf-the-best',
    privateProfile: false,
    profilePicture: '/favicon.ico',
    username: 'mein kampf best book fr'
  }

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

  showUserOptions(): void {
    this.userBlockOption = !this.userBlockOption;
  }

}
