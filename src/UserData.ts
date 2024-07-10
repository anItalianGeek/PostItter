import {PostData} from "./PostData";

export interface UserData {
  bio?: string;
  blockedUsers?: UserData[];
  darkMode: boolean;
  displayName: string;
  email: string;
  everyoneCanText: boolean;
  followers: number;
  following: number;
  id: string;
  likedPosts?: PostData[];
  notifications?: { type: string; user: UserData, message: string }[];
  posts?: PostData[];
  privateProfile: boolean;
  profilePicture: string;
  username: string;
}
