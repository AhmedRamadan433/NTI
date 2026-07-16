import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TaskService } from "../../../services/task";
import { Task } from "../../../models/task.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./task-list.html",
  styleUrl: "./task-list.css",
})
export class TaskListComponent {
  workspaceId = input<string>();
  projectId = input<string>();

  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  protected tasks = signal<Task[]>([]);
  protected loading = signal(true);

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const projId = this.projectId();
    if (!projId) return;

    this.taskService.list(projId).subscribe({
      next: (res: ApiResponse<Task[]>) => {
        this.tasks.set(res.data ?? []);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.tasks.set([]);
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
