import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  input,
} from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { SprintService } from "../../../services/sprint";

@Component({
  selector: "app-delete-sprint",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sprint-delete.html",
  styleUrl: "./sprint-delete.css",
})
export class DeleteSprint {
  workspaceId = input<string>();
  projectId = input<string>();
  sprintId = input<string>();

  private sprintService = inject(SprintService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected deleting = signal(false);
  protected error = signal<string | null>(null);

  deleteSprint(): void {
    if (this.deleting()) {
      return;
    }

    const id = this.sprintId();
    if (!id) {
      this.error.set("Sprint ID is missing!");
      return;
    }

    this.deleting.set(true);
    this.error.set(null);

    this.sprintService.delete(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.cdr.markForCheck();
        this.router.navigate([
          "/workspaces",
          this.workspaceId(),
          "projects",
          this.projectId(),
          "sprints",
        ]);
      },
      error: () => {
        this.error.set("Failed to delete sprint.");
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
      "sprints",
      this.sprintId(),
    ]);
  }
}
