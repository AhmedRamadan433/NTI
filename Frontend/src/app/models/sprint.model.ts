export interface Sprint {
  _id: string;
  name: string;
  goal: string;
  project: string;
  startDate: string;
  endDate: string;
  status: "planned" | "active" | "completed";
  createdAt: string;
  updatedAt: string;
}
