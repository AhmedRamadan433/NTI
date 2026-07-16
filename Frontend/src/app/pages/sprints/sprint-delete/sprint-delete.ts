import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SprintService } from '../../../services/sprint';
import { Sprint } from '../../../models/sprint.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-sprint-delete',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sprint-delete.html',
  styleUrl: './sprint-delete.css',
})
export class SprintDelete {
  private sprintService = inject(SprintService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected workspaceId = '';
  protected projectId = '';
  protected sprintId = '';
  protected sprint = signal<Sprint | null>(null);
  protected loading = signal(true);
  protected deleting = signal(false);

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
        this.sprint.set(res.data ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmDelete(): void {
    this.deleting.set(true);
    this.sprintService.delete(this.sprintId).subscribe({
      next: () => {
        this.router.navigate(['/workspaces', this.workspaceId, 'projects', this.projectId, 'sprints']);
      },
      error: () => this.deleting.set(false),
    });
  }
}
