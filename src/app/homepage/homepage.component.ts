import {Component} from '@angular/core';
import {PostData} from "../../PostData";
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  posts: PostData[] = [
    {
      body: 'la formula 1 non è il wrestling',
      comments: [
        {
          user: {
            darkMode: true,
            displayName: 'cristian horner',
            email: 'example@example.com',
            everyoneCanText: false,
            followers: [],
            following: [],
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
      user: {
        darkMode: true,
        displayName: 'giuly',
        email: 'example@example.com',
        everyoneCanText: false,
        followers: [],
        following: [],
        id: 'rerv',
        privateProfile: false,
        profilePicture: '',
        username: 'skill issue'
      }
    }
  ];

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

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

}
