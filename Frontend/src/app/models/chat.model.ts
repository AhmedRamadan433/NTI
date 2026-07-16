export interface Chat {
  _id: string;
  name: string;
  type: "direct" | "team" | "project";
  workspace: string;
  participants: string[];
  project?: string;
  team?: string;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}
