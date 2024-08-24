import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {PostService} from "../../services/post.service";
import {PostData} from "../../PostData";
import {UserData} from "../../UserData";

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

  constructor(private postService: PostService) {
  }

  cancelComment(): void {
    this.showCommentWindowChange.emit(false);
  }

  sendComment(): void {
    let content: string = this.content.nativeElement.value;
    this.postService.updatePost(this.post, 'add-comment', {user: this.currentUser, content: content})

    this.showCommentWindowChange.emit(false);
  }

}
