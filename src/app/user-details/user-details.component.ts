import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserData} from "../../UserData";
import {PostData} from "../../PostData";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

  isLoaded: boolean = false;
  @ViewChild('dropdown', {static: false}) dropdown!: ElementRef<HTMLElement>;
  userBlockOption: boolean = false;
  showReportWindow: boolean = false;
  showCommentWindow: boolean = false;
  showShareWindow: boolean = false;
  showAllFollowers: boolean = false;
  showAllFollowing: boolean = false;
  lastClickedPost!: PostData;
  currentUser!: UserData;
  user!: UserData;

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute) {
    let token = localStorage.getItem('auth-token');
    if (token === null) {
      router.navigateByUrl('/login');
    } else {
      const jwt = JSON.parse(token);
      if (Math.floor(Date.now() / 1000) > jwt.exp)
        router.navigateByUrl('/login');
      else {
        this.route.paramMap.subscribe(params => {
          if (params.get('id') == jwt.sub)
            router.navigateByUrl('/profile');

          this.userService.getUserById(params.get('id')!).subscribe(res => this.user = res);
          this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub).subscribe(res => {
            this.currentUser = res;
            this.isLoaded = true;
          });
        });
      }
    }

  }

  showUserOptions(): void {
    this.userBlockOption = !this.userBlockOption;
    if (this.userBlockOption)
      this.dropdown.nativeElement.style.visibility = 'visible';
    else
      this.dropdown.nativeElement.style.visibility = 'hidden';
  }

  canUserSeePosts(): boolean {
    return (this.user.blockedUsers?.find(element => element.id == this.currentUser.id) == null);
  }


  userCanText(currentId: string): boolean {
    if (!this.canUserSeePosts()) return false;

    if (this.user.everyoneCanText) return true;
    else if (this.user.followers?.find(element => element.id == this.currentUser.id) == null) return false;
    else return true;
  }

  follow(): void {
    if (this.currentUser.following)
      this.currentUser.following?.push(this.user);
    else
      this.currentUser.following = [this.user];

    if (this.user.followers)
      this.user.followers.push(this.user);
    else
      this.user.followers = [this.user];

    this.userService.followUser(this.currentUser.id, this.user.id);
  }

  message(): void {
    // TODO must implement chatting service
  }

  block(): void {
    if (confirm("Are you really sure you want to block the currently shown user?"))
      this.userService.blockUser((JSON.parse(localStorage.getItem('auth-token')!)).sub, this.user);
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

  protected readonly localStorage = localStorage;
  protected readonly JSON = JSON;
}
