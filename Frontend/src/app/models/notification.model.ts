export interface Notification {
  _id: string;
  recipient: string;
  sender?: string;
  title: string;
  message: string;
  type:
    | "task_assigned"
    | "task_updated"
    | "task_completed"
    | "task_comment"
    | "project_invite"
    | "workspace_invite"
    | "team_invite";
  isRead: boolean;
  link: string;
  createdAt: string;
  updatedAt: string;
}
