import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../services/task';
import { Task } from '../../../models/task.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-task-delete',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-delete.html',
  styleUrl: './task-delete.css',
})
export class TaskDelete {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected workspaceId = '';
  protected projectId = '';
  protected taskId = '';
  protected task = signal<Task | null>(null);
  protected loading = signal(true);
  protected deleting = signal(false);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.workspaceId = params.get('workspaceId') ?? '';
      this.projectId = params.get('projectId') ?? '';
      this.taskId = params.get('taskId') ?? '';
      if (this.taskId) {
        this.loadTask();
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadTask(): void {
    this.taskService.getById(this.taskId).subscribe({
      next: (res: ApiResponse<Task>) => {
        this.task.set(res.data ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmDelete(): void {
    this.deleting.set(true);
    this.taskService.delete(this.taskId).subscribe({
      next: () => {
        this.router.navigate(['/workspaces', this.workspaceId, 'projects', this.projectId, 'tasks']);
      },
      error: () => this.deleting.set(false),
    });
  }
}
