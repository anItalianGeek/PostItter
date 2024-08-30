import {Message} from "./Message";
import {UserData} from "./UserData";

export interface Chat {
  chatId: string;
  chatName: string;
  members: UserData[];
  lastMessage?: Message;
}
