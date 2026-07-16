export interface Chat {
  id: string;
  workspaceId: string;
  name: string;
  participantIds: string[];
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}
