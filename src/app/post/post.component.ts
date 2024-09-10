import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PostData} from "../../PostData";
import {PostService} from "../../services/post.service";
import {UserData} from "../../UserData";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit, AfterViewInit {

  @Input() post!: PostData;
  @Input() currentUser!: UserData;
  @ViewChild('postref', {static: false}) postRef!: ElementRef<HTMLDivElement>;
  @ViewChild('likeBtn', {static: false}) likeBtn!: ElementRef<HTMLImageElement>;
  @ViewChild('postcontent1', {static: false}) postContent1!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent2', {static: false}) postContent2!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent3', {static: false}) postContent3!: ElementRef<HTMLDivElement>;
  userOptionsDropdownShown: boolean;
  ownedByActiveUser: boolean | undefined = undefined;
  @Output() commentWindow: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() shareWindow: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() reportWindow: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private postService: PostService, private notificationService: NotificationsService) {
    this.userOptionsDropdownShown = false;
  }

  ngOnInit() {
    let id: string = (JSON.parse(localStorage.getItem('auth-token')!)).sub;
    this.ownedByActiveUser = this.post.user.id === id;
  }

  ngAfterViewInit() {
    this.postRef.nativeElement.style.backgroundColor = this.post.color!;
    if (this.currentUser.likedPosts?.find(e => e.id === this.post.id))
      this.likeBtn.nativeElement.src = '/icons/heart-liked.png';
  }

  triggerUserOptions(): void {
    this.userOptionsDropdownShown = !this.userOptionsDropdownShown;
  }

  like(event: Event): void {
    const target = event.target as HTMLImageElement;

    if (target.src.endsWith('/icons/heart.png')) {
      if (this.currentUser.likedPosts)
        this.currentUser.likedPosts.push(this.post);
      else
        this.currentUser.likedPosts = [this.post];
      this.postService.updatePost(this.post, 'add-like');
      this.notificationService.addNewNotification({
        id: "",
        user: this.currentUser,
        postId: this.post.id,
        type: "new-like"
      }, this.post.user, true);
      target.src = '/icons/heart-liked.png';
    } else {
      this.currentUser.likedPosts = this.currentUser.likedPosts?.filter(post => post.id !== this.post.id);
      this.postService.updatePost(this.post, 'remove-like');
      target.src = '/icons/heart.png';
    }
  }

  comment(): void {
    this.commentWindow.emit(true);
  }

  repost(): void {
    /**
     *
     * not implemented yet
     *
     * */
  }

  share(): void {
    this.shareWindow.emit(true);
  }

  deletePost(): void {
    if (confirm("Are you really sure you want to delete this post?"))
      this.postService.deletePost(this.post);
  }

  reportUser() {
    this.reportWindow.emit(true);
  }

  reportPost() {
    if (confirm("Are you COMPLETELY sure you want to report this post? No further action is required! Admins will analyze this post.")) {
      // send report
      alert("Thank you for helping us keep PostItter a better place! Our admins will give a close look to the post.");
    }
  }

  protected readonly localStorage = localStorage;
}
