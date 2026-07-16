import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private fb = inject(FormBuilder);

  protected saving = signal(false);
  protected saved = signal(false);

  protected form = this.fb.nonNullable.group({
    theme: ['light', [Validators.required]],
    emailNotifications: [true],
    pushNotifications: [false],
    timezone: ['UTC', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saved.set(false);

    setTimeout(() => {
      this.saving.set(false);
      this.saved.set(true);
    }, 800);
  }
}
