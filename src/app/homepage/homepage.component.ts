import {Component} from '@angular/core';
import {PostComponent} from "../post/post.component";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  posts?: PostComponent[];

}
