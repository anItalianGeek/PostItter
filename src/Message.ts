export interface Message {
  content: any;
  file_url?: string;
  sender_username: string;
  sent_at: Date | string;
}
