export interface Activity {
  _id: string;
  action: string;
  actor: string;
  entityType:
    | "workspace"
    | "project"
    | "team"
    | "sprint"
    | "task"
    | "comment"
    | "attachment";
  entityId: string;
  workspace: string;
  project?: string | null;
  sprint?: string | null;
  task?: string | null;
  team?: string | null;
  targetUser?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}
