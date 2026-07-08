enum JobStatus {
  Open,
  InProgress,
  Review,
  Completed,
}
type Skill = "TypeScript" | "NodeJS" | "React" | "UI/UX";

interface IUser {
  id: number;
  name: string;
  email: string;
}
interface IFreelancer extends IUser {
  skills: Skill[];
  hourlyRate: number;
}
interface IClient extends IUser {
  budget: number;
}
interface IProject {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: JobStatus;
  clientId: number;
  assignedFreelancerId?: number;
}
///////
class Proposal {
  constructor(
    readonly id: number,
    readonly projectId: number,
    readonly freelancerId: number,
    readonly proposedRate: number,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.freelancerId = freelancerId;
    this.proposedRate = proposedRate;
  }
}
///// PlatformManager class
class PlatformManager {
  private freelancers: IFreelancer[] = [];
  private clients: IClient[] = [];
  private projects: IProject[] = [];
  private proposals: Proposal[] = [];
  static totalPlatformRevenue: number = 0;
  addProject(project: IProject): void {
    console.log("Adding project:", project);
    this.projects.push(project);
  }
  addFreelancer(freelancer: IFreelancer): void {
    console.log("Adding freelancer:", freelancer);
    this.freelancers.push(freelancer as IFreelancer);
  }
  addClient(client: IClient): void {
    console.log("Adding client:", client);
    if (client.budget < 0) {
      throw new Error("Budget cannot be negative");
    }
    this.clients.push(client);
  }
  submitProposal(proposal: Proposal): void {
    console.log("Submitting proposal:", proposal);
    const project = this.projects.find((p) => p.id === proposal.projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    const freelancer = this.freelancers.find(
      (f) => f.id === proposal.freelancerId,
    );
    if (!freelancer) {
      throw new Error("Freelancer not found");
    }
    this.proposals.push(proposal);
  }
  assignProject(projectId: number, freelancerId: number): void {
    console.log("Assigning project:", projectId, freelancerId);
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    const freelancer = this.freelancers.find((f) => f.id === freelancerId);
    if (!freelancer) {
      throw new Error("Freelancer not found");
    }
    project.assignedFreelancerId = freelancerId;
    project.status = JobStatus.InProgress;
  }
  completeProject(projectId: number): void {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    project.status = JobStatus.Completed;
    const proposal = this.proposals.find((p) => p.projectId === project.id);
    PlatformManager.totalPlatformRevenue += proposal
      ? proposal.proposedRate * 0.1
      : 0;
    console.log("Completing project:", project);
  }
}
///////
class FilterEngine<T> {
  filterByProperty(property: keyof T, value: any, items: T[]): T[] {
    return items.filter((item) => item[property] === value);
  }
}
////////////
const manager = new PlatformManager();
manager.addClient({
  id: 1,
  name: "ahmed",
  email: "ahmed@example.com",
  budget: 1000,
});
manager.addFreelancer({
  id: 2,
  name: "mohamed",
  email: "mohamed@example.com",
  skills: ["TypeScript", "NodeJS"],
  hourlyRate: 50,
});
manager.addProject({
  id: 1,
  title: "GigLance",
  description: "A platform for freelancers",
  budget: 500,
  status: JobStatus.Open,
  clientId: 1,
});
const porposal = new Proposal(1, 1, 2, 50);
manager.submitProposal(porposal);
manager.assignProject(1, 2);

manager.completeProject(1);
////
const filterEngine = new FilterEngine<IProject>();
const f1 = filterEngine.filterByProperty(
  "status",
  JobStatus.Completed,
  manager["projects"],
);
console.log("Filtered projects:", f1);
