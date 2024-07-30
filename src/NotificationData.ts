import {UserData} from "./UserData";

export interface NotificationData {
  message?: string;
  postId?: string;
  type: string;
  user: UserData;
}
