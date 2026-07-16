import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AttachmentService } from '../../../services/attachment';
import { Attachment } from '../../../models/attachment.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-attachment-list',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attachment-list.html',
  styleUrl: './attachment-list.css',
})
export class AttachmentList {
  private attachmentService = inject(AttachmentService);

  protected attachments = signal<Attachment[]>([]);
  protected loading = signal(true);

  constructor() {
    this.attachmentService.list().subscribe({
      next: (res: ApiResponse<Attachment[]>) => {
        this.attachments.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.attachments.set([]);
        this.loading.set(false);
      },
    });
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
}
