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
import { TaskService } from "../../../services/task";
import { Task } from "../../../models/task.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-task-details",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./task-details.html",
  styleUrl: "./task-details.css",
})
export class TaskDetails {
  workspaceId = input<string>();
  projectId = input<string>();
  taskId = input<string>();

  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  protected task = signal<Task | null>(null);
  protected loading = signal(true);

  constructor() {
    effect(() => {
      const id = this.taskId();
      if (id) {
        this.loadTask(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadTask(id: string): void {
    this.taskService.getById(id).subscribe({
      next: (res: ApiResponse<Task>) => {
        this.task.set(res.data ?? null);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  protected statusClass(status: string): string {
    const map: Record<string, string> = {
      todo: "badge-neutral",
      "in-progress": "badge-info",
      review: "badge-warning",
      done: "badge-success",
    };
    return map[status] ?? "badge-neutral";
  }

  protected priorityClass(priority: string): string {
    const map: Record<string, string> = {
      low: "badge-neutral",
      medium: "badge-info",
      high: "badge-warning",
      urgent: "badge-error",
    };
    return map[priority] ?? "badge-neutral";
  }
}
