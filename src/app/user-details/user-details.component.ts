import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";

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

  constructor() {
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
    )
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

  canUserSeePosts(currentId: string): boolean { // TODO this method might be useless because depends on what the backend server is going to return
    if (this.user.following?.find(element => element === currentId) || !this.user.privateProfile) {
      return this.user.posts === undefined;
    }
    return false;
  }

  userCanText(currentId: string): boolean {
    if (!this.user.privateProfile && this.user.everyoneCanText)
      return true;
    else if (this.user.following?.find(element => element === currentId)) // TODO must absolutely fix this after adding the tokens
      return true;
    else
      return false;
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
