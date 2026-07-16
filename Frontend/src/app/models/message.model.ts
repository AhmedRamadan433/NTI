export interface Message {
  _id: string;
  chat: string;
  sender: string;
  content: string;
  workspace?: string;
  project?: string;
  team?: string;
  receiver?: string;
  attachments: string[];
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
