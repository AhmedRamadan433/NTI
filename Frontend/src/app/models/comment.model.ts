export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}
