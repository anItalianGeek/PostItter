import {PostData} from "./PostData";
import {NotificationData} from "./NotificationData";

export interface UserData {
  bio?: string;
  blockedUsers?: UserData[];
  commentedPosts?: PostData[];
  darkMode?: boolean;
  privateProfile?: boolean;
  everyoneCanText?: boolean;
  twoFA?: boolean;
  likeNotification?: boolean;
  commentNotification?: boolean;
  replyNotification?: boolean;
  followNotification?: boolean;
  messageNotification?: boolean;
  displayName: string;
  email?: string;
  followers?: UserData[];
  following?: UserData[];
  id: string;
  likedPosts?: PostData[];
  notifications?: NotificationData[];
  posts?: PostData[];
  profilePicture: string;
  username: string;
}
