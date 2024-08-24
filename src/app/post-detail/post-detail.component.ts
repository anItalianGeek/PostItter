import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostData} from "../../PostData";
import {ActivatedRoute, Router} from "@angular/router";
import {PostService} from "../../services/post.service";
import {UserData} from "../../UserData";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit, AfterViewInit {

  post!: PostData;
  currentUser!: UserData;
  @ViewChild('postref', {static: false}) postRef!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent1', {static: false}) postContent1!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent2', {static: false}) postContent2!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent3', {static: false}) postContent3!: ElementRef<HTMLDivElement>;
  ownedByActiveUser!: boolean;
  userOptionsDropdownShown: boolean = false;
  showSharePanel: boolean = false;
  showCommentPanel: boolean = false;

  constructor(private router: Router, private postService: PostService, private userService: UserService, private route: ActivatedRoute) {
    let token = localStorage.getItem('auth-token');
    if (token === null) {
      router.navigateByUrl('/login');
    } else {
      const jwt = JSON.parse(token);
      // @ts-ignore
      if (Math.floor(Date.now() / 1000) > jwt.exp)
        router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub).subscribe(user => {
      this.currentUser = user;
    });

    this.route.paramMap.subscribe(params => {
      this.postService.getPostById(params.get('id')!).subscribe(result => {
        this.post = result;
      });
    });
  }

  ngAfterViewInit() {
    const jwt = JSON.parse(localStorage.getItem('auth-token')!);

    let color: string[] = this.post.color.substring(4, this.post.color.length - 1).replaceAll(" ", "").split(",");
    let darkColor: number[] = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      darkColor[i] = Number(color[i]) * 0.85;
    }
    let _darkColor = "rgb(" + darkColor[0] + ", " + darkColor[1] + ", " + darkColor[2] + ");";

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

  likeDetail(event: Event): void {
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

  commentDetail(): void {
    this.showCommentPanel = true;
  }

  /** sendCommentDetail(commentContent: string): void {
   this.showCommentPanel = false;
   if (this.currentUser.commentedPosts)
   this.currentUser.commentedPosts.push(this.post);
   else
   this.currentUser.commentedPosts = [this.post];
   const comment = {user: this.post.user, content: commentContent};
   this.postService.updatePost(this.post, 'add-comment', comment);
   } */

  repostDetail(): void {
    /**
     *
     * not implemented yet
     *
     * */
  }

  shareDetail(): void {
    this.showSharePanel = true;
  }

  sendPostDetail(post: PostData, userReceiver: string): void {
    // this.fileService.sendPost(post.id, userReceiver);
    this.postService.updatePost(post, 'share');
  }

  stopSharingDetail(): void {
    this.showSharePanel = false;
  }

  deletePostDetail(): void {
    if (confirm("Are you really sure you want to delete this post?"))
      this.postService.deletePost(this.post);
  }

}
