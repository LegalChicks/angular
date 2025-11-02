import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  user = this.authService.currentUser;
  isEditing = signal(false);
  isSaving = signal(false);
  successMessage = signal<string | null>(null);

  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    // FIX: Widened the type of the visibility control to accept both 'public' and 'private'.
    // The previous type `'public' as const` was too narrow, causing an error when patching the form
    // with user data where visibility could also be 'private'.
    visibility: ['public' as 'public' | 'private', Validators.required],
  });

  ngOnInit() {
    this.updateFormValues();
    this.profileForm.disable();
  }
  
  updateFormValues() {
    const currentUser = this.user();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name,
        email: currentUser.email,
        visibility: currentUser.visibility
      });
    }
  }

  toggleEdit() {
    this.isEditing.update(editing => !editing);
    if (this.isEditing()) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      // Reset form to original values if cancelled
      this.updateFormValues();
    }
    this.successMessage.set(null);
  }

  async onSave() {
    if (this.profileForm.invalid || !this.user()) return;

    this.isSaving.set(true);
    this.successMessage.set(null);

    try {
      await this.authService.updateProfile(this.user()!.id, {
        name: this.profileForm.value.name!,
        email: this.profileForm.value.email!,
        visibility: this.profileForm.value.visibility!
      });
      this.successMessage.set('Profile updated successfully!');
      this.isEditing.set(false);
      this.profileForm.disable();
    } catch (error) {
       console.error('Failed to update profile', error);
       // In a real app, show an error message to the user
    } finally {
        this.isSaving.set(false);
    }
  }
}