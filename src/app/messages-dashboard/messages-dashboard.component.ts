import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {map, Observable, of} from "rxjs";
import {MessageService} from "../../services/message.service";
import {Chat} from "../../Chat";
import {UserData} from "../../UserData"
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-messages-dashboard',
  templateUrl: './messages-dashboard.component.html',
  styleUrl: './messages-dashboard.component.css'
})
export class MessagesDashboardComponent implements OnInit {

  isLoaded: boolean = false;
  userChats!: Observable<Chat[]>;
  possibleChatters!: Observable<UserData[]>;
  showPossibleChatters: boolean = false;

  constructor(private router: Router, private messageService: MessageService, private userService: UserService) {
    let token = localStorage.getItem('auth-token');
    if (token === null) {
      router.navigateByUrl('/login');
    } else {
      token = JSON.parse(token);
      // @ts-ignore
      if (Math.floor(Date.now() / 1000) > token.exp)
        router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    this.userChats = this.messageService.getAllChats();

    this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub).subscribe(user => {
      this.possibleChatters = of(user.following!);
      this.possibleChatters = this.possibleChatters.pipe(map(obs => {
        obs.push(...user.followers!);
        return obs;
      }))
    });

    this.isLoaded = true;
  }

  startChat(): void {
    this.showPossibleChatters = true;
  }

  createChat(user: UserData): void {
    this.showPossibleChatters = false;
    this.messageService.createChat(user.id).subscribe(response => {
      this.router.navigateByUrl('/chats/' + response.chatId)
    });
  }

  stopChatCreation(): void {
    this.showPossibleChatters = false;
  }

  protected readonly localStorage = localStorage;
}
