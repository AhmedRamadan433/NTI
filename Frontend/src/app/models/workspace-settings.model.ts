export interface WorkspaceSettings {
  _id: string;
  workspace: string;
  visibility: "public" | "private";
  allowInvitations: boolean;
  createdAt: string;
  updatedAt: string;
}
