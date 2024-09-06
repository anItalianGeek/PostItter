import {Component, OnInit} from '@angular/core';
import {PostData} from "../../PostData";
import {Router} from "@angular/router";
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {UserData} from "../../UserData";
import {Observable} from "rxjs";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  isLoaded: boolean = false;
  postsObservable!: Observable<PostData[]>;
  posts: PostData[] = [];
  userObservable!: Observable<UserData>;
  currentUser!: UserData;
  lastClickedPost!: PostData;
  createPostProcedure: boolean = false;
  showCommentWindow: boolean = false;
  showReportWindow: boolean = false;
  showShareWindow: boolean = false;
  selectedColor: string = '';

  constructor(private router: Router, private postService: PostService, private userService: UserService, private notificationService: NotificationsService) {
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

  ngOnInit() {
    this.userObservable = this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub);
    this.postsObservable = this.postService.getPosts();
    this.userObservable.subscribe(response => {
      this.currentUser = response;

      this.postsObservable.subscribe(response => {
        this.posts = response;

        this.isLoaded = true;
      });
    });
  }

  createPost() {
    this.createPostProcedure = true;
  }

  confirmCreation(body: string, hashtags: string) {
    if (!this.hashtagsValid(hashtags)) {
      alert("Hashtags contain invalid characters!");
      return;
    }

    const post: PostData = {
      id: "",
      body: body,
      likes: 0,
      reposts: 0,
      shares: 0,
      hashtags: hashtags.split(" "),
      user: this.currentUser,
      comments: [],
      color: this.selectedColor
    }

    this.postService.addNewPost(post).subscribe(response => this.checkTags(body, response));
    this.createPostProcedure = false;
  }

  cancelCreation() {
    this.createPostProcedure = false;
  }

  openCommentWindow(event: boolean) {
    this.showCommentWindow = true;
  }

  openShareWindow(event: boolean) {
    this.showShareWindow = true;
  }

  openReportWindow(event: boolean) {
    this.showReportWindow = true;
  }

  closeReportWindow(event: boolean) {
    this.showReportWindow = false;
  }

  closeCommentWindow(event: boolean) {
    this.showCommentWindow = false;
  }

  closeShareWindow(event: boolean) {
    this.showShareWindow = false;
  }

  setLastClickedPost(post: PostData) {
    this.lastClickedPost = post;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  checkTags(s: string, post: PostData): void {
    const tagRegex = /@([a-zA-Z0-9_]+)/g;
    let match;

    while ((match = tagRegex.exec(s)) !== null) {
      const possibleUser = match[1];
      this.notificationService.addNewTagNotification({
        id: "",
        postId: post.id,
        type: "tag",
        user: this.currentUser
      }, possibleUser);
    }
  }


  hashtagsValid(hashtags: string) {
    for (let i = 0; i < hashtags.length; i++) {
      switch (hashtags[i]) {
        case '!':
        case '@':
        case '$':
        case '%':
        case '^':
        case '&':
        case '*':
        case '(':
        case ')':
        case '+':
        case '=':
        case '{':
        case '}':
        case '[':
        case ']':
        case '|':
        case '\\':
        case ':':
        case ';':
        case '"':
        case '\'':
        case '<':
        case '>':
        case ',':
        case '.':
        case '/':
        case '?':
        case '`':
        case '~':
          return false;
      }
    }
    return true;
  }

  protected readonly localStorage = localStorage;
}
