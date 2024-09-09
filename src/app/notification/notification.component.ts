import {Component, Input, OnInit} from '@angular/core';
import {NotificationData} from "../../NotificationData";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {

  @Input() notification!: NotificationData;

  constructor(private router: Router, private userService: UserService, private notificationService: NotificationsService) {
  }

  ngOnInit() {
    switch (this.notification.type) {
      case 'new-message':
        this.notification.message = "sent you a message.";
        break;
      case 'new-follow':
        this.notification.message = "started following you.";
        break;
      case 'request-follow':
        this.notification.message = "requested to follow you.";
        break;
      case 'accepted-follow-request':
        this.notification.message = "accepted your follow request.";
        break;
      case 'new-like':
        this.notification.message = "liked your post.";
        break;
      case 'new-comment':
        this.notification.message = "commented on one of your posts.";
        break;
      case 'tag':
        this.notification.message = "tagged you.";
        break;
    }
  }

  performAction(): void {
    switch (this.notification.type) {
      case 'new-message':
        this.router.navigateByUrl('/chats/' + this.notification.postId); // postId can be used as chatId here
        break;
      case 'new-follow':
      case 'request-follow':
      case 'accepted-follow-request':
        this.router.navigateByUrl('/users/' + this.notification.user.id);
        break;
      case 'new-like':
        this.router.navigateByUrl('/posts/' + this.notification.postId);
        break;
      case 'new-comment':
        localStorage.setItem('new-comment-redirection', this.notification.postId + '-' + this.notification.user.id);
        this.router.navigateByUrl('/posts/' + this.notification.postId);
        break;
      case 'tag':
        localStorage.setItem('new-tag-redirection', this.notification.postId + '-' + this.notification.user.id);
        this.router.navigateByUrl('/posts/' + this.notification.postId);
        break;
    }
  }

  acceptRequest(): void {
    if (confirm("Are you sure you want to allow " + this.notification.user.username + " to follow you?")) {
      const jwt = JSON.parse(localStorage.getItem('auth-token')!);
      this.userService.followUser(this.notification.user.id, jwt.sub, this.notification);
      this.notificationService.addNewNotification({
        id: "",
        type: 'accepted-follow-request',
        user: {id: jwt.sub, username: '', displayName: '', profilePicture: ''}
      }, this.notification.user, true);
    }
  }

  protected readonly localStorage = localStorage;
}
