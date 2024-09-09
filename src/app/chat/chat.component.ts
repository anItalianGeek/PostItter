import {Component, Input} from '@angular/core';
import {Chat} from "../../Chat";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  @Input() chat!: Chat;

  constructor(private messageService: MessageService) {
  }

  deleteChat(id: string, event: Event): void {
    event.stopImmediatePropagation();
    if (confirm("Are you sure you want to delete this chat?"))
      this.messageService.deleteChat(id);
  }


  protected readonly localStorage = localStorage;
}
