import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace';
import { Workspace } from '../../../models/workspace.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-workspace-list',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workspace-list.html',
  styleUrl: './workspace-list.css',
})
export class WorkspaceList {
  private workspaceService = inject(WorkspaceService);
  private cdr = inject(ChangeDetectorRef);

  protected workspaces = signal<Workspace[]>([]);
  protected loading = signal(true);

  constructor() {
    this.workspaceService.list().subscribe({
      next: (res: ApiResponse<Workspace[]>) => {
        this.workspaces.set(res.data ?? []);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.workspaces.set([]);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
