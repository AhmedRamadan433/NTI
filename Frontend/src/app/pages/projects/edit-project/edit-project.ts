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
import { ProjectService } from "../../../services/project";
import { Project } from "../../../models/project.model";
import { ApiResponse } from "../../../models/api-response.model";

@Component({
  selector: "app-edit-project",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./edit-project.html",
  styleUrl: "./edit-project.css",
})
export class EditProject {
  workspaceId = input<string>();
  projectId = input<string>();

  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected loading = signal(true);
  protected saving = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    projectName: ["", [Validators.required, Validators.minLength(3)]],
    projectDescription: ["", [Validators.required, Validators.minLength(10)]],
    projectStatus: ["Not Started", [Validators.required]],
    projectPriority: ["Medium", [Validators.required]],
    projectEndDate: [""],
  });

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) {
        this.loadProject(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadProject(id: string): void {
    this.projectService.getById(id).subscribe({
      next: (res: ApiResponse<Project>) => {
        const p = res.data;
        if (p) {
          this.form.patchValue({
            projectName: p.projectName,
            projectDescription: p.projectDescription ?? "",
            projectStatus: p.projectStatus,
            projectPriority: p.projectPriority ?? "Medium",
            projectEndDate: p.projectEndDate
              ? p.projectEndDate.substring(0, 10)
              : "", // Format date for input
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

    const id = this.projectId();
    if (!id) return;

    this.projectService
      .update(id, this.form.getRawValue() as Partial<Project>)
      .subscribe({
        next: () => {
          this.router.navigate([
            "/workspaces",
            this.workspaceId(),
            "projects",
            id,
          ]);
        },
        error: () => {
          this.error.set("Failed to update project.");
          this.saving.set(false);
        },
      });
  }
}
