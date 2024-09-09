import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserData} from "../../UserData";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Observable, of} from "rxjs";
import {PostData} from "../../PostData";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  isLoaded: boolean = false;
  @ViewChild('filters', {static: false}) searchFilters!: ElementRef<HTMLElement>;
  activatedFilter = 3;
  postsObservable!: Observable<PostData[]>;
  userObservable!: Observable<UserData>;
  user!: UserData;
  lastClickedPost!: PostData;
  showAllFollowers: boolean = false;
  showAllFollowing: boolean = false;
  showCommentWindow: boolean = false;
  showShareWindow: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {
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
    this.userObservable.subscribe(user => {
      this.user = user;
      this.postsObservable = of(user.posts!)
    });
    this.isLoaded = true;
  }

  changeFilter(index: number): void {
    this.searchFilters.nativeElement.getElementsByTagName('li')[this.activatedFilter].classList.remove('selected');
    this.searchFilters.nativeElement.getElementsByTagName('li')[index].classList.add('selected');
    this.activatedFilter = index;
    switch (index) {
      case 0:
        this.userObservable.subscribe(user => this.postsObservable = of(user.likedPosts!));
        break;
      case 1:
        this.userObservable.subscribe(user => this.postsObservable = of(user.commentedPosts!));
        break;
      case 2:
        // reposting not implemented yet!!
        break;
      case 3:
        this.userObservable.subscribe(user => this.postsObservable = of(user.posts!));
        break;
    }
  }

  showFollowers(): void {
    this.showAllFollowers = true;
  }

  showFollowing(): void {
    this.showAllFollowing = true;
  }

  closeFollowersWindow(): void {
    this.showAllFollowers = false;
  }

  closeFollowingWindow(): void {
    this.showAllFollowing = false;
  }

  closeCommentingWindow(event: any): void {
    this.showCommentWindow = false;
  }

  showCommentingWindow(event: any): void {
    this.showCommentWindow = true;
  }

  showSharingWindow(event: any): void {
    this.showShareWindow = true;
  }

  closeSharingWindow(event: any): void {
    this.showShareWindow = false;
  }

  setLastClickedPost(post: PostData) {
    this.lastClickedPost = post;
  }

  protected readonly localStorage = localStorage;
}
