import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  input,
  effect,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { TaskService } from "../../../services/task";
import { Task } from "../../../models/task.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-task-edit",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./task-edit.html",
  styleUrl: "./task-edit.css",
})
export class TaskEdit {
  workspaceId = input<string>();
  projectId = input<string>();
  taskId = input<string>();

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected loading = signal(true);
  protected saving = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    title: ["", [Validators.required, Validators.minLength(2)]],
    description: [""],
    status: ["todo", [Validators.required]],
    priority: ["medium", [Validators.required]],
    dueDate: [""],
    assignee: [""], // تم التغيير من assigneeId إلى assignee
  });

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
        const t = res.data;
        if (t) {
          this.form.patchValue({
            title: t.title,
            description: t.description ?? "",
            status: t.status,
            priority: t.priority,
            dueDate: t.dueDate ?? "",
            assignee: t.assignee ?? "", // تم التغيير هنا أيضاً
          });
        }
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const id = this.taskId();
    if (!id) return;

    this.taskService
      .update(id, this.form.getRawValue() as Partial<Task>)
      .subscribe({
        next: () => {
          this.router.navigate([
            "/workspaces",
            this.workspaceId(),
            "projects",
            this.projectId(),
            "tasks",
            id,
          ]);
        },
        error: () => {
          this.error.set("Failed to update task.");
          this.saving.set(false);
        },
      });
  }
}
