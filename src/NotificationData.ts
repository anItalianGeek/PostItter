import {UserData} from "./UserData";

export interface NotificationData {
  type: string;
  message?: string;
  user: UserData;
  postId?: string;
}
