import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  input,
  effect,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { WorkspaceService } from "../../../services/workspace";
import { Workspace } from "../../../models/workspace.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-delete-workspace",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./delete-workspace.html",
  styleUrl: "./delete-workspace.css",
})
export class DeleteWorkspace {
  workspaceId = input<string>();
  private workspaceService = inject(WorkspaceService);
  private router = inject(Router);

  protected workspace = signal<Workspace | null>(null);
  protected loading = signal(true);
  protected deleting = signal(false);

  constructor() {
    effect(() => {
      const id = this.workspaceId();
      if (id) {
        this.loading.set(true);
        this.workspaceService.getById(id).subscribe({
          next: (res: ApiResponse<Workspace>) => {
            this.workspace.set(res.data ?? null);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      } else {
        this.loading.set(false);
      }
    });
  }

  confirmDelete(): void {
    const id = this.workspaceId();
    if (!id) return;

    this.deleting.set(true);
    this.workspaceService.delete(id).subscribe({
      next: () => {
        this.router.navigate(["/workspaces"]);
      },
      error: () => {
        this.deleting.set(false);
      },
    });
  }
}
