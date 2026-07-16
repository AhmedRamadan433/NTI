import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  input,
} from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { ProjectService } from "../../../services/project";

@Component({
  selector: "app-delete-project",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./delete-project.html",
  styleUrl: "./delete-project.css",
})
export class DeleteProject {
  workspaceId = input<string>();
  projectId = input<string>();

  private projectService = inject(ProjectService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected deleting = signal(false);
  protected error = signal<string | null>(null);

  deleteProject(): void {
    if (this.deleting()) {
      return;
    }

    const id = this.projectId();
    const wsId = this.workspaceId();

    if (!id || !wsId) {
      this.error.set("Project ID is missing!");
      return;
    }

    this.deleting.set(true);
    this.error.set(null);

    this.projectService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.cdr.markForCheck();
        this.router.navigate(["/workspaces", wsId, "projects"]);
      },
      error: () => {
        this.error.set("Failed to delete project.");
        this.deleting.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  cancel(): void {
    this.router.navigate([
      "/workspaces",
      this.workspaceId(),
      "projects",
      this.projectId(),
    ]);
  }
}
