export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined';
  invitedById: string;
  expiresAt: string;
  createdAt: string;
}
