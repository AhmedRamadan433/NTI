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
import { SprintService } from "../../../services/sprint";
import { Sprint } from "../../../models/sprint.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-sprint-details",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sprint-details.html",
  styleUrl: "./sprint-details.css",
})
export class SprintDetails {
  workspaceId = input<string>();
  projectId = input<string>();
  sprintId = input<string>();

  private sprintService = inject(SprintService);
  private cdr = inject(ChangeDetectorRef);

  protected sprint = signal<Sprint | null>(null);
  protected loading = signal(true);

  constructor() {
    effect(() => {
      const id = this.sprintId();
      if (id) {
        this.loadSprint(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadSprint(id: string): void {
    this.sprintService.getById(id).subscribe({
      next: (res: ApiResponse<Sprint>) => {
        this.sprint.set(res.data ?? null);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
