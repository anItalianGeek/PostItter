import {Component} from '@angular/core';
import {Post} from "../../Post";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  posts: Post[] = [];

  constructor() {
    this.posts.push({
      title: "Billa",
      id: "0",
      body: "mi manca sofia",
      user: {
        id: 1,
        email: 'example@example.com',
        displayName: 'max verstappen',
        username: 'tha best f1 racer',
        profilePicture: ''
      }
    });
    this.posts.push({
      title: "Billa",
      id: "0",
      body: "mi manca sofia",
      user: {
        id: 1,
        email: 'example@example.com',
        displayName: 'max verstappen',
        username: 'tha best f1 racer',
        profilePicture: ''
      }
    });
    this.posts.push({
      title: "Billa",
      id: "0",
      body: "mi manca sofia",
      user: {
        id: 1,
        email: 'example@example.com',
        displayName: 'max verstappen',
        username: 'tha best f1 racer',
        profilePicture: ''
      }
    });
    this.posts.push({
      title: "Billa",
      id: "0",
      body: "mi manca sofia",
      user: {
        id: 1,
        email: 'example@example.com',
        displayName: 'max verstappen',
        username: 'tha best f1 racer',
        profilePicture: ''
      }
    });
    this.posts.push({
      title: "Billa",
      id: "0",
      body: "mi manca sofia",
      user: {
        id: 1,
        email: 'example@example.com',
        displayName: 'max verstappen',
        username: 'tha best f1 racer',
        profilePicture: ''
      }
    });
  }

}
