import {Component, Input} from '@angular/core';
import {Post} from "../../Post";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

  @Input() post!: Post;
  userOptionsDropdownShown: boolean;

  constructor() {
    this.userOptionsDropdownShown = false;
  }

  triggerUserOptions(): void {
    this.userOptionsDropdownShown = !this.userOptionsDropdownShown;
  }

}
