export interface WorkspaceInvitation {
  _id: string;
  workspace: string;
  sender: string;
  recipient: string;
  token: string;
  status: "pending" | "accepted" | "declined" | "expired";
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
