import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AttachmentService } from "../../../services/attachment";

@Component({
  selector: "app-attachment-upload",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./attachment-upload.html",
  styleUrl: "./attachment-upload.css",
})
export class AttachmentUpload {
  private attachmentService = inject(AttachmentService);
  private router = inject(Router);

  protected uploading = signal(false);
  protected error = signal<string | null>(null);
  protected selectedFile = signal<File | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) {
      this.error.set("Please select a file first.");
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    const formData = new FormData();
    formData.append("file", file);

    this.attachmentService.upload(formData).subscribe({
      next: (res) => {
        if (res.data?._id) {
          this.router.navigate(["/attachments", res.data._id]);
        } else {
          this.router.navigate(["/attachments"]);
        }
      },
      error: () => {
        this.error.set("Upload failed. Please try again.");
        this.uploading.set(false);
      },
    });
  }
}
