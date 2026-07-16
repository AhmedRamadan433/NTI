import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AttachmentService } from '../../../services/attachment';
import { Attachment } from '../../../models/attachment.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-attachment-details',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attachment-details.html',
  styleUrl: './attachment-details.css',
})
export class AttachmentDetails {
  private attachmentService = inject(AttachmentService);
  private route = inject(ActivatedRoute);

  protected attachmentId = '';
  protected attachment = signal<Attachment | null>(null);
  protected loading = signal(true);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.attachmentId = params.get('id') ?? '';
      if (this.attachmentId) {
        this.loadAttachment();
      } else {
        this.loading.set(false);
      }
    });
  }

  private loadAttachment(): void {
    this.attachmentService.getById(this.attachmentId).subscribe({
      next: (res: ApiResponse<Attachment>) => {
        this.attachment.set(res.data ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
}
