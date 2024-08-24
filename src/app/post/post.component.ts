import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PostData} from "../../PostData";
import {PostService} from "../../services/post.service";
import {UserData} from "../../UserData";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit, AfterViewInit {

  @Input() post!: PostData;
  @Input() currentUser!: UserData;
  @ViewChild('postref', {static: false}) postRef!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent1', {static: false}) postContent1!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent2', {static: false}) postContent2!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent3', {static: false}) postContent3!: ElementRef<HTMLDivElement>;
  userOptionsDropdownShown: boolean;
  ownedByActiveUser: boolean | undefined = undefined;
  @Output() commentWindow: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() shareWindow: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() reportWindow: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private postService: PostService) {
    this.userOptionsDropdownShown = false;
  }

  ngOnInit() {
    let id: string = (JSON.parse(localStorage.getItem('auth-token')!)).sub;
    this.ownedByActiveUser = this.post.id === id;
  }

  ngAfterViewInit() {
    const jwt = JSON.parse(localStorage.getItem('auth-token')!);

    let color: string[] = this.post.color.substring(4, this.post.color.length - 1).split(",");
    let darkColor: number[] = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      darkColor[i] = Math.floor(Number(color[i]) * 0.85);
    }
    let _darkColor = "rgb(" + darkColor[0] + "," + darkColor[1] + "," + darkColor[2] + ");";

    if (jwt.darkMode) {
      this.postRef.nativeElement.style.backgroundColor = _darkColor;
      this.postContent1.nativeElement.style.backgroundColor = _darkColor;
      this.postContent2.nativeElement.style.backgroundColor = _darkColor;
      this.postContent3.nativeElement.style.backgroundColor = _darkColor;
    } else {
      this.postRef.nativeElement.style.backgroundColor = this.post.color;
      this.postContent1.nativeElement.style.backgroundColor = _darkColor;
      this.postContent2.nativeElement.style.backgroundColor = _darkColor;
      this.postContent3.nativeElement.style.backgroundColor = _darkColor;
    }
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
    }
  }

}
