import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService, UserSettings } from '../../../services/settings.service';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { firstValueFrom } from 'rxjs';

interface NotificationSettings {
  newMembers: boolean;
  weeklySummary: boolean;
  supplyUpdates: boolean;
  emailNotifications: boolean;
}

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private authService = inject(AuthService);
  private translationService = inject(TranslationService);
  private fb = inject(FormBuilder);

  // User info
  currentUser = this.authService.currentUser;
  t = this.translationService.t;
  currentLanguage = this.translationService.currentLanguage;

  // Settings state
  language = signal('en');
  darkMode = signal(false);
  notifications = signal<NotificationSettings>({
    newMembers: true,
    weeklySummary: false,
    supplyUpdates: true,
    emailNotifications: true,
  });

  // UI state
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showPasswordModal = signal(false);
  activeTab = signal<'general' | 'security'>('general');

  // Password change form
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    this.loadSettings();
  }

  private passwordMatchValidator(form: any) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  loadSettings() {
    const settings = this.settingsService.getSettings();
    this.language.set(settings.language);
    this.darkMode.set(settings.darkMode);
    this.notifications.set(settings.notifications);
    
    // Apply settings immediately
    this.settingsService.applySettings(settings);
    
    // Sync with translation service
    this.translationService.setLanguage(settings.language as any);
  }

  async saveSettings() {
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const settings: UserSettings = {
        language: this.language(),
        darkMode: this.darkMode(),
        notifications: this.notifications(),
      };

      await firstValueFrom(this.settingsService.saveSettings(settings));
      
      // Apply settings (including dark mode immediately)
      this.settingsService.applyDarkMode(settings.darkMode);
      this.settingsService.applySettings(settings);
      
      this.successMessage.set('Settings saved successfully!');
      setTimeout(() => this.successMessage.set(null), 3000);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to save settings. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  toggleDarkMode() {
    this.darkMode.update(value => !value);
    // Apply dark mode immediately
    const settings = this.settingsService.getSettings();
    settings.darkMode = this.darkMode();
    this.settingsService.applyDarkMode(this.darkMode());
    // Auto-save appearance changes
    this.saveSettings();
  }

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newLang = select.value as any;
    this.language.set(newLang);
    this.translationService.setLanguage(newLang);
    // Auto-save language changes
    this.saveSettings();
  }

  toggleNotification(key: keyof NotificationSettings) {
    this.notifications.update(current => ({
      ...current,
      [key]: !current[key]
    }));
    // Auto-save notification changes
    this.saveSettings();
  }

  openPasswordModal() {
    this.passwordForm.reset();
    this.showPasswordModal.set(true);
    this.errorMessage.set(null);
  }

  closePasswordModal() {
    this.showPasswordModal.set(false);
    this.passwordForm.reset();
    this.errorMessage.set(null);
  }

  async changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.errorMessage.set('Please fill in all fields correctly.');
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      // TODO: Implement password change API call
      // For now, show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.successMessage.set('Password changed successfully!');
      this.closePasswordModal();
      setTimeout(() => this.successMessage.set(null), 3000);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to change password. Please check your current password and try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  setActiveTab(tab: 'general' | 'security') {
    this.activeTab.set(tab);
    this.errorMessage.set(null);
  }
}