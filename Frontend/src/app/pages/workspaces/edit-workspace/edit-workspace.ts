import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace';
import { Workspace } from '../../../models/workspace.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-edit-workspace',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-workspace.html',
  styleUrl: './edit-workspace.css',
})
export class EditWorkspace {
  private fb = inject(FormBuilder);
  private workspaceService = inject(WorkspaceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
    description: [''],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('workspaceId');
    if (id) {
      this.workspaceService.getById(id).subscribe({
        next: (res: ApiResponse<Workspace>) => {
          const ws = res.data;
          if (ws) {
            this.form.patchValue({
              name: ws.name,
              slug: ws.slug,
              description: ws.description ?? '',
            });
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.loading.set(false);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('workspaceId');
    if (!id) return;

    this.saving.set(true);
    this.error.set(null);

    this.workspaceService.update(id, this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/workspaces', id]);
      },
      error: () => {
        this.error.set('Failed to update workspace.');
        this.saving.set(false);
      },
    });
  }
}
