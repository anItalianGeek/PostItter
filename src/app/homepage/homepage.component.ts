import {Component, OnInit} from '@angular/core';
import {PostData} from "../../PostData";
import {Router} from "@angular/router";
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {UserData} from "../../UserData";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  isLoaded: boolean = false;
  posts: PostData[] = [];
  currentUser!: UserData;
  lastClickedPost!: PostData;
  createPostProcedure: boolean = false;
  showCommentWindow: boolean = false;
  showReportWindow: boolean = false;
  showShareWindow: boolean = false;

  constructor(private router: Router, private postService: PostService, private userService: UserService) {
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
    forkJoin({
      dataUser: this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub),
      dataPosts: this.postService.getPosts()
    }).subscribe(response => {
      this.posts = response.dataPosts;
      this.currentUser = response.dataUser;
    });
  }

  createPost() {
    this.createPostProcedure = true;
  }

  confirmCreation() {
    const post: PostData | undefined = undefined;
    this.postService.addNewPost(post!);
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

}
