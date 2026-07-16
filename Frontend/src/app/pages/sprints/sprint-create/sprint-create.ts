import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  input,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SprintService } from "../../../services/sprint";
import { Sprint } from "../../../models/sprint.model";

@Component({
  selector: "app-sprint-create",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sprint-create.html",
  styleUrl: "./sprint-create.css",
})
export class SprintCreate {
  private fb = inject(FormBuilder);
  private sprintService = inject(SprintService);
  private router = inject(Router);

  workspaceId = input<string>();
  projectId = input<string>();

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    goal: [""],
    startDate: ["", [Validators.required]],
    endDate: ["", [Validators.required]],
    status: ["planning", [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const projId = this.projectId();
    if (!projId) return;

    const data: any = {
      ...this.form.getRawValue(),
      project: projId,
    } as Partial<Sprint>;

    this.sprintService.create(projId, data).subscribe({
      next: (res) => {
        if (res.data?._id) {
          this.router.navigate([
            "/workspaces",
            this.workspaceId(),
            "projects",
            projId,
            "sprints",
            res.data._id,
          ]);
        } else {
          this.router.navigate([
            "/workspaces",
            this.workspaceId(),
            "projects",
            projId,
            "sprints",
          ]);
        }
      },
      error: () => {
        this.error.set("Failed to create sprint.");
        this.loading.set(false);
      },
    });
  }
}
