export interface Attachment {
  _id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  workspace?: string;
  project?: string;
  task?: string;
  comment?: string;
  message?: string;
  chat?: string;
  createdAt: string;
  updatedAt: string;
}
