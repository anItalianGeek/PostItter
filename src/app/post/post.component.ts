import {Component, Input} from '@angular/core';
import {PostData} from "../../PostData";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

  @Input() post!: PostData;
  userOptionsDropdownShown: boolean;

  constructor() {
    this.userOptionsDropdownShown = false;
  }

  triggerUserOptions(): void {
    this.userOptionsDropdownShown = !this.userOptionsDropdownShown;
  }

  like(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target.src.endsWith('/icons/heart.png')) {
      if (this.post.user.likedPosts)
        this.post.user.likedPosts.push(this.post);
      else
        this.post.user.likedPosts = [this.post];
      this.post.likes++;
      target.src = '/icons/heart-liked.png';
    } else {
      this.post.user.likedPosts = this.post.user.likedPosts?.filter(post => post.id !== this.post.id);
      this.post.likes--;
      target.src = '/icons/heart.png';
    }
  }

  comment(event: Event): void {

  }

  repost(event: Event): void {

  }

  share(event: Event): void {

  }

}
