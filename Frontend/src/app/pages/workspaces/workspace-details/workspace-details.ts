import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  input,
  effect,
} from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { WorkspaceService } from "../../../services/workspace";
import { Workspace } from "../../../models/workspace.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-workspace-details",
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./workspace-details.html",
  styleUrl: "./workspace-details.css",
})
export class WorkspaceDetails {
  workspaceId = input<string>();
  private workspaceService = inject(WorkspaceService);
  private cdr = inject(ChangeDetectorRef);

  protected workspace = signal<Workspace | null>(null);
  protected loading = signal(true);

  constructor() {
    effect(() => {
      const id = this.workspaceId();
      if (id) {
        this.loading.set(true);
        this.workspaceService.getById(id).subscribe({
          next: (res: ApiResponse<Workspace>) => {
            this.workspace.set(res.data ?? null);
            this.loading.set(false);
            this.cdr.markForCheck();
          },
          error: () => {
            this.loading.set(false);
            this.cdr.markForCheck();
          },
        });
      } else {
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }
}
