import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../services/project';
import { Project } from '../../../models/project.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-delete-project',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-project.html',
  styleUrl: './delete-project.css',
})
export class DeleteProject {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected workspaceId = '';
  protected projectId = '';
  protected project = signal<Project | null>(null);
  protected loading = signal(true);
  protected deleting = signal(false);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.workspaceId = params.get('workspaceId') ?? '';
      this.projectId = params.get('projectId') ?? '';
      if (this.projectId) {
        this.loadProject();
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadProject(): void {
    this.projectService.getById(this.projectId).subscribe({
      next: (res: ApiResponse<Project>) => {
        this.project.set(res.data ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmDelete(): void {
    this.deleting.set(true);
    this.projectService.delete(this.projectId).subscribe({
      next: () => {
        this.router.navigate(['/workspaces', this.workspaceId, 'projects']);
      },
      error: () => this.deleting.set(false),
    });
  }
}
