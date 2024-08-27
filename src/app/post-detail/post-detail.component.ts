import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostData} from "../../PostData";
import {ActivatedRoute, Router} from "@angular/router";
import {PostService} from "../../services/post.service";
import {UserData} from "../../UserData";
import {UserService} from "../../services/user.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit, AfterViewInit {

  postDataObservable!: Observable<PostData>;
  currentUserObservable!: Observable<UserData>;
  currentUser!: UserData;
  currentPost!: PostData;
  @ViewChild('postref', {static: false}) postRef!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent1', {static: false}) postContent1!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent2', {static: false}) postContent2!: ElementRef<HTMLDivElement>;
  @ViewChild('postcontent3', {static: false}) postContent3!: ElementRef<HTMLDivElement>;
  ownedByActiveUser!: boolean;
  userOptionsDropdownShown: boolean = false;
  showSharePanel: boolean = false;
  showCommentPanel: boolean = false;
  showReportPanel: boolean = false;
  isLoaded: boolean = false;

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
    this.currentUserObservable = this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub)
    this.currentUserObservable.subscribe(user => this.currentUser = user);

    this.route.paramMap.subscribe(params => {
      this.postDataObservable = this.postService.getPostById(params.get('id')!)
      this.postDataObservable.subscribe(post => {
        this.currentPost = post;
      })
    });
  }

  ngAfterViewInit() {
    const jwt = JSON.parse(localStorage.getItem('auth-token')!);

    this.postDataObservable = this.postDataObservable.pipe(
      map(post => {
        let color: string[] = post.color.substring(4, post.color.length - 1).split(",");
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
          this.postRef.nativeElement.style.backgroundColor = post.color;
          this.postContent1.nativeElement.style.backgroundColor = _darkColor;
          this.postContent2.nativeElement.style.backgroundColor = _darkColor;
          this.postContent3.nativeElement.style.backgroundColor = _darkColor;
        }

        return post;
      })
    );
  }

  triggerUserOptions(): void {
    this.userOptionsDropdownShown = !this.userOptionsDropdownShown;
  }

  likeDetail(event: Event): void {
    const target = event.target as HTMLImageElement;

    if (target.src.endsWith('/icons/heart.png')) {
      this.currentUserObservable = this.currentUserObservable.pipe(
        map(user => {
          this.postDataObservable = this.postDataObservable.pipe(
            map(post => {
              if (user.likedPosts)
                user.likedPosts.push(post);
              else
                user.likedPosts = [post];

              this.postService.updatePost(post, 'add-like');
              post.likes++;

              return post;
            })
          );
          return user;
        })
      )
      target.src = '/icons/heart-liked.png';
    } else {
      this.currentUserObservable = this.currentUserObservable.pipe(
        map(user => {
          this.postDataObservable = this.postDataObservable.pipe(
            map(post => {
              user.likedPosts = user.likedPosts?.filter(element => element.id !== post.id);
              this.postService.updatePost(post, 'remove-like');
              post.likes--;

              return post;
            })
          );
          return user;
        })
      );
      target.src = '/icons/heart.png';
    }
  }

  commentDetail(): void {
    this.showCommentPanel = true;
  }

  stopCommentingDetail(event: any): void {
    this.showCommentPanel = false;
  }

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

  stopSharingDetail(event: any): void {
    this.showSharePanel = false;
  }

  reportDetail(): void {
    this.showReportPanel = true;
  }

  stopReportingDetail(event: any): void {
    this.showReportPanel = false;
  }

  deletePostDetail(): void {
    if (confirm("Are you really sure you want to delete this post?"))
      this.postDataObservable.subscribe(post => {
        this.postService.deletePost(post)
      });
  }

  reportPost() {
    if (confirm("Are you COMPLETELY sure you want to report this post? No further action is required! Admins will analyze this post.")) {
      // send report
      alert("Thank you for helping us keep PostItter a better place! Our admins will give a close look to the post.");
    }
  }

}
