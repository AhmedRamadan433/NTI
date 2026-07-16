export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}
