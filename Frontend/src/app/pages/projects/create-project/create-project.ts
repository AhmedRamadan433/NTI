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
import { ProjectService } from "../../../services/project";
import { Project } from "../../../models/project.model";

@Component({
  selector: "app-create-project",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./create-project.html",
  styleUrl: "./create-project.css",
})
export class CreateProject {
  workspaceId = input<string>();

  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    projectName: ["", [Validators.required, Validators.minLength(3)]],
    projectDescription: ["", [Validators.required, Validators.minLength(10)]],
    projectStatus: ["Not Started", [Validators.required]],
    projectPriority: ["Medium", [Validators.required]],
    projectEndDate: [""],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const wsId = this.workspaceId();
    if (!wsId) {
      this.error.set("Workspace ID is missing!");
      this.loading.set(false);
      return;
    }

    // Send workspace with the form data
    const data = {
      ...this.form.getRawValue(),
      workspace: wsId,
    } as Partial<Project>;

    this.projectService.create(wsId, data).subscribe({
      next: (res) => {
        if (res.data?._id) {
          this.router.navigate(["/workspaces", wsId, "projects", res.data._id]);
        } else {
          this.router.navigate(["/workspaces", wsId, "projects"]);
        }
      },
      error: () => {
        this.error.set("Failed to create project.");
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
