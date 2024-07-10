import {Component} from '@angular/core';
import {PostData} from "../../PostData";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {

  // @Input() postID!: string; // to remove after debug
  userOptionsDropdownShown: boolean = false;
  post: PostData = { // dummy data to be deleted after testing
    body: 'la formula 1 non è il wrestling',
    comments: [
      {
        user: {
          darkMode: true,
          displayName: 'cristian horny',
          email: 'example@example.com',
          everyoneCanText: false,
          followers: 104,
          following: 69,
          id: 'dfnuogbrwefh',
          privateProfile: false,
          profilePicture: 'favicon.ico',
          username: 'best tp'
        },
        content: 'real'
      }
    ],
    hashtags: ['formula1', 'formula2', 'formula3', 'mclaren', 'ferrari', 'cristianHorny'],
    id: 'abcdef',
    likes: 104,
    reposts: 69,
    shares: 10469,
    user: {
      darkMode: true,
      displayName: 'ssssofy',
      email: 'example@example.com',
      everyoneCanText: false,
      followers: 104,
      following: 69,
      id: 'fefefesf',
      privateProfile: false,
      profilePicture: 'favicon.ico',
      username: 'best '
    }
  }

  /*constructor(private router: Router) {
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

  triggerUserOptions(): void {
    this.userOptionsDropdownShown = !this.userOptionsDropdownShown;
  }

  like(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target.src.endsWith('/icons/heart.png')) {
      if (this.post.user.likedPosts)
        this.post.user.likedPosts.push(this.post);
      else
        this.post.user.likedPosts = [this.post];
      this.post.likes++;
      target.src = '/icons/heart-liked.png';
    } else {
      this.post.user.likedPosts = this.post.user.likedPosts?.filter(post => post.id !== this.post.id);
      this.post.likes--;
      target.src = '/icons/heart.png';
    }
  }

  comment(event: Event): void {

  }

  repost(event: Event): void {

  }

  share(event: Event): void {

  }

}
