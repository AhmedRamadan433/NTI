export interface Project {
  _id: string;
  projectName: string;
  projectDescription: string;
  projectEndDate?: string;
  projectStatus: "Not Started" | "In Progress" | "Completed";
  projectPriority: "Low" | "Medium" | "High";
  projectOwner: string;
  workspace: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
