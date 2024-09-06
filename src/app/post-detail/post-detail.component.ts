import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class PostDetailComponent implements OnInit, OnDestroy {

  postDataObservable!: Observable<PostData>;
  currentUserObservable!: Observable<UserData>;
  currentUser!: UserData;
  currentPost!: PostData;
  // todo entity, post or comment, find it by looping through user data and using localstorage
  @ViewChild('postref', {static: false}) postRef!: ElementRef<HTMLDivElement>;
  ownedByActiveUser!: boolean;
  userOptionsDropdownShown: boolean = false;
  showSharePanel: boolean = false;
  showCommentPanel: boolean = false;
  showReportPanel: boolean = false;
  isLoaded: boolean = false;
  @ViewChild('main', {static: false}) main!: ElementRef<HTMLDivElement>;

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

    this.route.paramMap.subscribe(params => {
      this.postDataObservable = this.postService.getPostById(params.get('id')!)
      this.postDataObservable.subscribe(post => {
        this.currentUserObservable.subscribe(user => {
          this.currentUser = user;
          this.currentPost = post;
          this.isLoaded = true;
          this.postRef.nativeElement.style.backgroundColor = this.currentPost.color!;
          let id: string = (JSON.parse(localStorage.getItem('auth-token')!)).sub;
          this.ownedByActiveUser = this.currentPost.user.id === id;
          if (this.currentUser.likedPosts?.find(e => e.id === this.currentPost.id))
            (document.getElementsByClassName('icon')[0].firstElementChild as HTMLImageElement).src = '/icons/heart-liked.png';
        });
      })
    });
  }

  ngOnDestroy() {
    if (localStorage.getItem('new-redirection') != null)
      localStorage.removeItem('new-redirection');
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
