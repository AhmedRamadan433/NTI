export interface WorkspaceMember {
  user: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: WorkspaceMember[];
  avatar: string;
  visibility: "private" | "public";
  createdAt: string;
  updatedAt: string;
}
