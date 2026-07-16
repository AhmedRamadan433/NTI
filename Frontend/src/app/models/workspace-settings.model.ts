export interface WorkspaceSettings {
  id: string;
  workspaceId: string;
  allowMemberInvites: boolean;
  defaultProjectVisibility: 'private' | 'team' | 'public';
  retentionDays: number;
}
