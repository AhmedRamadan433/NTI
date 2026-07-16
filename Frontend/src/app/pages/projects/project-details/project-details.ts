import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  input,
  effect,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProjectService } from "../../../services/project";
import { Project } from "../../../models/project.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-project-details",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./project-details.html",
  styleUrl: "./project-details.css",
})
export class ProjectDetails {
  // Use input() signals to read from the route parameters automatically
  workspaceId = input<string>();
  projectId = input<string>();

  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);

  protected project = signal<Project | null>(null);
  protected loading = signal(true);

  constructor() {
    // Use effect to react whenever the URL parameters change
    effect(() => {
      const id = this.projectId();
      if (id) {
        this.loadProject(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadProject(id: string): void {
    this.loading.set(true);
    this.projectService.getById(id).subscribe({
      next: (res: ApiResponse<Project>) => {
        this.project.set(res.data ?? null);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error("Error loading project:", err);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
