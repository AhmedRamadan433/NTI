import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  input,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { TaskService } from "../../../services/task";
import { Task } from "../../../models/task.model";

@Component({
  selector: "app-task-create",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./task-create.html",
  styleUrl: "./task-create.css",
})
export class TaskCreate {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);

  workspaceId = input<string>();
  projectId = input<string>();

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    description: [""],
    status: ["To_Do", [Validators.required]],
    priority: ["medium", [Validators.required]],
    endDate: [""],
    assignedTo: this.fb.nonNullable.control<string[]>([]),
  });

  protected onAssignedToChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const ids = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    this.form.controls.assignedTo.setValue(ids);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const projId = this.projectId();
    if (!projId) return;

    const data = {
      ...this.form.getRawValue(),
      project: projId,
      labels: [],
    } as Partial<Task>;

    this.taskService.create(projId, data).subscribe({
      next: (res) => {
        if (res.data?._id) {
          this.router.navigate([
            "/workspaces",
            this.workspaceId(),
            "projects",
            projId,
            "tasks",
            res.data._id,
          ]);
        } else {
          this.router.navigate([
            "/workspaces",
            this.workspaceId(),
            "projects",
            projId,
            "tasks",
          ]);
        }
      },
      error: () => {
        this.error.set("Failed to create task.");
        this.loading.set(false);
      },
    });
  }
}
