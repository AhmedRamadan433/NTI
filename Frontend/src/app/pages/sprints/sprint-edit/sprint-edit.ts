import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SprintService } from '../../../services/sprint';
import { Sprint } from '../../../models/sprint.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-sprint-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sprint-edit.html',
  styleUrl: './sprint-edit.css',
})
export class SprintEdit {
  private fb = inject(FormBuilder);
  private sprintService = inject(SprintService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected workspaceId = '';
  protected projectId = '';
  protected sprintId = '';
  protected loading = signal(true);
  protected saving = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    goal: [''],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    status: ['planning', [Validators.required]],
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.workspaceId = params.get('workspaceId') ?? '';
      this.projectId = params.get('projectId') ?? '';
      this.sprintId = params.get('sprintId') ?? '';
      if (this.sprintId) {
        this.loadSprint();
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadSprint(): void {
    this.sprintService.getById(this.sprintId).subscribe({
      next: (res: ApiResponse<Sprint>) => {
        const s = res.data;
        if (s) {
          this.form.patchValue({
            name: s.name,
            goal: s.goal ?? '',
            startDate: s.startDate,
            endDate: s.endDate,
            status: s.status,
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.sprintService.update(this.sprintId, this.form.getRawValue() as Partial<Sprint>).subscribe({
      next: () => {
        this.router.navigate(['/workspaces', this.workspaceId, 'projects', this.projectId, 'sprints', this.sprintId]);
      },
      error: () => {
        this.error.set('Failed to update sprint.');
        this.saving.set(false);
      },
    });
  }
}
