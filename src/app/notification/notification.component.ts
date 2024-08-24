import {Component, Input, OnInit} from '@angular/core';
import {NotificationData} from "../../NotificationData";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {

  @Input() notification!: NotificationData;

  constructor(private router: Router) {
  }

  ngOnInit() {
    switch (this.notification.type) {
      case 'new-message':
        this.notification.message = "sent you a message.";
        break;
      case 'new-follow':
        this.notification.message = "started following you.";
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

  performAction(): void { // TODO obviously this method is not finished yet, routing is incomplete
    switch (this.notification.type) {
      case 'new-message':
        // open chat, not implemented yet
        break;
      case 'new-follow':
        this.router.navigateByUrl('/users/' + this.notification.user.id);
        break;
      case 'new-like':
        this.router.navigateByUrl('/posts/' + this.notification.postId);
        break;
      case 'new-comment':
        this.router.navigateByUrl('/posts/' + this.notification.postId);
        break;
      case 'tag':
        this.router.navigateByUrl('/posts/' + this.notification.postId);
        // navigate to entity
        break;
    }
  }

}
