
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { TranslationService, Language } from '../../../services/translation.service';
import { NotificationsMenuComponent } from '../../../components/notifications-menu/notifications-menu.component';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationsMenuComponent],
})
export class DashboardLayoutComponent implements OnInit {
  authService = inject(AuthService);
  translationService = inject(TranslationService);
  
  user = this.authService.currentUser;
  t = this.translationService.t;
  currentLanguage = this.translationService.currentLanguage;
  
  isSidebarOpen = signal(true);
  isProfileMenuOpen = signal(false);
  isLanguageMenuOpen = signal(false);

  languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
    { code: 'il', name: 'Ilocano', flag: '🇵🇭' },
  ];

  ngOnInit() {
    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.language-menu') && !target.closest('.language-button')) {
        this.isLanguageMenuOpen.set(false);
      }
      if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
        this.isProfileMenuOpen.set(false);
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen.update(open => !open);
  }
  
  toggleProfileMenu() {
    this.isProfileMenuOpen.update(open => !open);
  }

  toggleLanguageMenu() {
    this.isLanguageMenuOpen.update(open => !open);
  }

  changeLanguage(lang: Language) {
    this.translationService.setLanguage(lang);
    this.isLanguageMenuOpen.set(false);
  }

  getCurrentLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.currentLanguage());
    return lang ? `${lang.flag} ${lang.name}` : '🇺🇸 English';
  }

  logout() {
    this.isProfileMenuOpen.set(false);
    this.authService.logout();
  }
}
