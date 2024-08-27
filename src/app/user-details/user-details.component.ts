import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserData} from "../../UserData";
import {PostData} from "../../PostData";
import {NotificationsService} from "../../services/notifications.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {

  isLoaded: boolean = false;
  @ViewChild('dropdown', {static: false}) dropdown!: ElementRef<HTMLElement>;
  userBlockOption: boolean = false;
  showReportWindow: boolean = false;
  showCommentWindow: boolean = false;
  showShareWindow: boolean = false;
  showAllFollowers: boolean = false;
  showAllFollowing: boolean = false;
  lastClickedPost!: PostData;
  currentUserObservable!: Observable<UserData>;
  currentUser!: UserData;
  userObservable!: Observable<UserData>;
  userFollowers!: Observable<UserData[]>;
  userFollowing!: Observable<UserData[]>;

  constructor(private router: Router, private userService: UserService, private notificationService: NotificationsService, private route: ActivatedRoute) {
    let token = localStorage.getItem('auth-token');
    if (token === null) {
      this.router.navigateByUrl('/login');
    } else {
      const jwt = JSON.parse(token);
      if (Math.floor(Date.now() / 1000) > jwt.exp)
        this.router.navigateByUrl('/login');
      else
        this.route.paramMap.subscribe(params => {
          if (params.get('id') == jwt.sub)
            router.navigateByUrl('/profile');

          this.userObservable = this.userService.getUserById(params.get('id')!);
          this.currentUserObservable = this.userService.getUserById(jwt.sub);
        });
    }
  }

  ngOnInit() {
    this.currentUserObservable.subscribe(user => this.currentUser = user);
    this.isLoaded = true; // useless?
  }

  showUserOptions(): void {
    this.userBlockOption = !this.userBlockOption;
    if (this.userBlockOption)
      this.dropdown.nativeElement.style.visibility = 'visible';
    else
      this.dropdown.nativeElement.style.visibility = 'hidden';
  }

  follow(): void {
    this.userObservable.subscribe(user => {
      if (!user.privateProfile) {
        if (this.currentUser.following)
          this.currentUser.following?.push(user);
        else
          this.currentUser.following = [user];


        this.userService.followUser(this.currentUser.id, user.id);
        this.notificationService.addNewNotification({
          id: "",
          type: "new-follow",
          user: this.currentUser
        }, user);
      } else {
        this.notificationService.addNewNotification({
          id: "",
          type: "request-follow",
          user: this.currentUser
        }, user);
        alert("Follow request has been sent!");
      }
    });
  }

  unfollow(): void {
    this.userObservable.subscribe(user => {

    });
  }

  isUserFollowed(user: UserData): boolean {
    return this.currentUser.following?.find(e => e.id === user.id) != null;
  }

  message(): void {
    // TODO must implement chatting service
  }

  block(): void {
    if (confirm("Are you really sure you want to block the currently shown user?"))
      this.userObservable.subscribe(user => {
        this.userService.blockUser((JSON.parse(localStorage.getItem('auth-token')!)).sub, user);
        this.currentUser.blockedUsers?.push(user);
        this.currentUser.following?.filter(e => e.id !== user.id);
        this.userService.unfollowUser(this.currentUser.id, user.id);
      });
  }

  setLastClickedPost(post: PostData) {
    this.lastClickedPost = post;
  }

  report(): void {
    this.showReportWindow = true;
    // TODO must implement some sort of storage to receive reports
  }

  closeReportWindow(event: any): void {
    this.showReportWindow = false;
  }

  closeCommentWindow(event: any) {
    this.showCommentWindow = false;
  }

  closeShareWindow(event: any) {
    this.showShareWindow = false;
  }

  showFollowers(): void {
    this.userObservable.subscribe(user => {
      this.userService.getFollowers(user.id).subscribe(response => {
        user.followers = response;
        this.userFollowers = of(response!)
      })
    });
    this.showAllFollowers = true;
  }

  showFollowing(): void {
    this.userObservable.subscribe(user => {
      this.userService.getFollowing(user.id).subscribe(response => {
        user.following = response;
        this.userFollowing = of(response!)
      })
    });
    this.showAllFollowing = true;
  }

  closeFollowersWindow(): void {
    this.showAllFollowers = false;
  }

  closeFollowingWindow(): void {
    this.showAllFollowing = false;
  }

  protected readonly localStorage = localStorage;
  protected readonly JSON = JSON;
}
