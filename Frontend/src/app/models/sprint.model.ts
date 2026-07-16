export interface Sprint {
  _id: string;
  name: string;
  project: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
