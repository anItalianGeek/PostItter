import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

  // TODO well.... the user will be retrieved using it's id
  // user!: UserData;
  @ViewChild('dropdown', {static: false}) dropdown!: ElementRef<HTMLElement>;
  userBlockOption: boolean = false;

  user: UserData = {
    bio: 'ti voglio sofia',
    darkMode: false,
    displayName: 'adolf hitler',
    email: 'example@example.com',
    everyoneCanText: true,
    id: 'adolf-the-best',
    privateProfile: false,
    profilePicture: '/favicon.ico',
    username: 'mein kampf best book fr',
    posts: []
  }

  constructor(private router: Router, private userService: UserService) {
    this.user.posts?.push(
      {
        body: 'la formula 1 non è il wrestling',
        comments: [
          {
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
            content: 'real'
          }
        ],
        hashtags: ['formula1', 'formula2', 'formula3', 'mclaren', 'ferrari', 'cristianHorny'],
        id: 'efe',
        likes: 104,
        reposts: 69,
        shares: 10469,
        user: this.user
      }
    );

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
    if (this.userBlockOption)
      this.dropdown.nativeElement.style.visibility = 'visible';
    else
      this.dropdown.nativeElement.style.visibility = 'hidden';
  }

  canUserSeePosts(currentId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.userService.getUserById(currentId).subscribe({
        next: result => {
          if (this.user.following?.find(element => element === result) || !this.user.privateProfile) {
            resolve(this.user.posts !== undefined);
          } else {
            resolve(false);
          }
        }
      });
    });
  }


  userCanText(currentId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.userService.getUserById(currentId).subscribe({
        next: result => {
          if (!this.user.privateProfile && this.user.everyoneCanText)
            return true;
          else if (this.user.following?.find(element => element === result))
            return true;
          else
            return false;
        }
      });
    });
  }

  follow(): void {

  }

  message(): void {

  }

  block(): void {

  }

  report(): void {

  }

}
