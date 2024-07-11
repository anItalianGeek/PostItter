import {PostData} from "./PostData";
import {NotificationData} from "./NotificationData";

export interface UserData {
  bio?: string;
  blockedUsers?: UserData[];
  darkMode: boolean;
  displayName: string;
  email: string;
  everyoneCanText: boolean;
  followers?: string[];
  following?: string[];
  id: string;
  likedPosts?: PostData[]; // TODO i could put here the posts where i have commented but not liked
  notifications?: NotificationData[];
  posts?: PostData[];
  privateProfile: boolean;
  profilePicture: string;
  username: string;
}
