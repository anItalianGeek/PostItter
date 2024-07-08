import {UserData} from "./UserData";

export interface PostData {
  id: string;
  title: string;
  body: string | PostData;
  hashtags?: string[];
  user: UserData;
}
