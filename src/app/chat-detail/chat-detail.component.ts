import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from "../../Message";
import {MessageService} from "../../services/message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {WebSocketSubject} from 'rxjs/webSocket';
import {DatePipe} from "@angular/common";
import {Chat} from "../../Chat";
import {UserData} from "../../UserData";
import {map, Observable, of} from "rxjs";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.css']
})
export class ChatDetailComponent implements OnInit, OnDestroy {

  currentChat!: Chat;
  chatMessages: Message[] = [];
  showPossibleChatters: boolean = false;
  possibleChatters!: Observable<UserData[]>;
  private chatSocket!: WebSocketSubject<any>;

  constructor(private router: Router, private messageService: MessageService, private userService: UserService, private route: ActivatedRoute, private datePipe: DatePipe) {
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
    this.route.paramMap.subscribe(params => {
      this.messageService.getSigleChatData(params.get('id')!).subscribe(response => this.currentChat = response);
      this.messageService.getMessagesFromChat(params.get('id')!).subscribe(response => this.chatMessages = response);
      this.initializeWebSocketConnection(params.get('id')!);
    });

    this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub).subscribe(user => {
      this.possibleChatters = of(user.following!);
      this.possibleChatters = this.possibleChatters.pipe(map(obs => {
        obs.push(...user.followers!);
        return obs;
      }))
    });
  }

  private initializeWebSocketConnection(chatId: string) {
    this.chatSocket = new WebSocketSubject(`ws://localhost:5265/ws/chat/${chatId}`);

    this.chatSocket.subscribe(
      (message: Message) => {
        message.sent_at = this.getFormattedDate(<Date>message.sent_at);
        this.chatMessages.push(message);
      }
    );
  }

  ngOnDestroy() {
    if (this.chatSocket) {
      this.chatSocket.complete();
    }
  }

  startChat(): void {
    this.showPossibleChatters = true;
  }

  createChat(user: UserData): void {
    this.showPossibleChatters = false;
    this.messageService.createChat(user.id)
    alert(user.username + " has been added to the chat!");
  }

  stopChatCreation(): void {
    this.showPossibleChatters = false;
  }

  viewAttachment(url: string): void {
    if (confirm("Do you want to open the following link: " + url + "? Remember that opening a link might be dangerous. Only open it if you fully trust the source or the sender of the link.")) {
      window.open(url, "_blank");
    }
  }

  sendMessage(content: string, files: FileList | null): void {
    let message: Message = {
      content: content,
      file_url: "",
      sender_username: (JSON.parse(localStorage.getItem('auth-token')!)).username,
      sent_at: new Date()
    };

    if (files && files.length > 0) {
      let mediaMessage: Message = {
        content: files[0],
        file_url: files[0].name,
        sender_username: (JSON.parse(localStorage.getItem('auth-token')!)).username,
        sent_at: new Date()
      };
      this.messageService.sendMessage(this.currentChat, mediaMessage);
    }

    this.messageService.sendMessage(this.currentChat, message);
  }

  private getFormattedDate(now: Date): string {
    const day = this.datePipe.transform(now, 'EEEE'); // Full day name (e.g., "Monday")
    const time = this.datePipe.transform(now, 'HH:mm'); // Time in 24-hour format (e.g., "12:21")

    return `${day} ${time}`;
  }
}
