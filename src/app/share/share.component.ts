import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {forkJoin} from 'rxjs';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {PostService} from '../../services/post.service';
import {MessageService} from '../../services/message.service';
import {UserData} from '../../UserData';
import {PostData} from '../../PostData';
import {Message} from '../../Message';
import {Chat} from '../../Chat';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  @Input() currentUser!: UserData;
  @Input() postToShare!: PostData;
  @Output() showShareWindowChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  possibleUsers!: UserData[];

  constructor(
    private userService: UserService,
    private postService: PostService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    forkJoin({
      followers: this.userService.getFollowers(this.currentUser.id),
      following: this.userService.getFollowing(this.currentUser.id)
    }).subscribe(response => {
      this.possibleUsers = [...response.following!, ...response.followers!];
    });
  }

  closeShareMenu(): void {
    this.showShareWindowChange.emit(false);
  }

  share(user: UserData): void {
    let msg: string = `Are you sure you want to share with ${user.username}?`;
    if (confirm(msg)) {
      this.messageService.getAllChats().subscribe(chats => {
        let message: Message = {
          content: `Hey! Check out this post I found! http://localhost:4200/posts/${this.postToShare.id}`,
          file_url: this.router.url,
          sender_username: this.currentUser.username,
          sent_at: new Date()
        };

        let searchedChat: Chat | undefined = chats.find(chat => {
          return chat.members.length === 2 &&
            ((chat.members[0].id === this.currentUser.id && chat.members[1].id === user.id) ||
              (chat.members[0].id === user.id && chat.members[1].id === this.currentUser.id));
        });

        console.log(searchedChat)
        if (searchedChat) {
          this.messageService.sendMessage(searchedChat, message);
        } else {
          this.messageService.createChat(user.id).subscribe(createdChat => {
            this.messageService.sendMessage(createdChat, message);
          });
        }
      });

      this.postService.updatePost(this.postToShare, 'share');
    }
  }

  protected readonly localStorage = localStorage;
}
