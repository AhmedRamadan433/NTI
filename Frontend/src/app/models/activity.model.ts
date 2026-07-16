export interface Activity {
  id: string;
  userId: string;
  type: string;
  description: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
