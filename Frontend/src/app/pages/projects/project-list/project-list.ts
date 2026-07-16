import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  input,
  OnInit,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProjectService } from "../../../services/project";
import { Project } from "../../../models/project.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-project-list",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./project-list.html",
  styleUrl: "./project-list.css",
})
export class ProjectListComponent implements OnInit {
  workspaceId = input<string>();

  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);

  protected projects = signal<Project[]>([]);
  protected loading = signal(true);

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    const wsId = this.workspaceId();

    if (!wsId) {
      console.error("Workspace ID is undefined!");
      this.loading.set(false);
      return;
    }

    this.projectService.list(wsId).subscribe({
      next: (res: ApiResponse<Project[]>) => {
        this.projects.set(res.data ?? []);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.projects.set([]);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
