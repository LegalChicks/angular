
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
})
export class PasswordResetComponent {
  loading = signal(false);
  successMessage = signal<string | null>(null);

  resetForm = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.resetForm.invalid) return;

    this.loading.set(true);
    this.successMessage.set(null);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.loading.set(false);
    this.successMessage.set(
      `If an account exists for ${this.resetForm.value.email}, a password reset link has been sent.`
    );
    this.resetForm.reset();
  }
}
