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

}
