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
import { DatePipe } from "@angular/common";
import { SprintService } from "../../../services/sprint";
import { Sprint } from "../../../models/sprint.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-sprint-list",
  standalone: true,
  imports: [RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sprint-list.html",
  styleUrl: "./sprint-list.css",
})
export class SprintList {
  workspaceId = input<string>();
  projectId = input<string>();

  private sprintService = inject(SprintService);
  private cdr = inject(ChangeDetectorRef);

  protected sprints = signal<Sprint[]>([]);
  protected loading = signal(true);

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) {
        this.loadSprints(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadSprints(projectId: string): void {
    this.loading.set(true);
    this.sprintService.list(projectId).subscribe({
      next: (res: ApiResponse<Sprint[]>) => {
        this.sprints.set(res.data ?? []);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.sprints.set([]);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
