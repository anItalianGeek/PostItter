import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  // here only have the variable of the user thanksss
  // TODO this component must be identical to the user-details component!!!! but no checks because i am the owner of course :)
  @ViewChild('filters', {static: false}) searchFilters!: ElementRef<HTMLElement>;
  activatedFilter = 3;

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

  changeFilter(index: number): void {
    this.searchFilters.nativeElement.getElementsByTagName('li')[this.activatedFilter].classList.remove('selected');
    this.searchFilters.nativeElement.getElementsByTagName('li')[index].classList.add('selected');
    this.activatedFilter = index;
  }

}
