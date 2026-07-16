import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  input,
  effect,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SprintService } from "../../../services/sprint";
import { Sprint } from "../../../models/sprint.model";
import { ApiResponse } from "../../../models/api-response.model";

function endAfterStartValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get("startDate")?.value;
    const end = group.get("endDate")?.value;
    if (!start || !end) return null;
    return end > start ? null : { endBeforeStart: true };
  };
}

@Component({
  selector: "app-edit-sprint",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sprint-edit.html",
  styleUrl: "./sprint-edit.css",
})
export class EditSprint {
  workspaceId = input<string>();
  projectId = input<string>();
  sprintId = input<string>();

  private fb = inject(FormBuilder);
  private sprintService = inject(SprintService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected loading = signal(true);
  protected saving = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group(
    {
      name: ["", [Validators.required, Validators.minLength(2)]],
      goal: [""],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      status: ["planned", [Validators.required]],
    },
    { validators: endAfterStartValidator() },
  );

  constructor() {
    effect(() => {
      const id = this.sprintId();
      if (id) {
        this.loadSprint(id);
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadSprint(id: string): void {
    this.sprintService.getById(id).subscribe({
      next: (res: ApiResponse<Sprint>) => {
        const s = res.data;
        if (s) {
          this.form.patchValue({
            name: s.name,
            goal: s.goal ?? "",
            startDate: s.startDate ? s.startDate.substring(0, 10) : "",
            endDate: s.endDate ? s.endDate.substring(0, 10) : "",
            status: s.status,
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

    const id = this.sprintId();
    if (!id) return;

    this.saving.set(true);
    this.error.set(null);

    this.sprintService
      .update(id, this.form.getRawValue() as Partial<Sprint>)
      .subscribe({
        next: () => {
          this.router.navigate([
            "/workspaces",
            this.workspaceId(),
            "projects",
            this.projectId(),
            "sprints",
            id,
          ]);
        },
        error: () => {
          this.error.set("Failed to update sprint.");
          this.saving.set(false);
          this.cdr.markForCheck();
        },
      });
  }
}
