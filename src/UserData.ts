import {PostData} from "./PostData";
import {NotificationData} from "./NotificationData";

export interface UserData {
  bio?: string;
  blockedUsers?: UserData[];
  commentedPosts?: PostData[];
  darkMode: boolean;
  displayName: string;
  email: string;
  everyoneCanText: boolean;
  followers?: UserData[];
  following?: UserData[];
  id: string;
  likedPosts?: PostData[];
  notifications?: NotificationData[];
  posts?: PostData[];
  privateProfile: boolean;
  profilePicture: string;
  username: string;
}
