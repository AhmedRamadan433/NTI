import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { WorkspaceService } from "../../../services/workspace";

@Component({
  selector: "app-create-workspace",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./create-workspace.html",
  styleUrl: "./create-workspace.css",
})
export class CreateWorkspace {
  private fb = inject(FormBuilder);
  private workspaceService = inject(WorkspaceService);
  private router = inject(Router);

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    slug: ["", [Validators.required, Validators.pattern("^[a-z0-9-]+$")]],
    description: [""],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.workspaceService.create(this.form.getRawValue()).subscribe({
      next: (res) => {
        if (res.data?._id) {
          this.router.navigate(["/workspaces", res.data._id]);
        } else {
          this.router.navigate(["/workspaces"]);
        }
      },
      error: () => {
        this.error.set("Failed to create workspace. Please try again.");
        this.loading.set(false);
      },
    });
  }
}
