import {UserData} from "./UserData";

export interface PostData {
  body: string | PostData;
  comments?: { user: UserData, content: string }[];
  hashtags?: string[];
  id: string;
  likes: number;
  reposts: number;
  shares: number;
  user: UserData;
  color?: string;
}
