export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  sprint?: string;
  assignee?: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}
