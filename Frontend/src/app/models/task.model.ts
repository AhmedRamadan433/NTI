export interface Task {
  _id: string;
  name: string;
  description: string;
  sprint?: string;
  labels: string[];
  isArchived: boolean;
  createdBy: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "To_Do" | "In_Progress" | "Done";
  project: string;
  parentTask?: string | null;
  attachments: string[];
  assignedTo: string[];
  startDate: string;
  endDate?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
