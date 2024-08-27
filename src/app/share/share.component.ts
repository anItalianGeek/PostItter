import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserData} from "../../UserData";
import {forkJoin} from "rxjs";
import {UserService} from "../../services/user.service";
import {PostData} from "../../PostData";
import {PostService} from "../../services/post.service";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrl: './share.component.css'
})
export class ShareComponent implements OnInit {

  @Input() currentUSer!: UserData;
  @Input() postToShare!: PostData;
  @Output() showShareWindowChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  possibleUsers!: UserData[];

  constructor(private userService: UserService, private postService: PostService, private notificationService: NotificationsService) {
  }

  ngOnInit() {
    forkJoin({
      followers: this.userService.getFollowers(this.currentUSer.id),
      following: this.userService.getFollowing(this.currentUSer.id)
      // chatters
    }).subscribe(response => {
      this.possibleUsers = response.following!;
      this.possibleUsers.push(...response.followers!)
    })
  }

  closeShareMenu(): void {
    this.showShareWindowChange.emit(false);
  }

  share(user: UserData): void {
    let msg: string = "Are you sure you want to share with " + user.username + "?";
    if (confirm(msg)) {
      // call message service
      this.postService.updatePost(this.postToShare, 'share');
      this.notificationService.addNewNotification({
        id: "",
        type: "new-message",
        user: this.currentUSer,
        postId: this.postToShare.id
      }, user);
      this.possibleUsers = this.possibleUsers.filter(element => element !== user);
    }
  }

}
