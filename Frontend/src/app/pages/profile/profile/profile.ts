import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { StorageService } from "../../../services/storage";
import { User } from "../../../models/user.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./profile.html",
  styleUrl: "./profile.css",
})
export class Profile {
  private fb = inject(FormBuilder);
  private storage = inject(StorageService);

  protected saving = signal(false);
  protected saved = signal(false);

  protected form = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    avatarUrl: [""],
  });

  constructor() {
    const user = this.storage.getUser<User>();
    if (user) {
      this.form.patchValue({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatarUrl: user.userImage ?? "",
      });
    }
  }

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
