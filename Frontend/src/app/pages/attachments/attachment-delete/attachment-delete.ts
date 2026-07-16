import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentService } from '../../../services/attachment';
import { Attachment } from '../../../models/attachment.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-attachment-delete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attachment-delete.html',
  styleUrl: './attachment-delete.css',
})
export class AttachmentDelete {
  private attachmentService = inject(AttachmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected attachmentId = '';
  protected attachment = signal<Attachment | null>(null);
  protected loading = signal(true);
  protected deleting = signal(false);

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

  confirmDelete(): void {
    this.deleting.set(true);
    this.attachmentService.delete(this.attachmentId).subscribe({
      next: () => {
        this.router.navigate(['/attachments']);
      },
      error: () => this.deleting.set(false),
    });
  }

  cancel(): void {
    this.router.navigate(['/attachments']);
  }
}
