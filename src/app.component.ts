
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SettingsService } from './services/settings.service';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: [':host { display: block; height: 100vh; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private settingsService = inject(SettingsService);
  private translationService = inject(TranslationService);

  ngOnInit(): void {
    // Check auth status
    this.authService.checkAuthStatus().catch(err => {
      console.error('Error checking auth status:', err);
    });

    // Initialize settings and apply them (especially dark mode before anything renders)
    const settings = this.settingsService.getSettings();
    
    // Apply dark mode immediately to prevent flash
    this.settingsService.applyDarkMode(settings.darkMode);
    this.settingsService.applySettings(settings);
    
    // Initialize language
    this.translationService.setLanguage(settings.language as any);
  }
}
