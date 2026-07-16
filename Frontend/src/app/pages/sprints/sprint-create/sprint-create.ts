import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  selector: "app-create-sprint",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sprint-create.html",
  styleUrl: "./sprint-create.css",
})
export class CreateSprint {
  workspaceId = input<string>();
  projectId = input<string>();

  private fb = inject(FormBuilder);
  private sprintService = inject(SprintService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    goal: [""],
    startDate: ["", [Validators.required]],
    endDate: ["", [Validators.required]],
    status: ["planned", [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const projId = this.projectId();
    if (!projId) {
      this.error.set("Project ID is missing!");
      return;
    }

    if (this.form.value.endDate! <= this.form.value.startDate!) {
      this.error.set("End date must be after start date.");
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const data = this.form.getRawValue() as Partial<Sprint>;

    this.sprintService.create(projId, data).subscribe({
      next: (res) => {
        const wsId = this.workspaceId();
        if (res.data?._id) {
          this.router.navigate([
            "/workspaces",
            wsId,
            "projects",
            projId,
            "sprints",
            res.data._id,
          ]);
        } else {
          this.router.navigate([
            "/workspaces",
            wsId,
            "projects",
            projId,
            "sprints",
          ]);
        }
      },
      error: () => {
        this.error.set("Failed to create sprint.");
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
