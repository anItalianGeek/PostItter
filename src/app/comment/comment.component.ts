import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {PostService} from "../../services/post.service";
import {PostData} from "../../PostData";
import {UserData} from "../../UserData";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

  @Input() post!: PostData;
  @Input() currentUser!: UserData;
  @ViewChild('content', {static: false}) content!: ElementRef<HTMLTextAreaElement>;
  @Output() showCommentWindowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private postService: PostService, private notificationService: NotificationsService) {
  }

  cancelComment(): void {
    this.showCommentWindowChange.emit(false);
  }

  sendComment(): void {
    let content: string = this.content.nativeElement.value;
    this.postService.updatePost(this.post, 'add-comment', {user: this.currentUser, content: content})
    this.checkTags(content);
    this.notificationService.addNewNotification({
      id: "",
      postId: this.post.id,
      type: "new-comment",
      user: this.currentUser
    }, this.post.user, true);
    this.showCommentWindowChange.emit(false);
  }

  checkTags(s: string): void {
    const tagRegex = /@([a-zA-Z0-9_]+)/g;
    let match;

    while ((match = tagRegex.exec(s)) !== null) {
      const possibleUser = match[1];
      this.notificationService.addNewTagNotification({
        id: "",
        postId: this.post.id,
        type: "tag",
        user: this.currentUser
      }, possibleUser);
    }
  }


  protected readonly localStorage = localStorage;
}
