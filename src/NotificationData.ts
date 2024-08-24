import {UserData} from "./UserData";

export interface NotificationData {
  id: string;
  message?: string;
  postId?: string;
  type: string;
  user: UserData;
}
