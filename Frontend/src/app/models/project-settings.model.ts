export interface ProjectSettings {
  id: string;
  projectId: string;
  allowPublicAccess: boolean;
  defaultTaskPriority: 'low' | 'medium' | 'high' | 'urgent';
  enableSprints: boolean;
  autoArchiveDays: number;
}
