export interface Comment {
  _id: string;
  content: string;
  task: string;
  author: string;
  attachments: string[];
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
