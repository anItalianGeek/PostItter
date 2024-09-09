import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from "../../Message";
import {MessageService} from "../../services/message.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as signalR from "@microsoft/signalr";
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
  private hubConnection!: signalR.HubConnection;
  @ViewChild('endOfChat', {static: false}) endOfChat!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput', {static: false}) messageInput!: ElementRef<HTMLInputElement>;

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
      const chatId = params.get('id')!;
      this.messageService.getSigleChatData(chatId).subscribe(response => {
        this.currentChat = response;
      });
      this.messageService.getMessagesFromChat(chatId).subscribe(response => {
        this.chatMessages = response;
        setTimeout(() => {
          this.endOfChat.nativeElement.scrollIntoView({behavior: 'smooth'})
        }, 0);
      });
      this.initializeWebSocketConnection(chatId);
    });

    this.userService.getUserById((JSON.parse(localStorage.getItem('auth-token')!)).sub).subscribe(user => {
      this.possibleChatters = of(user.following!);
      this.possibleChatters = this.possibleChatters.pipe(map(obs => {
        obs.push(...user.followers!);
        this.currentChat.members.forEach(user => {
          obs.filter(chatter => chatter.id !== user.id)
        });
        return obs;
      }))
    });
  }

  private initializeWebSocketConnection(chatId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:3000/chatHub`, {
        withCredentials: true
      })
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connected');
        this.hubConnection.invoke('JoinChat', chatId);
      })
      .catch(err => {
        console.error('Error while starting SignalR connection: ' + err);
        setTimeout(() => this.initializeWebSocketConnection(chatId), 2500);
      });

    this.hubConnection.on('ReceiveMessage', (content: string, file_url: string, sender_username: string, sent_at: string) => {
      this.chatMessages.push({
        content: content,
        file_url: file_url,
        sender_username: sender_username,
        sent_at: new Date(sent_at)
      });
      this.endOfChat.nativeElement.scrollIntoView({behavior: 'smooth'});
    });

    this.hubConnection.onclose(() => {
      console.log('SignalR connection closed');
      setTimeout(() => this.initializeWebSocketConnection(chatId), 2500);
    });
  }


  ngOnDestroy() {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveChat', this.currentChat.chatId);
      this.hubConnection.stop();
    }
  }

  startChat(): void {
    this.showPossibleChatters = true;
  }

  createChat(user: UserData): void {
    if (confirm("Are you sure you want to add " + user.username + " to the chat?")) {
      this.showPossibleChatters = false;
      this.messageService.createChat(user.id).subscribe(response => {
        console.log('added ', response)
      });
    }
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
    this.messageInput.nativeElement.value = '';

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
    this.hubConnection.invoke('SendMessage', this.currentChat.chatId, message.content, message.file_url, message.sender_username, message.sent_at.toString())
      .catch((err: any) => console.error('Error while sending message: ' + err));
  }

  protected getFormattedDate(now: Date): string {
    const day = this.datePipe.transform(now, 'EEE'); // Abbreviated day name (e.g., "Fri")
    const date = this.datePipe.transform(now, 'd MMM'); // Day of the month and abbreviated month (e.g., "3 Sep")
    const time = this.datePipe.transform(now, 'HH:mm'); // Time in 24-hour format (e.g., "20:20")

    return `${day} ${date}, ${time}`;
  }

  protected readonly stop = stop;
  protected readonly localStorage = localStorage;
}
